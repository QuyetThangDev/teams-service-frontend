<template>
  <div class="flex flex-col gap-2 px-3 py-5 bg-gray-100 rounded-md">
    <Label class="pb-4 border-b border-gray-300">
      <span class="font-bold text-gray-600">Add new</span>
    </Label>
    <div class="flex flex-col gap-4">
      <Label>
        <span class="font-normal text-gray-600">Invite Team Members using email address</span>
      </Label>
      <form @submit.prevent="onSubmit" class="flex flex-col items-center w-full">
        <div class="grid items-end w-full grid-cols-6 gap-1">
          <!-- Email input field occupying 4 columns -->
          <div class="col-span-4">
            <FormField
              v-slot="{ componentField }"
              name="email"
              class="flex items-center flex-grow min-w-48"
            >
              <FormItem class="flex flex-col">
                <FormLabel class="text-sm text-gray-500">EMAIL ADDRESS</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="@example.com"
                    v-bind="componentField"
                    class="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <!-- Role input field occupying 2 columns (hidden or disabled) -->
          <div class="flex flex-col justify-end col-span-2">
            <FormField
              v-slot="{ componentField }"
              name="role"
              class="flex items-center flex-grow min-w-48"
            >
              <FormItem class="flex flex-col">
                <FormLabel class="text-sm text-gray-500">ROLE</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    v-bind="componentField"
                    value="Member"
                    class="w-full"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
        <CardFooter class="flex justify-end w-full px-0 py-4 border-t">
          <Button class="w-32" type="submit" :disabled="isPending || !isFormValid">
            <span v-if="isPending">
              <Loader2 class="w-4 h-4 animate-spin" />
            </span>
            <span v-else>Invite</span>
          </Button>
        </CardFooter>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useMutation } from '@tanstack/vue-query'
import { useToast } from '@/components/ui/toast'
import { addMember } from '@/api/teams'
import { Loader2 } from 'lucide-vue-next'

const { toast } = useToast()

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    role: z.string().min(1, 'Role is required')
  })
)

const emit = defineEmits(['finish'])

const { isPending, mutate } = useMutation({
  mutationFn: (user: { email: string; role: string }) => {
    return addMember(user)
  },
  onSuccess: () => {
    toast({
      title: 'Invited successfully',
      description: 'You have successfully invited a new team member.'
    })
    emit('finish') // Emit the continue event
  },
  onError: () => {
    toast({
      title: 'Invitation failed',
      description: 'Failed to invite a new team member. Please try again.',
      variant: 'destructive'
    })
  }
})

const { handleSubmit, errors, meta } = useForm({
  initialValues: {
    email: '',
    role: 'Member'
  },
  validationSchema
})

const isFormValid = computed(() => {
  return meta.value.valid && !meta.value.pending && !errors.value.email
})

const onSubmit = handleSubmit((values) => {
  const user = {
    email: values.email,
    role: 'Member'
  }
  mutate(user)
})
</script>
