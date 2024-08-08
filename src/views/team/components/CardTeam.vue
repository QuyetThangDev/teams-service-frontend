<template>
  <div>
    <Card
      class="border sm:min-w-[25rem] sm:min-h-[12rem] flex justify-center items-center border-gray-300 shadow-none"
    >
      <div v-if="isPending" class="flex items-center justify-center w-full h-full">
        <Loader2 class="flex items-center justify-center w-6 h-6 text-blue-600 animate-spin" />
      </div>
      <div v-else class="w-full">
        <CardHeader>
          <div class="grid items-center justify-between w-full grid-cols-5 gap-1">
            <CardTitle
              class="flex flex-row items-center col-span-4 gap-2 text-gray-500 shadow-none text-md"
            >
              <div class="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                <Youtube class="w-4 h-4 text-gray-500" />
              </div>
              Project name</CardTitle
            >
            <div class="flex justify-end col-span-1">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <div
                    class="flex items-center justify-center w-8 h-8 duration-200 rounded-full cursor-pointer hover:bg-gray-100"
                  >
                    <EllipsisVertical class="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-full">
                  <DropdownMenuCheckboxItem
                    v-model:checked="showProject"
                    :class="{ 'bg-gray-100': showProject }"
                  >
                    Project
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem v-model:checked="showTeamMember">
                    Team Member
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem v-model:checked="showPanel">
                    Panel
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardDescription> Project description </CardDescription>
        </CardHeader>
        <CardContent> </CardContent>
        <CardFooter class="px-6 py-4 border-t">
          <span class="text-xs text-gray-400">3d ago</span>
        </CardFooter>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import {
  CircleUser,
  EllipsisVertical,
  Loader2,
  Menu,
  Package2,
  Search,
  Youtube
} from 'lucide-vue-next'

import { Checkbox } from '@/components/ui/checkbox'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { getTeams } from '@/api/teams'
import { useToast } from '@/components/ui/toast'
import type { DropdownMenuCheckboxItemProps } from 'radix-vue'

type Checked = DropdownMenuCheckboxItemProps['checked']

const showProject = ref<Checked>(true)
const showTeamMember = ref<Checked>(false)
const showPanel = ref<Checked>(false)

const route = useRoute()
const { toast } = useToast()
const currentTeamId = computed(() => route.params.id)

const {
  isPending,
  isError,
  data,
  error,
  refetch: refetchTeams
} = useQuery({
  queryKey: ['teams'],
  queryFn: getTeams
})
</script>
