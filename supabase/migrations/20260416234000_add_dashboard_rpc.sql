CREATE OR REPLACE FUNCTION get_dashboard_stats(p_ano INT)
RETURNS jsonb AS $func$
DECLARE
  v_total_empresas INT;
  v_tarefas_ano_aberto INT;
  v_tarefas_ano_concluido INT;
  v_tarefas_ano_total INT;
  v_tarefas_global_pendente INT;
  v_tarefas_global_aberto INT;
  v_tarefas_global_concluido INT;
  v_tarefas_global_total INT;
  v_chart_data jsonb;
  v_categories_data jsonb;
  v_top_empresas jsonb;
BEGIN
  -- Total empresas
  SELECT count(*) INTO v_total_empresas FROM public.empresas;

  -- Tarefas ano
  SELECT
    count(*) FILTER (WHERE status = 'aberto'),
    count(*) FILTER (WHERE status = 'concluido'),
    count(*)
  INTO v_tarefas_ano_aberto, v_tarefas_ano_concluido, v_tarefas_ano_total
  FROM public.empresa_timeline
  WHERE ano = p_ano;

  -- Tarefas global
  SELECT
    count(*) FILTER (WHERE status = 'nao_iniciado'),
    count(*) FILTER (WHERE status = 'aberto'),
    count(*) FILTER (WHERE status = 'concluido'),
    count(*)
  INTO v_tarefas_global_pendente, v_tarefas_global_aberto, v_tarefas_global_concluido, v_tarefas_global_total
  FROM public.empresa_timeline;

  -- Chart data (global)
  WITH months AS (
    SELECT generate_series(1, 12) AS mes,
           (ARRAY['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'])[generate_series(1,12)] as month_name
  ),
  monthly_stats AS (
    SELECT
      mes,
      count(*) FILTER (WHERE status = 'concluido') as concluido,
      count(*) FILTER (WHERE status = 'aberto') as aberto,
      count(*) FILTER (WHERE status = 'nao_iniciado') as pendente
    FROM public.empresa_timeline
    GROUP BY mes
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'day', m.month_name,
      'concluido', COALESCE(s.concluido, 0),
      'aberto', COALESCE(s.aberto, 0),
      'pendente', COALESCE(s.pendente, 0),
      'total', COALESCE(s.concluido, 0) + COALESCE(s.aberto, 0) + COALESCE(s.pendente, 0)
    ) ORDER BY m.mes
  ) INTO v_chart_data
  FROM months m
  LEFT JOIN monthly_stats s ON m.mes = s.mes;

  -- Categories (by regime_tributario)
  WITH regimes AS (
    SELECT unnest(ARRAY['Lucro Real Mensal', 'Lucro Real Trimestral', 'Lucro Presumido', 'Simples Nacional', 'Simples Nacional Hibrido']) AS regime
  ),
  emp_regimes AS (
    SELECT
      CASE
        WHEN regime_tributario IN ('Simples Nacional Hibrido', 'Simples Nacional Híbrido') THEN 'Simples Nacional Hibrido'
        ELSE regime_tributario
      END as rt
    FROM public.empresas
  ),
  regime_counts AS (
    SELECT rt, count(*) as val
    FROM emp_regimes
    GROUP BY rt
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', CASE WHEN r.regime = 'Simples Nacional Hibrido' THEN 'Simples Nacional Híbrido' ELSE r.regime END,
      'value', COALESCE(c.val, 0),
      'percent', CASE WHEN v_total_empresas > 0 THEN ROUND((COALESCE(c.val, 0)::numeric / v_total_empresas) * 100) ELSE 0 END
    ) ORDER BY COALESCE(c.val, 0) DESC
  ) INTO v_categories_data
  FROM regimes r
  LEFT JOIN regime_counts c ON r.regime = c.rt;

  -- Top Empresas
  SELECT jsonb_agg(t) INTO v_top_empresas
  FROM (
    SELECT
      e.id,
      e.nome,
      count(et.id) FILTER (WHERE et.status = 'concluido') as concluidas,
      count(et.id) FILTER (WHERE et.status = 'aberto') as aberto,
      count(et.id) FILTER (WHERE et.status = 'nao_iniciado') as pendentes,
      CASE
        WHEN count(et.id) > 0 THEN ROUND((count(et.id) FILTER (WHERE et.status = 'concluido')::numeric / count(et.id)) * 100)
        ELSE 0
      END as progresso
    FROM public.empresas e
    LEFT JOIN public.empresa_timeline et ON e.id = et.empresa_id AND et.ano = p_ano
    GROUP BY e.id, e.nome
    ORDER BY count(et.id) FILTER (WHERE et.status = 'concluido') DESC, e.nome ASC
    LIMIT 100
  ) t;

  RETURN jsonb_build_object(
    'totalEmpresas', v_total_empresas,
    'tarefasAnoAberto', COALESCE(v_tarefas_ano_aberto, 0),
    'tarefasAnoConcluido', COALESCE(v_tarefas_ano_concluido, 0),
    'tarefasAnoTotal', COALESCE(v_tarefas_ano_total, 0),
    'tarefasGlobalPendente', COALESCE(v_tarefas_global_pendente, 0),
    'tarefasGlobalAberto', COALESCE(v_tarefas_global_aberto, 0),
    'tarefasGlobalConcluido', COALESCE(v_tarefas_global_concluido, 0),
    'tarefasGlobalTotal', COALESCE(v_tarefas_global_total, 0),
    'chartData', COALESCE(v_chart_data, '[]'::jsonb),
    'categoriesData', COALESCE(v_categories_data, '[]'::jsonb),
    'topEmpresasData', COALESCE(v_top_empresas, '[]'::jsonb)
  );
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;
