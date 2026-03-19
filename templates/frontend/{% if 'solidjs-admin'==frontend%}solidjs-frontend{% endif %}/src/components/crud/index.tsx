import { Component, Show, For, createSignal, createEffect, Accessor, JSX } from 'solid-js'
import { createQuery, createMutation, useQueryClient } from '@tanstack/solid-query'
import { useNavigate, useParams } from '@solidjs/router'
import { toast } from 'solid-sonner'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable,
  Column,
  ConfirmDialog,
  Input,
  Label,
  Select,
  Checkbox,
  Textarea,
} from '@/components/ui'
import { createDataProvider, ListParams } from '@/lib/dataProvider'
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-solid'

// Generic List Component
interface ListProps<T> {
  resource: string
  title: string
  columns: Column<T>[]
  createPath?: string
  editPath?: (item: T) => string
  idKey?: keyof T
}

export function List<T extends Record<string, unknown>>(props: ListProps<T>) {
  const navigate = useNavigate()
  const provider = createDataProvider<T & { id: string | number }>(props.resource)
  const queryClient = useQueryClient()

  const [page, setPage] = createSignal(1)
  const [perPage] = createSignal(10)
  const [search, setSearch] = createSignal('')
  const [selectedIds, setSelectedIds] = createSignal<Set<string | number>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false)
  const [itemToDelete, setItemToDelete] = createSignal<(string | number) | null>(null)

  const query = createQuery(() => ({
    queryKey: [props.resource, 'list', page(), perPage(), search()],
    queryFn: () =>
      provider.getList({
        page: page(),
        perPage: perPage(),
        filter: search() ? { search: search() } : undefined,
      }),
  }))

  const deleteMutation = createMutation(() => ({
    mutationFn: (id: string | number) => provider.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [props.resource] })
      toast.success('Item deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete item')
    },
  }))

  const deleteSelectedMutation = createMutation(() => ({
    mutationFn: (ids: (string | number)[]) => provider.deleteMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [props.resource] })
      setSelectedIds(new Set())
      toast.success('Items deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete items')
    },
  }))

  const idKey = () => (props.idKey || 'id') as keyof T

  const handleRowClick = (item: T) => {
    if (props.editPath) {
      navigate(props.editPath(item))
    }
  }

  const handleSelect = (id: string | number, selected: boolean) => {
    const newSet = new Set(selectedIds())
    if (selected) {
      newSet.add(id)
    } else {
      newSet.delete(id)
    }
    setSelectedIds(newSet)
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(
        (query.data?.data ?? []).map((item) => item[idKey()] as string | number)
      )
      setSelectedIds(allIds)
    } else {
      setSelectedIds(new Set())
    }
  }

  const confirmDelete = (id: string | number) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    const id = itemToDelete()
    if (id !== null) {
      deleteMutation.mutate(id)
    }
  }

  const totalPages = () => Math.ceil((query.data?.total ?? 0) / perPage())

  const actionsColumn: Column<T> = {
    key: '_actions',
    header: 'Actions',
    render: (item) => (
      <div class="flex items-center gap-2">
        <Show when={props.editPath}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              navigate(props.editPath!(item))
            }}
          >
            <Edit class="h-4 w-4" />
          </Button>
        </Show>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e: MouseEvent) => {
            e.stopPropagation()
            confirmDelete(item[idKey()] as string | number)
          }}
        >
          <Trash2 class="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  }

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{props.title}</h1>
        <Show when={props.createPath}>
          <Button onClick={() => navigate(props.createPath!)}>
            <Plus class="mr-2 h-4 w-4" />
            Create
          </Button>
        </Show>
      </div>

      <Card>
        <CardContent class="pt-6">
          <div class="mb-4 flex items-center gap-4">
            <div class="relative flex-1">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                class="pl-10"
                value={search()}
                onInput={(e) => setSearch(e.currentTarget.value)}
              />
            </div>
            <Show when={selectedIds().size > 0}>
              <Button
                variant="destructive"
                onClick={() => deleteSelectedMutation.mutate([...selectedIds()])}
              >
                Delete Selected ({selectedIds().size})
              </Button>
            </Show>
          </div>

          <Show when={!query.isLoading} fallback={<div class="py-8 text-center">Loading...</div>}>
            <DataTable
              data={() => query.data?.data ?? []}
              columns={[...props.columns, actionsColumn]}
              onRowClick={handleRowClick}
              selectedIds={selectedIds()}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              idKey={idKey()}
            />
          </Show>

          <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-muted-foreground">
              Showing {((page() - 1) * perPage()) + 1} to{' '}
              {Math.min(page() * perPage(), query.data?.total ?? 0)} of {query.data?.total ?? 0}
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page() === 1}
                onClick={() => setPage(page() - 1)}
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>
              <span class="text-sm">
                Page {page()} of {totalPages()}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page() >= totalPages()}
                onClick={() => setPage(page() + 1)}
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen()}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

// Generic Create Component
interface CreateProps<T> {
  resource: string
  title: string
  children: JSX.Element
  redirectTo?: string
}

export function Create<T extends Record<string, unknown>>(props: CreateProps<T>) {
  const navigate = useNavigate()
  const provider = createDataProvider<T & { id: string | number }>(props.resource)
  const queryClient = useQueryClient()

  const mutation = createMutation(() => ({
    mutationFn: (data: Omit<T & { id: string | number }, 'id'>) => provider.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [props.resource] })
      toast.success('Item created successfully')
      navigate(props.redirectTo ?? `/${props.resource}`)
    },
    onError: () => {
      toast.error('Failed to create item')
    },
  }))

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData) as unknown as Omit<T & { id: string | number }, 'id'>
    mutation.mutate(data)
  }

  return (
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft class="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 class="text-2xl font-bold">{props.title}</h1>
      </div>

      <Card>
        <CardContent class="pt-6">
          <form onSubmit={handleSubmit} class="space-y-4">
            {props.children}
            <div class="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Generic Edit Component
interface EditProps<T> {
  resource: string
  title: string
  children: (data: Accessor<T | undefined>) => JSX.Element
  redirectTo?: string
}

export function Edit<T extends Record<string, unknown>>(props: EditProps<T>) {
  const navigate = useNavigate()
  const params = useParams()
  const provider = createDataProvider<T & { id: string | number }>(props.resource)
  const queryClient = useQueryClient()

  const query = createQuery(() => ({
    queryKey: [props.resource, 'one', params.id],
    queryFn: () => provider.getOne(params.id),
    enabled: !!params.id,
  }))

  const mutation = createMutation(() => ({
    mutationFn: (data: Partial<T>) => provider.update(params.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [props.resource] })
      toast.success('Item updated successfully')
      navigate(props.redirectTo ?? `/${props.resource}`)
    },
    onError: () => {
      toast.error('Failed to update item')
    },
  }))

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData) as unknown as Partial<T>
    mutation.mutate(data)
  }

  return (
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft class="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 class="text-2xl font-bold">{props.title}</h1>
      </div>

      <Card>
        <CardContent class="pt-6">
          <Show when={!query.isLoading} fallback={<div class="py-8 text-center">Loading...</div>}>
            <form onSubmit={handleSubmit} class="space-y-4">
              {props.children(() => query.data as T | undefined)}
              <div class="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Show>
        </CardContent>
      </Card>
    </div>
  )
}

// Form Field Components
interface FieldProps {
  name: string
  label: string
  required?: boolean
}

interface TextFieldProps extends FieldProps {
  value?: string
  placeholder?: string
}

export const TextField: Component<TextFieldProps> = (props) => (
  <div class="space-y-2">
    <Label for={props.name}>
      {props.label}
      {props.required && <span class="text-destructive">*</span>}
    </Label>
    <Input
      id={props.name}
      name={props.name}
      value={props.value ?? ''}
      placeholder={props.placeholder}
      required={props.required}
    />
  </div>
)

interface NumberFieldProps extends FieldProps {
  value?: number
  min?: number
  max?: number
}

export const NumberField: Component<NumberFieldProps> = (props) => (
  <div class="space-y-2">
    <Label for={props.name}>
      {props.label}
      {props.required && <span class="text-destructive">*</span>}
    </Label>
    <Input
      id={props.name}
      name={props.name}
      type="number"
      value={props.value ?? ''}
      min={props.min}
      max={props.max}
      required={props.required}
    />
  </div>
)

interface SelectFieldProps extends FieldProps {
  value?: string
  options: { value: string; label: string }[]
}

export const SelectField: Component<SelectFieldProps> = (props) => (
  <div class="space-y-2">
    <Label for={props.name}>
      {props.label}
      {props.required && <span class="text-destructive">*</span>}
    </Label>
    <Select
      id={props.name}
      name={props.name}
      value={props.value ?? ''}
      options={props.options}
      required={props.required}
    />
  </div>
)

interface BooleanFieldProps extends FieldProps {
  value?: boolean
}

export const BooleanField: Component<BooleanFieldProps> = (props) => (
  <div class="flex items-center space-x-2">
    <Checkbox
      id={props.name}
      name={props.name}
      checked={props.value ?? false}
    />
    <Label for={props.name}>{props.label}</Label>
  </div>
)

interface TextareaFieldProps extends FieldProps {
  value?: string
  placeholder?: string
  rows?: number
}

export const TextareaField: Component<TextareaFieldProps> = (props) => (
  <div class="space-y-2">
    <Label for={props.name}>
      {props.label}
      {props.required && <span class="text-destructive">*</span>}
    </Label>
    <Textarea
      id={props.name}
      name={props.name}
      value={props.value ?? ''}
      placeholder={props.placeholder}
      rows={props.rows}
      required={props.required}
    />
  </div>
)

interface DateFieldProps extends FieldProps {
  value?: string
}

export const DateField: Component<DateFieldProps> = (props) => (
  <div class="space-y-2">
    <Label for={props.name}>
      {props.label}
      {props.required && <span class="text-destructive">*</span>}
    </Label>
    <Input
      id={props.name}
      name={props.name}
      type="date"
      value={props.value ?? ''}
      required={props.required}
    />
  </div>
)

interface DateTimeFieldProps extends FieldProps {
  value?: string
}

export const DateTimeField: Component<DateTimeFieldProps> = (props) => (
  <div class="space-y-2">
    <Label for={props.name}>
      {props.label}
      {props.required && <span class="text-destructive">*</span>}
    </Label>
    <Input
      id={props.name}
      name={props.name}
      type="datetime-local"
      value={props.value ?? ''}
      required={props.required}
    />
  </div>
)
