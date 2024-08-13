<template>
  <div>
    <!-- <Card class="bg-transparent shadow-none">
      <CardContent class="flex flex-col mt-6"> -->
    <div class="flex flex-col">
      <!-- Tabs component wrapping both TabsList and TabsContent -->
      <Tabs default-value="teamMembers" class="flex flex-col flex-grow">
        <!-- TabsList with fixed width -->
        <div class="w-[400px]">
          <TabsList class="grid w-full grid-cols-2">
            <CustomTabsTrigger value="teamMembers">Team Members</CustomTabsTrigger>
            <CustomTabsTrigger value="pendingInvitations">Pending Invitations</CustomTabsTrigger>
          </TabsList>
        </div>

        <!-- TabsContent taking full width -->
        <div class="flex-grow">
          <TabsContent value="teamMembers">
            <Card class="border border-gray-300 shadow-none">
              <CardHeader class="flex flex-row items-center gap-4 p-6 border-b">
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-2">
                <div class="space-y-1">
                  <Label for="name">Name</Label>
                  <Input id="name" default-value="Pedro Duarte" />
                </div>
                <div class="space-y-1">
                  <Label for="username">Username</Label>
                  <Input id="username" default-value="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="pendingInvitations">
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-2">
                <div class="space-y-1">
                  <Label for="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div class="space-y-1">
                  <Label for="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
    <!-- </CardContent>
    </Card> -->
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { reactive, ref, watch } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import * as z from 'zod'

import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CustomTabsTrigger from '@/views/team/teamSettings/components/CustomTabsTrigger.vue'

import { useToast } from '@/components/ui/toast'
import { getCurrentUser } from '@/api/users'
import { updateUser } from '@/api/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { NAME_REGEX } from '@/constants/regex'

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
  data: currentUser,
  error
} = useQuery({
  queryKey: ['user'],
  queryFn: getCurrentUser
})

const { handleSubmit, meta, errors, validate, resetForm } = useForm({
  initialValues: {
    firstName: '',
    lastName: ''
  },
  validationSchema: formSchema
})

watch(currentUser, (newVal) => {
  if (newVal) {
    resetForm({
      values: {
        firstName: newVal.data.first_name,
        lastName: newVal.data.last_name
      }
    })
  }
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
  },
  onSuccess: (data: any) => {
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

const onSubmit = handleSubmit(async (values) => {
  const isValid = await validate()
  if (isValid) {
    mutate({
      first_name: values.firstName,
      last_name: values.lastName
    })
  } else {
    return
  }
})
</script>
