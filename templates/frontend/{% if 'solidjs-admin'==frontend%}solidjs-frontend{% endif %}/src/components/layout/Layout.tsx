import { ParentComponent, createSignal } from 'solid-js'
import { Outlet } from '@solidjs/router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export const Layout: ParentComponent = () => {
  const [collapsed, setCollapsed] = createSignal(false)

  return (
    <div class="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed()} onToggle={() => setCollapsed(!collapsed())} />
      <div class="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main class="flex-1 overflow-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
