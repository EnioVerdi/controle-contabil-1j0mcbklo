import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logoVerdi from '@/assets/image-c1f91.png'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || searchParams.get('code')

  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [status, setStatus] = useState<'empty' | 'loading' | 'error' | 'success'>('empty')
  const [errorMessage, setErrorMessage] = useState('')

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return false
    if (!/[a-zA-Z]/.test(pass)) return false
    if (!/[0-9]/.test(pass)) return false
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (password !== confirmPassword) {
      setStatus('error')
      setErrorMessage('As senhas não coincidem.')
      return
    }

    if (!validatePassword(password)) {
      setStatus('error')
      setErrorMessage('A senha deve ter pelo menos 8 caracteres, incluindo letra e número.')
      return
    }

    setStatus('loading')

    if (token) {
      // Tenta trocar o token por uma sessão caso seja o fluxo PKCE
      await supabase.auth.exchangeCodeForSession(token).catch(() => {})
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
      return
    }

    setStatus('success')

    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <img src={logoVerdi} alt="Verdi Oelke" className="h-20 w-auto object-contain mb-4" />
          <h1 className="text-xl font-semibold text-slate-800">Redefinir Senha</h1>
          <p className="text-slate-500 text-sm text-center mt-1">Digite sua nova senha abaixo.</p>
        </div>

        {status === 'success' ? (
          <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>
              Senha alterada com sucesso. Redirecionando para login...
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={status === 'loading'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={status === 'loading'}
              />
            </div>

            <Button type="submit" className="w-full h-11 mt-2" disabled={status === 'loading'}>
              {status === 'loading' ? 'Redefinindo...' : 'Redefinir Senha'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
