import { splitProps, Component, JSX, For, Accessor } from 'solid-js'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  options: SelectOption[]
  value?: Accessor<string> | string
  error?: string
  placeholder?: string
}

export const Select: Component<SelectProps> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'options', 'value', 'error', 'placeholder'])

  const currentValue = () => {
    const v = local.value
    return typeof v === 'function' ? v() : v
  }

  return (
    <select
      class={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        local.error && 'border-destructive',
        local.class
      )}
      value={currentValue()}
      {...rest}
    >
      {local.placeholder && (
        <option value="" disabled>
          {local.placeholder}
        </option>
      )}
      <For each={local.options}>
        {(option) => <option value={option.value}>{option.label}</option>}
      </For>
    </select>
  )
}
