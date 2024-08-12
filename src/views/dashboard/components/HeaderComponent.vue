<script setup lang="ts">
import { Bell, BellRing, CirclePlus, CircleUser, LogOut } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

import { onMounted, ref, watch } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { logout } from '@/api/auth'
import { RouterLink, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { useUserStore } from '@/stores/userStore'

import { getCurrentUser } from '@/api/users'
import { getNotification } from '@/api/notifications'
import TeamSwitcher from './TeamSwitcher.vue'

interface Notification {
  id: number
  time: string
  content: string
}

const notifications = ref<Notification[]>([])
const { toast } = useToast()
const router = useRouter()
const userStore = useUserStore()

const {
  isLoading,
  isError,
  data: currentUser,
  error,
  isSuccess
} = useQuery({
  queryKey: ['user'],
  queryFn: getCurrentUser
})

watch(currentUser, (newVal) => {
  if (newVal) {
    userStore.setUserInfo(newVal.data)
  }
})

const { mutate: handleLogout } = useMutation({
  mutationFn: () => logout(),
  onSuccess: () => {
    router.push({ name: 'Login' })
    toast({
      title: 'Logout successful',
      description: 'You have successfully logged out.'
    })
  }
})

const { mutate: handleNotification } = useMutation({
  mutationFn: () => getNotification(),
  onSuccess: (data: any) => {
    notifications.value = data.data
  }
})

const formatDate = (date: string | Date) => {
  return format(date, 'dd/MM/yyyy HH:mm')
}

onMounted(() => {
  // mutate()
  handleNotification()
})
</script>

<template>
  <header
    class="border-b border-b-gray-200 flex h-14 items-center justify-between gap-4 px-4 lg:h-[60px] lg:px-4"
  >
    <RouterLink to="/">
      <div class="flex items-center justify-center bg-gray-100 rounded-full w-9 h-9">
        <img src="@/assets/logo.svg" alt="logo" class="h-4" />
      </div>
    </RouterLink>
    <TeamSwitcher />

    <div class="relative flex-1 ml-auto grow-0">
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" size="icon" class="w-8 h-8 ml-auto">
            <Bell class="w-4 h-4" />
            <span class="sr-only">Toggle notifications</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[21rem] mr-[2rem] mt-[0.5rem]">
          <div class="flex flex-col gap-4">
            <h4 class="font-medium leading-none">Notifications</h4>
            <ScrollArea class="overflow-y-auto max-h-[23rem]">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="flex flex-col items-start pb-4 mb-4 border-b border-b-gray-300"
              >
                <div class="flex flex-row items-start">
                  <Label class="flex-shrink-0 w-12">
                    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50">
                      <BellRing class="w-3.5 h-3.5 text-orange-600" />
                    </div>
                  </Label>
                  <div class="flex flex-col flex-grow">
                    <span class="text-sm leading-5 line-clamp-3">{{ notification.content }}</span>
                    <span class="text-[0.7rem] text-gray-500">{{
                      formatDate(notification.time)
                    }}</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="secondary" size="icon" class="rounded-full">
          <CircleUser class="w-5 h-5" />
          <span class="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{{ currentUser!.data.first_name }}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="() => $router.push({ name: 'OrganizationSettings' })">
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RouterLink to="/account" class="w-full"> Account Settings </RouterLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="text-red-500 duration-300 hover:bg-red-100 bg-red-50">
          <div class="flex items-center gap-1" @click="handleLogout()">
            <LogOut class="w-3.5 h-3.5 text-red-500" />
            Logout
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </header>
</template>
