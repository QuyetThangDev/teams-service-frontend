import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import memberData from '../memberfake.json'
import type { TeamMember } from '@/types/team'
import DropdownAction from './DataTableDropdown.vue'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import ColumnHeader from './TableColumnHeader.vue'

const members = memberData.items

export const columns: ColumnDef<TeamMember>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all'
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: 'Select row'
      }),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) =>
      h(ColumnHeader, {
        column,
        title: 'First Name'
      }),
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('first_name'))
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) =>
      h(ColumnHeader, {
        column,
        title: 'Last name'
      }),
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('last_name'))
  },
  {
    accessorKey: 'email',
    header: ({ column }) =>
      h(ColumnHeader, {
        column,
        title: 'Email'
      }),
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email'))
  },
  {
    accessorKey: 'role',
    header: ({ column }) =>
      h(ColumnHeader, {
        column,
        title: 'Role'
      }),
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('role'))
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return h(
        'div',
        { class: 'relative' },
        h(DropdownAction, {
          payment,
          onExpand: row.toggleExpanded
        })
      )
    }
  }
]

// Example of using this in your component
export const payments = members
