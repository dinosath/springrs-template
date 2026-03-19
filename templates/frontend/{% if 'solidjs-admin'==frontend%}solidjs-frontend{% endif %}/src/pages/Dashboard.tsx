import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { LayoutDashboard, Users, FileText, TrendingUp } from 'lucide-solid'

export const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, change: '+12%' },
    { title: 'Total Documents', value: '567', icon: FileText, change: '+8%' },
    { title: 'Active Sessions', value: '89', icon: LayoutDashboard, change: '+23%' },
    { title: 'Growth', value: '34%', icon: TrendingUp, change: '+5%' },
  ]

  return (
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">Dashboard</h1>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon class="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{stat.value}</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-green-500">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="h-2 w-2 rounded-full bg-green-500" />
                <div class="flex-1">
                  <p class="text-sm font-medium">New user registered</p>
                  <p class="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="h-2 w-2 rounded-full bg-blue-500" />
                <div class="flex-1">
                  <p class="text-sm font-medium">Document updated</p>
                  <p class="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="h-2 w-2 rounded-full bg-yellow-500" />
                <div class="flex-1">
                  <p class="text-sm font-medium">Settings changed</p>
                  <p class="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-4">
              <button class="flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-accent">
                <Users class="mb-2 h-6 w-6" />
                <span class="text-sm">Add User</span>
              </button>
              <button class="flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-accent">
                <FileText class="mb-2 h-6 w-6" />
                <span class="text-sm">New Document</span>
              </button>
              <button class="flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-accent">
                <TrendingUp class="mb-2 h-6 w-6" />
                <span class="text-sm">View Reports</span>
              </button>
              <button class="flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-accent">
                <LayoutDashboard class="mb-2 h-6 w-6" />
                <span class="text-sm">Settings</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
