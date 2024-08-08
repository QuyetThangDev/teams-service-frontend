<template>
  <div>
    <Card class="border border-gray-300 shadow-none">
      <CardHeader class="flex flex-col items-start gap-4 p-4 border-b">
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Permanently remove your Personal Account and all of its contents from the TBE platform.
          This action is not reversible, so please continue with caution.
        </CardDescription>
      </CardHeader>
      <CardFooter class="flex justify-end px-6 py-4 bg-red-100 border-t">
        <Button variant="destructive" @click="onDelete">Delete Personal Account</Button>
      </CardFooter>
    </Card>
    <Dialog v-model:open="isOpen" class="sm:max-w-[10rem]">
      <DialogContent class="sm:max-w-[25rem]">
        <DialogHeader class="flex flex-col gap-4">
          <DialogTitle>Delete Personal Account</DialogTitle>
          <DialogDescription class="flex flex-col gap-6">
            <span class="leading-6 text-gray-600">
              Viot will <strong>delete all of your projects</strong>, along with all of your
              deployments, domains, activity, and all other resources belonging to your Personal
              Account. Viot recommends that you transfer domains you wish to keep and remove Viot
              Nameservers from all other domains.
            </span>
            <span class="p-2 text-red-500 bg-red-100 rounded-sm">
              This action is not reversible. Please be certain.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col gap-5">
          <form @submit.prevent="onSubmit" class="flex flex-col w-full gap-6">
            <FormField v-slot="{ field }" name="confirmDelete" class="w-full">
              <FormItem class="flex flex-col items-start w-full">
                <FormLabel class="text-sm text-gray-600">
                  To verify, type <strong>delete my personal account</strong> below:
                </FormLabel>
                <FormControl>
                  <Input type="text" placeholder="" v-bind="field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <CardFooter class="flex w-full px-0 py-4 border-t sm:justify-between">
              <DialogClose as-child>
                <Button type="button" @click="onCancel" variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" type="submit" :disabled="isPending">
                <span v-if="isPending">
                  <Loader2 class="w-4 h-4 animate-spin" />
                </span>
                <span v-else>Delete</span>
              </Button>
            </CardFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/vue-query'
import { deleteUser } from '@/api/auth'
import { useToast } from '@/components/ui/toast'
import { useForm } from 'vee-validate'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const isOpen = ref(false)
const { toast } = useToast()
const router = useRouter()

const { isPending, mutate } = useMutation({
  mutationFn: () => {
    return deleteUser()
  },
  onSuccess: () => {
    toast({
      title: 'Delete successful',
      description: 'You will be directly signed out. Please sign in again to continue.'
    })
    router.replace({ name: 'Login' })
  },
  onError: () => {
    toast({
      title: 'Delete failed',
      description: 'You have failed to delete your account. Please try again.',
      variant: 'destructive'
    })
  }
})

const validationSchema = toTypedSchema(
  z.object({
    confirmDelete: z.string().refine((val) => val === 'delete my personal account', {
      message: 'You must type "delete my personal account" exactly to proceed.'
    })
  })
)

const { handleSubmit, validate } = useForm({
  initialValues: {
    confirmDelete: ''
  },
  validationSchema: validationSchema
})

const onDelete = () => {
  isOpen.value = true
}

const onCancel = () => {
  isOpen.value = false
}

const onSubmit = handleSubmit(async () => {
  const isValid = await validate()
  if (isValid) {
    mutate()
    isOpen.value = false
  }
})
</script>
