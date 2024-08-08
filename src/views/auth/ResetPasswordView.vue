<script setup lang="ts">
import { CircleCheckBig, LoaderCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'

import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { useRouteQuery } from '@vueuse/router'

import { resetPassword } from '@/api/auth'
import { useRouter } from 'vue-router'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { PASSWORD_REGEX } from '@/constants/regex'

const { toast } = useToast()
const router = useRouter()
const passwordReset = ref(false)
const token = useRouteQuery<string | null>('token', null)
if (token.value === null) {
  router.replace({ name: 'Login' })
}

const { isPending, isError, error, isSuccess, mutate } = useMutation({
  mutationFn: (user: { token: string; new_password: string }) => {
    return resetPassword(user)
  },
  onSuccess: () => {
    toast({
      title: 'Reset password successful'
    })
    passwordReset.value = true
  },
  onError: () => {
    toast({
      title: 'Reset password failed',
      description: 'You have failed to reset your password. Please try again.',
      variant: 'destructive'
    })
  }
})

const validationSchema = toTypedSchema(
  z
    .object({
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
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Confirm password must match new password'
        })
      }
    })
)

const { handleSubmit, errors, meta, values } = useForm({
  initialValues: {
    newPassword: '',
    confirmPassword: ''
  },
  validationSchema: validationSchema
})

const isFormValid = computed(() => {
  return meta.value.valid && !meta.value.pending && values.newPassword && values.confirmPassword
})

const onSubmit = handleSubmit((values) => {
  mutate({
    new_password: values.newPassword,
    token: token.value!
  })
})
</script>

<template>
  <div class="flex justify-center w-full min-w-[600px] min-h-screen">
    <img
      src="@/assets/login-background.png"
      alt="login image"
      class="absolute inset-0 object-cover w-full h-full -z-10"
    />
    <div class="flex items-center justify-center w-full">
      <Card v-if="!passwordReset" class="max-w-sm p-0 w-full md:min-h-[400px] mx-auto border-none">
        <CardHeader>
          <CardTitle class="text-2xl"> Create new password </CardTitle>
          <CardDescription>
            Your new password must be different from previously used passwords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="flex flex-col w-full gap-6">
            <FormField v-slot="{ componentField }" name="newPassword" class="items-center w-full">
              <FormItem class="flex flex-col items-start w-full">
                <FormLabel class="w-24 text-sm text-gray-500">New password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Your new password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="confirmPassword"
              class="flex flex-row items-center w-full"
            >
              <FormItem class="flex flex-col items-start w-full">
                <FormLabel class="w-full text-sm text-gray-500">Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your confirm password"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <CardFooter class="flex justify-end w-full px-0 py-4 border-t">
              <Button class="w-32" type="submit" :disabled="isPending || !isFormValid">
                <span v-if="isPending">
                  <LoaderCircle class="w-4 h-4 animate-spin" />
                </span>
                <span v-else>Save password</span>
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <Card v-else class="max-w-sm md:min-w-[500px] mx-auto border-none">
        <CardHeader class="items-center text-center">
          <CircleCheckBig class="w-8 h-8 text-green-600" />
          <CardTitle class="text-2xl text-center"> Password reset successful </CardTitle>
          <CardDescription> You can now login with your new password. </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid items-center justify-center gap-4">
            <Button class="max-w-[120px]" type="submit" :disabled="isPending">
              <LoaderCircle v-if="isPending" class="w-4 h-4 mr-2 animate-spin" />
              <RouterLink to="/auth/login"> Back to login</RouterLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
