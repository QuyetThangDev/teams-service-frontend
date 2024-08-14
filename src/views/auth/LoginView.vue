<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'

import { login } from '@/api/auth'

import { LoaderCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RouterLink, useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { useUserStore } from '@/stores/userStore'
import { PASSWORD_REGEX } from '@/constants/regex'

const { toast } = useToast()
const router = useRouter()

const { isPending, isError, error, isSuccess, mutate } = useMutation({
  mutationFn: (user: { email: string; password: string }) => {
    return login(user)
  },
  onSuccess: (data: any) => {
    useUserStore().setAccessToken(data.data.access_token)
    toast({
      title: 'Login successful',
      description: 'You have successfully logged in.'
    })
    // Redirect to dashboard
    router.push({ name: 'Dashboard' })
  },
  onError: (data: any) => {
    toast({
      title: 'Login failed',
      description: 'Invalid email or password.',
      variant: 'destructive'
    })
  }
})

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .regex(
        PASSWORD_REGEX,
        'Password must be 8-20 characters, include a number and a special character'
      )
  })
)

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema
})

const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit((values) => {
  mutate({
    email: values.email,
    password: values.password
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
    <div class="flex items-center justify-center">
      <form @submit.prevent="onSubmit">
        <Card class="max-w-sm md:min-w-[400px] md:min-h-[400px] mx-auto border-none">
          <CardHeader>
            <CardTitle class="text-2xl"> Login </CardTitle>
            <CardDescription> Enter your email below to login to your account </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4">
              <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input
                  v-model="email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                <span v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</span>
              </div>
              <div class="grid gap-2">
                <div class="flex items-center">
                  <Label for="password">Password</Label>
                  <RouterLink
                    to="/auth/forgot-password"
                    class="inline-block ml-auto text-sm underline"
                  >
                    Forgot your password?
                  </RouterLink>
                </div>
                <Input v-model="password" id="password" type="password" required />
                <span v-if="errors.password" class="text-sm text-red-600">{{
                  errors.password
                }}</span>
              </div>
              <Button class="w-full" type="submit" :disabled="isPending">
                <LoaderCircle v-if="isPending" class="w-4 h-4 mr-2 animate-spin" />
                Sign in
              </Button>
              <Button variant="outline" class="w-full"> Login with Google </Button>
            </div>
            <div class="mt-4 text-sm text-center">
              Don't have an account?
              <RouterLink to="/auth/register" class="underline"> Sign up </RouterLink>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  </div>
</template>
