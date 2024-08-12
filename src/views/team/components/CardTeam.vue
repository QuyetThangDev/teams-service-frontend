<template>
  <div>
    <Card
      class="border sm:min-w-[25rem] sm:min-h-[12rem] flex justify-center items-center border-gray-300 shadow-none"
    >
      <!-- Hiển thị dialog -->
      <DialogEditTeam :isOpen="isDialogOpen" @close="isDialogOpen = false" />

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
                <FolderKanban class="w-4 h-4 text-gray-500" />
              </div>
              Project name
            </CardTitle>
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
                  <DropdownMenuCheckboxItem> Project </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem> Team Member </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem @click="handleShowPanel">
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { ref, watch } from 'vue'

import { EllipsisVertical, FolderKanban, Loader2, Package, Youtube } from 'lucide-vue-next'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import DialogEditTeam from '@/views/team/components/DialogEditTeam.vue'
import { useQuery } from '@tanstack/vue-query'
import { getTeams } from '@/api/teams'

const isDialogOpen = ref(false)

const handleShowPanel = () => {
  isDialogOpen.value = !isDialogOpen.value
  console.log(isDialogOpen.value)
}

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
