<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import useMenus from '@/hooks/useMenus'

import { getCurrentUser } from '@/api/users'
import DefaultTeam from './components/DefaultTeam.vue'
import AccountDelete from './components/AccountDelete.vue'
// import TeamsInfo from './components/TeamsInfo.vue'
// import DialogDeleteAccount from './components/DialogDeleteAccount.vue'

const { sections } = useMenus()

const accountSettingsSection = computed(() => {
  return sections.filter((section) => section.sectionName === 'Account Settings')
})
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
  console.log('Account deleted')
}

const handleCancel = () => {
  showDialog.value = false
}
</script>

<template>
  <div class="flex flex-col w-full min-h-screen">
    <main
      class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 md:gap-8 px-4"
    >
      <div class="grid items-start w-full gap-6 mx-auto">
        <div class="grid gap-6">
          <!-- <TeamsInfo /> -->
          <DefaultTeam />
          <AccountDelete :visible="showDialog" @confirm="handleDelete" @cancel="handleCancel" />
        </div>
      </div>
    </main>
  </div>
</template>
