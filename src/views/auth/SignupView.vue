<script setup lang="ts">
import { LoaderCircle, MailCheck } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { register } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast'

import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { NAME_REGEX, PASSWORD_REGEX } from '@/constants/regex'

const router = useRouter()
const { toast } = useToast()

const isLoading = ref(false)
const isVerifying = ref(false)
const { isPending, isError, error, isSuccess, mutate } = useMutation({
  mutationFn: (user: {
    email: string
    password: string
    first_name: string
    last_name: string
  }) => {
    return register(user)
  },
  onSuccess: (data: any) => {
    toast({
      title: 'Signup successful',
      description: 'You have successfully signed up.'
    })
    isVerifying.value = true
  },
  onError: () => {
    toast({
      title: 'Signup failed',
      description: 'Invalid email or password.',
      variant: 'destructive'
    })
    isVerifying.value = true
  }
})

const validationSchema = toTypedSchema(
  z.object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(20, 'Max 20 characters')
      .regex(NAME_REGEX, 'Only letters allowed'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(20, 'Max 20 characters')
      .regex(NAME_REGEX, 'Only letters allowed'),
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

const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit((values) => {
  mutate({
    email: values.email,
    password: values.password,
    first_name: values.firstName,
    last_name: values.lastName
  })
})
</script>

<template>
  <div class="flex justify-center w-full min-w-[400px] min-h-screen">
    <img
      src="@/assets/login-background.png"
      alt="login image"
      class="absolute inset-0 object-cover w-full h-full -z-10"
    />
    <div class="flex items-center justify-center py-10">
      <form @submit.prevent="onSubmit">
        <Card v-if="!isVerifying" class="max-w-sm mx-auto md:min-w-[500px]">
          <CardHeader>
            <CardTitle class="text-xl"> Sign Up </CardTitle>
            <CardDescription> Enter your information to create an account </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <Label for="firstName">First name</Label>
                  <Input
                    v-model="firstName"
                    id="firstName"
                    type="text"
                    placeholder="Max"
                    required
                  />
                  <span v-if="errors.firstName" class="text-sm text-red-600">
                    {{ errors.firstName }}
                  </span>
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="lastName">Last name</Label>
                  <Input
                    v-model="lastName"
                    id="lastName"
                    type="text"
                    placeholder="Robinson"
                    required
                  />
                  <span v-if="errors.lastName" class="text-sm text-red-600">
                    {{ errors.lastName }}
                  </span>
                </div>
              </div>
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
                <Label for="password">Password</Label>
                <Input v-model="password" id="password" type="password" />
                <span v-if="errors.password" class="text-sm text-red-600">
                  {{ errors.password }}
                </span>
              </div>
              <Button class="w-full" type="submit" :disabled="isLoading">
                <LoaderCircle v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
                Create an account
              </Button>
              <Button variant="outline" class="w-full"> Sign up with GitHub </Button>
            </div>
            <div class="mt-4 text-sm text-center">
              Already have an account?
              <RouterLink to="/auth/login" class="underline"> Login</RouterLink>
            </div>
          </CardContent>
        </Card>
        <Card
          v-else
          class="max-w-sm md:min-w-[500px] mx-auto border-none items-center justify-center"
        >
          <CardHeader class="items-center text-center">
            <MailCheck class="w-8 h-8 text-green-600" />
            <CardTitle class="text-2xl text-center"> Email Confirmation </CardTitle>
            <CardDescription>
              We have sent email to <code class="font-mono text-blue-600">{{ email }}</code> to
              confirm the validity of the email address. After receiving the email, follow the link
              provided to complete your registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid items-center justify-center gap-4"></div>
          </CardContent>
        </Card>
      </form>
    </div>
  </div>
</template>
