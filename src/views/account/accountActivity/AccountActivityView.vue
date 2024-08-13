<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'

import { getCurrentUser } from '@/api/users'
// import DefaultTeam from './components/DefaultTeam.vue'
// import AccountInfo from './components/AccountInfo.vue'
// import AccountDelete from './components/AccountDelete.vue'
// import DialogDeleteAccount from './components/DialogDeleteAccount.vue'

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required')
  })
)

const {
  isLoading,
  isError,
  data: currentUser,
  error
} = useQuery({
  queryKey: ['user'],
  queryFn: getCurrentUser
})

const form = useForm({
  initialValues: {
    firstName: '',
    lastName: ''
  },
  validationSchema: formSchema
})

watch(currentUser, (newVal) => {
  if (newVal) {
    form.setValues({
      firstName: newVal.data.first_name,
      lastName: newVal.data.last_name
    })
  }
})

const showDialog = ref(false)

const handleDelete = () => {
  showDialog.value = false
}

const handleCancel = () => {
  showDialog.value = false
}
</script>

<template>
  <div class="flex flex-col w-full min-h-screen">
    <main
      class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8"
    >
      <div class="grid w-full max-w-6xl gap-2 mx-auto">
        <h1 class="text-3xl font-semibold">Settings</h1>
      </div>
      <div
        class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
      >
        <nav class="grid gap-2 text-sm text-muted-foreground">
          <a href="#" class="px-2 py-3 font-semibold text-white rounded-md bg-primary">General</a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100">Security</a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100">Integrations</a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100">Support</a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100">Organizations</a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100">Advanced</a>
        </nav>
        <div class="grid gap-6">
          <!-- <AccountInfo />
          <DefaultTeam />
          <AccountDelete :visible="showDialog" @confirm="handleDelete" @cancel="handleCancel" /> -->
        </div>
      </div>
    </main>
  </div>
</template>
