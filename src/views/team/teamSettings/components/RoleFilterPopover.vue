<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { TeamRole } from '@/types/team'

// Define props for the roles
const props = defineProps<{
  roles: TeamRole[]
}>()

// State to keep track of the selected role
const selectedRole = ref<string>('')

// Computed property to display the selected role
const selectedRoleName = computed(() => {
  const selected = props.roles.find((role) => role.name === selectedRole.value)
  return selected ? selected.name : 'Select a role'
})
</script>

<template>
  <Select v-model:selected="selectedRole">
    <SelectTrigger class="w-[9rem]">
      <SelectValue :placeholder="selectedRoleName" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Roles</SelectLabel>
        <SelectItem v-for="role in props.roles" :key="role.name" :value="role.name">
          {{ role.name }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
