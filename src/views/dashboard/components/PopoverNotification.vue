<template>
  <div>
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
</template>

<script setup lang="ts">
import { Bell, BellRing } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getNotification } from '@/api/notifications'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { Notification } from '@/types/notification'

// Reactive reference for notifications
const notifications = ref<Notification[]>([])

// Vee-validate form schema
const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required')
  })
)

// Using useForm for form validation
const form = useForm({
  initialValues: {
    firstName: '',
    lastName: ''
  },
  validationSchema: formSchema
})

// Query to fetch notifications
const { data, isSuccess } = useQuery({
  queryKey: ['notification'],
  queryFn: getNotification
})

// Watch for changes in the fetched data
watch(data, (newData) => {
  if (newData && isSuccess) {
    notifications.value = newData.notifications // Update the notifications array with fetched data
  }
})

// Function to format dates
const formatDate = (date: string | Date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm') // Ensure date is formatted correctly
}
</script>
