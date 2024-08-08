<script lang="ts" setup>
import type { DropdownMenuCheckboxItemProps } from 'radix-vue'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-vue-next'

type Checked = DropdownMenuCheckboxItemProps['checked']

const showProject = ref<Checked>(true)
const showTeamMember = ref<Checked>(false)
const showPanel = ref<Checked>(false)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child class="w-36">
      <Button>
        Add new...
        <ChevronDown class="w-4 h-4 ml-1" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-full">
      <DropdownMenuLabel>Add new</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem v-model:checked="showProject"> Project </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model:checked="showTeamMember">
        Team Member
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem v-model:checked="showPanel"> Panel </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
