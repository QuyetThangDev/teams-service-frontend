<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { ref, computed, onMounted, watchEffect, watch } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useField, useForm } from 'vee-validate'
import * as z from 'zod'

import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import TeamSwitcher from '@/views/dashboard/components/TeamSwitcher.vue'

import { useToast } from '@/components/ui/toast'
import { useUserStore } from '@/stores/userStore'
import { getCurrentUser } from '@/api/users'
import { updateUser } from '@/api/auth'
import { storeToRefs } from 'pinia'
import type { UserInfo } from '@/types/user'
import LoadingSpinner from './LoadingSpinner.vue'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { CircleUser, User } from 'lucide-vue-next'

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

const onSubmit = form.handleSubmit((values) => {
  mutate({
    first_name: values.firstName,
    last_name: values.lastName
  })
})

const {
  isPending: isUpdatePending,
  isError: isUpdateError,
  error: updateError,
  isSuccess: isUpdateSuccess,
  mutate
} = useMutation({
  mutationFn: (user: { first_name: string; last_name: string }) => {
    return updateUser(user)
  }
})
</script>

<template>
  <div class="flex flex-col w-full min-h-screen">
    <main
      class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8"
    >
      <div class="grid w-full max-w-6xl gap-2 mx-auto">
        <h1 class="text-3xl font-semibold text-red-300">Settings</h1>
      </div>
      <div
        class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
      >
        <nav class="grid gap-2 text-sm text-muted-foreground">
          <a href="#" class="px-2 py-3 font-semibold text-white rounded-md bg-primary"> General </a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100"> Security </a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100"> Integrations </a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100"> Support </a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100">
            Organizations
          </a>
          <a href="#" class="px-2 py-3 duration-300 rounded-md hover:bg-gray-100"> Advanced </a>
        </nav>
        <div class="grid gap-6">
          <Card class="border border-gray-300 shadow-none">
            <CardHeader class="flex flex-row items-center gap-4 p-4 border-b">
              <Avatar class="w-16 h-16 p-2 bg-gray-200">
                <User class="text-gray-500 w-14 h-14" />
              </Avatar>
              <div class="flex flex-col justify-start gap-1">
                <CardTitle class="shadow-none">
                  {{ currentUser?.data.last_name }} {{ currentUser?.data.first_name }}
                </CardTitle>
                <CardDescription> Role </CardDescription>
              </div>
            </CardHeader>
            <CardContent class="flex flex-col gap-6 mt-6">
              <span v-if="isLoading">
                <LoadingSpinner />
              </span>
              <span v-else-if="isError">Error: {{ error!.message }}</span>

              <form
                v-else-if="currentUser"
                @submit.prevent="onSubmit"
                class="flex flex-col items-center justify-center gap-6"
              >
                <FormField name="email" class="flex flex-row items-center w-full">
                  <FormItem class="flex flex-row items-center w-full">
                    <FormLabel class="w-24 text-sm font-bold text-gray-500">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled
                        placeholder="Your email"
                        v-model="currentUser!.data.email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  v-slot="{ componentField }"
                  name="firstName"
                  class="flex flex-row items-center w-full"
                >
                  <FormItem class="flex flex-row items-center w-full">
                    <FormLabel class="w-24 text-sm font-bold text-gray-500">First Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Your first name" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  v-slot="{ componentField }"
                  name="lastName"
                  class="flex flex-row items-center w-full"
                >
                  <FormItem class="flex flex-row items-center w-full">
                    <FormLabel class="w-24 text-sm font-bold text-gray-500">Last Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Your last name" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <CardFooter class="flex justify-end w-full px-0 py-4 border-t">
                  <Button class="w-24" type="submit">
                    <span v-if="isUpdatePending">
                      <Loader2 class="w-4 h-4 animate-spin" />
                    </span>
                    <span v-else>Submit</span>
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
          <Card class="border border-gray-300 shadow-none">
            <CardHeader class="flex flex-col items-start gap-4 p-4 border-b">
              <CardTitle>Default Team</CardTitle>
              <CardDescription>
                Your default team will be used when you make a request through the API or CLI where
                you don’t specify a particular team. It will also be the team selected when you
                first navigate to the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form class="flex flex-col gap-4">
                <TeamSwitcher />
              </form>
            </CardContent>
            <CardFooter class="px-6 py-4 border-t">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  </div>
  <form @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="firstName">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input type="text" placeholder="shadcn" v-bind="componentField" />
        </FormControl>
        <FormDescription> This is your public display name. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="lastName">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input type="text" placeholder="shadcn" v-bind="componentField" />
        </FormControl>
        <FormDescription> This is your public display name. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit"> Submit </Button>
  </form>
</template>
