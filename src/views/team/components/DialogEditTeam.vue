<template>
  <div>
    <!-- Hiển thị Dialog tạo team -->
    <Dialog v-model:open="isOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>Edit your team's details here.</DialogDescription>
        </DialogHeader>
        <div>
          <!-- Nội dung của DialogEditTeam -->
          <FormCreateTeam @continue="handleContinue" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { createTeam, getTeams } from '@/api/teams'
import { computed, ref } from 'vue'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast'
import { TEAM_NAME_REGEX } from '@/constants/regex'
import type { Team } from '@/types/team'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import FormCreateTeam from '@/views/dashboard/components/FormCreateTeam.vue'
import DialogAddMember from '@/views/dashboard/components/DialogAddMember.vue'

const { toast } = useToast()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const isOpen = computed(() => props.isOpen)

const emit = defineEmits(['close'])

const handleContinue = () => {
  emit('close') // Gửi sự kiện đóng về component cha
}
</script>
