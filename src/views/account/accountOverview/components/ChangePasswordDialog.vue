<template>
  <div>
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline" class="flex flex-row items-center gap-2">
          <KeyRound class="w-3.5 h-3.5" />
          Change password
        </Button>
      </DialogTrigger>
      <DialogContent class="w-full">
        <DialogHeader>
          <DialogTitle class="flex flex-row items-center gap-1">
            <div class="flex items-center justify-center w-10 h-10 p-1 bg-red-100 rounded-full">
              <KeyRound class="w-4 h-4 text-red-600" />
            </div>
            Create new password
          </DialogTitle>
          <DialogDescription>
            Your new password must be different from previously used passwords.
          </DialogDescription>
        </DialogHeader>
        <div class="w-full">
          <Card class="max-w-sm p-0 w-full md:min-h-[400px] mx-auto border-none">
            <CardContent>
              <form @submit.prevent="onSubmit" class="flex flex-col w-full gap-6">
                <FormField
                  v-slot="{ componentField }"
                  name="oldPassword"
                  class="flex flex-row items-center w-full"
                >
                  <FormItem class="flex flex-col items-start w-full">
                    <FormLabel class="w-24 text-sm text-gray-500">Old password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your old password"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <div class="flex flex-col gap-2">
                  <FormField v-slot="{ componentField }" name="newPassword" class="w-full">
                    <FormItem class="flex flex-col items-start w-full">
                      <FormLabel class="w-24 text-sm text-gray-500">New password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Your new password"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="confirmPassword" class="w-full">
                    <FormItem class="flex flex-col items-start w-full">
                      <FormLabel class="w-full text-sm text-gray-500">Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your confirm password"
                          v-bind="componentField"
                        />
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
                    <span v-else>Save password</span>
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { KeyRound, Loader2 } from 'lucide-vue-next'
import { toTypedSchema } from '@vee-validate/zod'
import { computed, ref } from 'vue'
import { defineRule, useField, useForm } from 'vee-validate'
import * as z from 'zod'
import { changePassword } from '@/api/users'
import { useMutation } from '@tanstack/vue-query'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { useUserStore } from '@/stores/userStore'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { PASSWORD_REGEX } from '@/constants/regex'

const { toast } = useToast()
const router = useRouter()

const { isPending, isError, error, isSuccess, mutate } = useMutation({
  mutationFn: (user: { old_password: string; new_password: string }) => {
    return changePassword(user)
  },
  onSuccess: (data: any) => {
    toast({
      title: 'Change password successful',
      description: 'You have successfully changed your password.'
    })
  },
  onError: () => {
    toast({
      title: 'Change password failed',
      description: 'You have failed to change your password. Please try again.',
      variant: 'destructive'
    })
  }
})

const validationSchema = toTypedSchema(
  z
    .object({
      oldPassword: z
        .string()
        .regex(
          PASSWORD_REGEX,
          'Password must be 8-20 characters, include a number and a special character'
        ),
      newPassword: z
        .string()
        .regex(
          PASSWORD_REGEX,
          'Password must be 8-20 characters, include a number and a special character'
        ),
      confirmPassword: z
        .string()
        .regex(
          PASSWORD_REGEX,
          'Password must be 8-20 characters, include a number and a special character'
        )
    })
    .superRefine((data, ctx) => {
      if (data.newPassword === data.oldPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['newPassword'],
          message: 'New password must be different from old password'
        })
      }
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Confirm password must match new password'
        })
      }
    })
)

const { handleSubmit, errors, meta } = useForm({
  initialValues: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  },
  validationSchema: validationSchema
})

const isFormValid = computed(() => {
  return (
    meta.value.valid &&
    !meta.value.pending &&
    !errors.value.oldPassword &&
    !errors.value.newPassword &&
    !errors.value.confirmPassword
  )
})

const onSubmit = handleSubmit((values) => {
  if (values.newPassword !== values.confirmPassword) {
    errors.value.confirmPassword = 'Passwords must match'
  } else {
    mutate({
      old_password: values.oldPassword,
      new_password: values.newPassword
    })
  }
})
</script>
