import { splitProps, Component, JSX } from 'solid-js'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const Checkbox: Component<CheckboxProps> = (props) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <input
      type="checkbox"
      class={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        local.class
      )}
      {...rest}
    />
  )
}
