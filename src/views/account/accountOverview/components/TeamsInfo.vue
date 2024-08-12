<template>
  <div>
    <Card class="border border-gray-300 shadow-none">
      <CardHeader class="flex flex-col items-start gap-4 p-4 border-b">
        <div class="flex flex-row items-center justify-between w-full gap-1 py-2">
          <div class="flex flex-col items-start gap-2">
            <CardTitle> Teams </CardTitle>
            <span class="text-sm text-gray-500">
              The teams that are associated with your Viot account.
            </span>
          </div>
          <DialogCreateTeam />
        </div>
      </CardHeader>
      <CardContent class="flex flex-col mt-6">
        <span v-if="isPending">
          <LoadingSpinner />
        </span>
        <span v-else-if="isError">Error: {{ error!.message }}</span>
        <!-- <TeamsList v-else-if="teams" :teams="teams" /> -->
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { watch } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import * as z from 'zod'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useToast } from '@/components/ui/toast'
import { getCurrentUser } from '@/api/users'
import { updateUser } from '@/api/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { NAME_REGEX } from '@/constants/regex'
import DialogCreateTeam from './DialogCreateTeam.vue'
import { getTeams } from '@/api/teams'

const { toast } = useToast()

const formSchema = toTypedSchema(
  z.object({
    firstName: z
      .string()
      .min(1, 'Last name is required')
      .max(20, 'Max 20 characters')
      .regex(NAME_REGEX, 'Only letters allowed'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(20, 'Max 20 characters')
      .regex(NAME_REGEX, 'Only letters allowed')
  })
)

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

// console.log('Check teams: ', teams.value.data)

// const { handleSubmit, validate, resetForm } = useForm({
//   initialValues: {
//     firstName: '',
//     lastName: ''
//   },
//   validationSchema: formSchema
// })

// watch(currentUser, (newVal) => {
//   if (newVal) {
//     resetForm({
//       values: {
//         firstName: newVal.data.first_name,
//         lastName: newVal.data.last_name
//       }
//     })
//   }
// })

// const {
//   isPending: isUpdatePending,
//   isError: isUpdateError,
//   error: updateError,
//   isSuccess: isUpdateSuccess,
//   mutate
// } = useMutation({
//   mutationFn: (user: { first_name: string; last_name: string }) => {
//     console.log(user)
//     return updateUser(user)
//   },
//   onSuccess: (data: any) => {
//     toast({
//       title: 'Update successful'
//     })
//   },
//   onError: (error: any) => {
//     toast({
//       title: 'Update failed',
//       description: error.message
//     })
//   }
// })

// const onSubmit = handleSubmit(async (values) => {
//   const isValid = await validate()
//   if (isValid) {
//     console.log(isValid)
//     mutate({
//       first_name: values.firstName,
//       last_name: values.lastName
//     })
//   } else {
//     return
//   }
// })
</script>
