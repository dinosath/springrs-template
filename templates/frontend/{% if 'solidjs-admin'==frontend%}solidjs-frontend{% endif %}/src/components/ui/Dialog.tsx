import { createSignal, createEffect, Show, ParentComponent, JSX } from 'solid-js'
import { Portal } from 'solid-js/web'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { X } from 'lucide-solid'

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: JSX.Element
}

export const Dialog: ParentComponent<DialogProps> = (props) => {
  return <Show when={props.open}>{props.children}</Show>
}

export interface DialogContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
}

export const DialogContent: ParentComponent<DialogContentProps> = (props) => {
  return (
    <Portal>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div
          class="fixed inset-0 bg-black/50"
          onClick={props.onClose}
        />
        <div
          class={cn(
            'relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
            props.class
          )}
        >
          {props.children}
          <button
            class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={props.onClose}
          >
            <X class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </button>
        </div>
      </div>
    </Portal>
  )
}

export const DialogHeader: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div class={cn('flex flex-col space-y-1.5 text-center sm:text-left', props.class)}>
      {props.children}
    </div>
  )
}

export const DialogFooter: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div class={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', props.class)}>
      {props.children}
    </div>
  )
}

export const DialogTitle: ParentComponent<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => {
  return (
    <h2 class={cn('text-lg font-semibold leading-none tracking-tight', props.class)}>
      {props.children}
    </h2>
  )
}

export const DialogDescription: ParentComponent<JSX.HTMLAttributes<HTMLParagraphElement>> = (
  props
) => {
  return <p class={cn('text-sm text-muted-foreground', props.class)}>{props.children}</p>
}

// Confirm dialog helper
interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  destructive?: boolean
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent onClose={() => props.onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>
            {props.cancelLabel ?? 'Cancel'}
          </Button>
          <Button
            variant={props.destructive ? 'destructive' : 'default'}
            onClick={() => {
              props.onConfirm()
              props.onOpenChange(false)
            }}
          >
            {props.confirmLabel ?? 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
