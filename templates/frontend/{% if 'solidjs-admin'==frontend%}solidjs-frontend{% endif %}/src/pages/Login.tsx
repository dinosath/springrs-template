import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { toast } from 'solid-sonner'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [isLoading, setIsLoading] = createSignal(false)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email(), password())
      toast.success('Logged in successfully')
      navigate('/')
    } catch (error) {
      toast.error('Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div class="flex min-h-screen items-center justify-center bg-background">
      <Card class="w-full max-w-md">
        <CardHeader class="text-center">
          <CardTitle class="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" class="w-full" disabled={isLoading()}>
              {isLoading() ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
