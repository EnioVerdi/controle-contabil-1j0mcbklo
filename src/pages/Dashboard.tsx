import { KpiCard } from '@/components/dashboard/KpiCard'
import { PerformanceSummary } from '@/components/dashboard/PerformanceSummary'
import { TopCategories } from '@/components/dashboard/TopCategories'
import { TopUsersTable } from '@/components/dashboard/TopUsersTable'
import { ExpenseBreakdown } from '@/components/dashboard/ExpenseBreakdown'

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Top KPI Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Revenue Achieved"
          value="$1,18,000"
          target="1,50,000"
          trend={6}
          progress={78}
          colorClass="bg-blue-100"
          progressColorClass="bg-blue-500"
        />
        <KpiCard
          title="Profit Margin (%)"
          value="27"
          target="30"
          trend={-6}
          progress={90}
          colorClass="bg-green-100"
          progressColorClass="bg-green-500"
        />
        <KpiCard
          title="Customer Growth"
          value="325"
          target="400"
          trend={6}
          progress={80}
          colorClass="bg-purple-100"
          progressColorClass="bg-purple-500"
        />
        <KpiCard
          title="Churn Rate (%)"
          value="3.1"
          target="2.5"
          trend={-6}
          progress={35}
          colorClass="bg-yellow-100"
          progressColorClass="bg-yellow-400"
        />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceSummary />
        </div>
        <div className="lg:col-span-1">
          <TopCategories />
        </div>
      </div>

      {/* Bottom Row: Table & Visual Flow */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopUsersTable />
        </div>
        <div className="lg:col-span-1">
          <ExpenseBreakdown />
        </div>
      </div>
    </div>
  )
}
