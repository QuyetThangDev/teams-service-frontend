<script setup lang="ts">
import { CircleCheckBig, LoaderCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/toast'

import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/vue-query'
import { ref } from 'vue'

import { forgotPassword } from '@/api/auth'

const { toast } = useToast()
const emailSent = ref(false)

const { isPending, isError, error, isSuccess, mutate } = useMutation({
  mutationFn: forgotPassword,
  onSuccess: () => {
    toast({
      title: 'Email sent',
      description: 'Check your email for further instructions.'
    })
    emailSent.value = true
  },
  onError: () => {}
})

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().email('Invalid email')
  })
)

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema
})

const { value: email } = useField<string>('email')

const onSubmit = handleSubmit((values) => {
  mutate(values.email)
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
        <Card v-if="!emailSent" class="max-w-sm md:min-w-[400px] mx-auto border-none">
          <CardHeader>
            <CardTitle class="text-2xl"> Reset password </CardTitle>
            <CardDescription>
              Enter your email associated with your account and we'll send an email with
              instructions to reset you password
            </CardDescription>
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
              <Button class="w-full" type="submit" :disabled="isPending">
                <LoaderCircle v-if="isPending" class="w-4 h-4 mr-2 animate-spin" />
                Send instructions
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card v-else class="max-w-sm md:min-w-[500px] mx-auto border-none">
          <CardHeader class="items-center text-center">
            <CircleCheckBig class="w-8 h-8 text-green-600" />
            <CardTitle class="text-2xl text-center"> Email sent </CardTitle>
            <CardDescription>
              Check your email and open the link we sent to continue
            </CardDescription>
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
      </form>
    </div>
  </div>
</template>
