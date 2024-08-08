<template>
  <div>
    <Dialog v-model:open="showNewTeamDialog">
      <DialogTrigger as-child>
        <Button @click="showNewTeamDialog = true">
          <CirclePlus class="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription> Continue to start collaborating on your project. </DialogDescription>
        </DialogHeader>
        <div>
          <FormCreateTeam @continue="onContinue" />
        </div>
      </DialogContent>
    </Dialog>
    <Dialog v-model:open="showMembersDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
          <DialogDescription> Managed and invite Team Members </DialogDescription>
        </DialogHeader>
        <div>
          <DialogAddMember @finish="onFinish" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { createTeam, getTeams } from '@/api/teams'
import { CirclePlus } from 'lucide-vue-next'
import * as z from 'zod'

import { computed, ref } from 'vue'

import { Button } from '@/components/ui/button'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast'
import { TEAM_NAME_REGEX } from '@/constants/regex'
import { useRoute, useRouter } from 'vue-router'
import type { Team } from '@/types/team'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import FormCreateTeam from '@/views/dashboard/components/FormCreateTeam.vue'
import DialogAddMember from '@/views/dashboard/components/DialogAddMember.vue'

const { toast } = useToast()

const showNewTeamDialog = ref(false)
const emit = defineEmits(['continue']) // Define emit

const {
  isLoading,
  isError,
  data,
  error
  // refetch: refetchTeams
} = useQuery({
  queryKey: ['teams'],
  queryFn: getTeams
})

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
    name: '',
    description: ''
  },
  validationSchema: validationSchema
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

const showMembersDialog = ref(false)

const onContinue = () => {
  showNewTeamDialog.value = false
  showMembersDialog.value = true
}

const onFinish = () => {
  console.log(showMembersDialog.value, showNewTeamDialog.value)
  showMembersDialog.value = false
  toast({
    title: 'Success',
    description: 'Team member invitation process completed successfully.'
  })
}
</script>
