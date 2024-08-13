<template>
  <div>
    <Card class="max-w-sm p-0 w-full md:min-h-[400px] mx-auto border-none">
      <CardContent>
        <form @submit.prevent="onSubmit" class="flex flex-col w-full gap-6">
          <div class="flex flex-col gap-2">
            <FormField v-slot="{ field }" name="name" class="w-full">
              <FormItem class="flex flex-col items-start w-full">
                <FormLabel class="w-full text-sm text-gray-500">Team name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Your team name" v-bind="field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ field }" name="description" class="w-full">
              <FormItem class="flex flex-col items-start w-full">
                <FormLabel class="w-full text-sm text-gray-500">Description</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Your team description" v-bind="field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <CardFooter class="flex justify-end w-full px-0 py-4 border-t">
            <Button class="w-32" type="submit" :disabled="isPending || !isFormValid">
              <span v-if="isPending">
                <Loader2 class="w-4 h-4 animate-spin" />
              </span>
              <span v-else>Continue</span>
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { createTeam } from '@/api/teams'
import { Loader2 } from 'lucide-vue-next'
import * as z from 'zod'

import { computed, ref } from 'vue'

import { Button } from '@/components/ui/button'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast'
import { TEAM_NAME_REGEX } from '@/constants/regex'

const { toast } = useToast()

const showNewTeamDialog = ref(false)
const emit = defineEmits(['continue']) // Define emit

const validationSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1)
      .max(20)
      .regex(TEAM_NAME_REGEX, 'Team name must be 1-20 characters, no special characters'),
    description: z.string().optional()
  })
)

const { handleSubmit, errors, meta, resetForm } = useForm({
  initialValues: {
    name: ''
  },
  validationSchema: validationSchema
})

const isFormValid = computed(() => {
  return meta.value.valid && !meta.value.pending && !errors.value.name && !errors.value.description
})

const { isPending, mutate } = useMutation({
  mutationFn: (obj: { name: string; description?: string }) => {
    return createTeam(obj)
  },
  onSuccess: () => {
    toast({
      title: 'Team created successfully',
      description: 'You have successfully created a new team.'
    })
    showNewTeamDialog.value = false
    emit('continue') // Emit the event here
    resetForm() // Reset form values
  },
  onError: () => {
    toast({
      title: 'Failed to create team',
      description: 'There was an error creating the team. Please try again.',
      variant: 'destructive'
    })
  }
})

const onSubmit = handleSubmit((values) => {
  mutate({
    name: values.name,
    description: values.description
  })
})
</script>
