<template>
  <div>
    <Card class="border border-gray-300 shadow-none">
      <CardHeader class="flex flex-row items-center gap-4 p-6 border-b">
        <div class="flex flex-col items-start justify-between w-full gap-2 py-2">
          <CardTitle> Team name </CardTitle>
          <span class="text-sm text-gray-500">
            This is your team's visible name within Viot. For example, the name of your company or
            department.
          </span>
        </div>
      </CardHeader>
      <CardContent class="flex flex-col mt-6">
        <form @submit.prevent="onSubmit" class="flex flex-col items-center justify-center gap-4">
          <FormField
            v-slot="{ componentField }"
            name="teamName"
            class="flex flex-row items-center w-full"
          >
            <FormItem class="flex flex-row items-center w-full">
              <FormLabel class="w-24 text-sm font-bold text-gray-500"> Team name </FormLabel>
              <div class="flex flex-col w-full gap-1">
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="description"
            class="flex flex-row items-center w-full"
          >
            <FormItem class="flex flex-row items-center w-full">
              <FormLabel class="w-24 text-sm font-bold text-gray-500">Description</FormLabel>
              <div class="flex flex-col w-full gap-1">
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>
          <div class="flex justify-end w-full">
            <Button type="submit" :disabled="isUpdatePending">
              <span v-if="isUpdatePending">
                <Loader2 class="w-4 h-4 animate-spin" />
              </span>
              <span v-else>Save changes</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { watch } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useForm, validate } from 'vee-validate'
import * as z from 'zod'
import { useTeamStore } from '@/stores/teamStore'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/toast'
import { storeToRefs } from 'pinia'
import { updateTeam } from '@/api/teams'

const { toast } = useToast()
const store = useTeamStore()
const { team } = storeToRefs(store)

const formSchema = toTypedSchema(
  z.object({
    teamName: z.string().min(1, 'Team name is required').max(20, 'Max 20 characters'),
    description: z.string().optional()
  })
)

const form = useForm({
  initialValues: {
    teamName: '',
    description: ''
  },
  validationSchema: formSchema
})

// Watch for team changes and update form fields
watch(
  team,
  (newVal) => {
    if (newVal) {
      form.setFieldValue('teamName', newVal.name)
      form.setFieldValue('description', newVal.description || '')
    }
  },
  { immediate: true }
)

const {
  isPending: isUpdatePending,
  isError: isUpdateError,
  error: updateError,
  isSuccess: isUpdateSuccess,
  mutate
} = useMutation({
  mutationFn: (team: { teamName: string; description?: string }) => {
    return updateTeam(team)
  },
  onSuccess: () => {
    toast({
      title: 'Update successful'
    })
  },
  onError: (error: any) => {
    toast({
      title: 'Update failed',
      description: error.message
    })
  }
})

const onSubmit = form.handleSubmit(async (values) => {
  mutate({
    teamName: values.teamName,
    description: values.description
  })
})
</script>
