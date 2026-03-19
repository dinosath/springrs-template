import { splitProps, Component, ParentComponent, JSX, For, Accessor, Show } from 'solid-js'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => JSX.Element
  sortable?: boolean
}

export interface TableProps<T> {
  data: T[] | Accessor<T[]>
  columns: Column<T>[]
  class?: string
  onRowClick?: (item: T) => void
  selectedIds?: Set<string | number>
  onSelect?: (id: string | number, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
  idKey?: keyof T
}

export const Table: ParentComponent<JSX.HTMLAttributes<HTMLTableElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <div class="relative w-full overflow-auto">
      <table class={cn('w-full caption-bottom text-sm', local.class)} {...rest}>
        {local.children}
      </table>
    </div>
  )
}

export const TableHeader: ParentComponent<JSX.HTMLAttributes<HTMLTableSectionElement>> = (
  props
) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <thead class={cn('[&_tr]:border-b', local.class)} {...rest}>
      {local.children}
    </thead>
  )
}

export const TableBody: ParentComponent<JSX.HTMLAttributes<HTMLTableSectionElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <tbody class={cn('[&_tr:last-child]:border-0', local.class)} {...rest}>
      {local.children}
    </tbody>
  )
}

export const TableRow: ParentComponent<JSX.HTMLAttributes<HTMLTableRowElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <tr
      class={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        local.class
      )}
      {...rest}
    >
      {local.children}
    </tr>
  )
}

export const TableHead: ParentComponent<JSX.ThHTMLAttributes<HTMLTableCellElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <th
      class={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        local.class
      )}
      {...rest}
    >
      {local.children}
    </th>
  )
}

export const TableCell: ParentComponent<JSX.TdHTMLAttributes<HTMLTableCellElement>> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <td class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', local.class)} {...rest}>
      {local.children}
    </td>
  )
}

export function DataTable<T extends Record<string, unknown>>(props: TableProps<T>) {
  const getData = () => {
    const d = props.data
    return typeof d === 'function' ? d() : d
  }

  const getNestedValue = (obj: T, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, obj)
  }

  const idKey = () => props.idKey || ('id' as keyof T)

  return (
    <Table class={props.class}>
      <TableHeader>
        <TableRow>
          <Show when={props.onSelect}>
            <TableHead class="w-12">
              <input
                type="checkbox"
                class="rounded border-gray-300"
                checked={props.selectedIds?.size === getData().length && getData().length > 0}
                onChange={(e) => props.onSelectAll?.(e.currentTarget.checked)}
              />
            </TableHead>
          </Show>
          <For each={props.columns}>
            {(column) => <TableHead>{column.header}</TableHead>}
          </For>
        </TableRow>
      </TableHeader>
      <TableBody>
        <For each={getData()}>
          {(item) => (
            <TableRow
              onClick={() => props.onRowClick?.(item)}
              class={props.onRowClick ? 'cursor-pointer' : ''}
            >
              <Show when={props.onSelect}>
                <TableCell>
                  <input
                    type="checkbox"
                    class="rounded border-gray-300"
                    checked={props.selectedIds?.has(item[idKey()] as string | number)}
                    onChange={(e) => {
                      e.stopPropagation()
                      props.onSelect?.(item[idKey()] as string | number, e.currentTarget.checked)
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
              </Show>
              <For each={props.columns}>
                {(column) => (
                  <TableCell>
                    {column.render
                      ? column.render(item)
                      : String(getNestedValue(item, column.key as string) ?? '')}
                  </TableCell>
                )}
              </For>
            </TableRow>
          )}
        </For>
      </TableBody>
    </Table>
  )
}
