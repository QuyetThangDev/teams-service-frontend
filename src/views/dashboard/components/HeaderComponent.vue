<script setup lang="ts">
import { CircleUser, LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { onMounted, ref, watch } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { logout } from '@/api/auth'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import { getCurrentUser } from '@/api/users'
import { getNotification } from '@/api/notifications'
import TeamSwitcher from './TeamSwitcher.vue'
import PopoverNotification from './PopoverNotification.vue'

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
      <PopoverNotification />
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
