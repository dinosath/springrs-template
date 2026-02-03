import { splitProps, Component, ParentComponent, JSX } from 'solid-js'
import { cn } from '@/lib/utils'

export const Card: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <div
      class={cn('rounded-lg border bg-card text-card-foreground shadow-sm', local.class)}
      {...rest}
    >
      {local.children}
    </div>
  )
}

export const CardHeader: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <div class={cn('flex flex-col space-y-1.5 p-6', local.class)} {...rest}>
      {local.children}
    </div>
  )
}

export const CardTitle: ParentComponent<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <h3 class={cn('text-2xl font-semibold leading-none tracking-tight', local.class)} {...rest}>
      {local.children}
    </h3>
  )
}

export const CardDescription: ParentComponent<JSX.HTMLAttributes<HTMLParagraphElement>> = (
  props
) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <p class={cn('text-sm text-muted-foreground', local.class)} {...rest}>
      {local.children}
    </p>
  )
}

export const CardContent: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <div class={cn('p-6 pt-0', local.class)} {...rest}>
      {local.children}
    </div>
  )
}

export const CardFooter: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <div class={cn('flex items-center p-6 pt-0', local.class)} {...rest}>
      {local.children}
    </div>
  )
}
