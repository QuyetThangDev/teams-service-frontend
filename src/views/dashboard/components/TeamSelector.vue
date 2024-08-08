<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { getTeams } from '@/api/teams'
import { useRouter, useRoute } from 'vue-router'
import type { Team } from '@/types/team'
import { computed, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

import { Check, CirclePlus } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DialogTrigger } from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { PopoverContent } from '@/components/ui/popover'

const router = useRouter()
const route = useRoute()

const props = defineProps<{
  showNewTeamDialog: boolean
  setShowNewTeamDialog: (value: boolean) => void
  selectedTeam: Team | null
  setSelectedTeam: (team: Team | null) => void
}>()

const open = ref(false)
const currentTeamId = computed(() => route.params.id)

const {
  isLoading,
  data,
  refetch: refetchTeams
} = useQuery({
  queryKey: ['teams'],
  queryFn: getTeams
})

watch(data, (newVal) => {
  if (newVal) {
    const currentTeam = newVal.items.find((t) => t.id === currentTeamId.value)

    if (currentTeamId.value && currentTeam !== undefined) {
      router.replace({ name: 'Team', params: { id: currentTeam.id } })
      props.setSelectedTeam(currentTeam)
      return
    }
    if (newVal.items.length === 0) {
      router.replace({ name: 'Empty' })
    }

    props.setSelectedTeam(newVal.items[0])
    router.replace({ name: 'Team', params: { id: props.selectedTeam!.id } })
  }
})
</script>

<template>
  <PopoverContent class="w-[200px] p-0">
    <Command>
      <CommandList>
        <CommandInput placeholder="Search team..." />
        <CommandEmpty>No team found.</CommandEmpty>
        <CommandGroup heading="Teams" :disabled="isLoading" class="flex flex-col gap-1">
          <CommandItem
            v-for="team in data!.items"
            :value="team.id"
            :key="team.id"
            @click="
              () => {
                props.setSelectedTeam(team)
                router.replace({ name: 'Team', params: { id: props.selectedTeam!.id } })
                open = false
              }
            "
            :class="cn('text-sm', props.selectedTeam?.id === team.id ? 'bg-blue-50' : '')"
          >
            <Avatar class="w-5 h-5 mr-2">
              <AvatarImage
                :src="`https://avatar.vercel.sh/${team.id}.png`"
                :alt="team.name"
                class="grayscale"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {{ team.name }}
            <Check
              :class="
                cn(
                  'ml-auto h-4 w-4 text-blue-600',
                  props.selectedTeam?.id === team.id ? 'opacity-100' : 'opacity-0'
                )
              "
            />
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandSeparator />
      <CommandList>
        <CommandGroup>
          <DialogTrigger as-child>
            <CommandItem
              value="create-team"
              @click="
                () => {
                  props.setShowNewTeamDialog(true)
                }
              "
            >
              <CirclePlus class="w-4 h-4 mr-2" />
              Create Team
            </CommandItem>
          </DialogTrigger>
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</template>
