<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { useTeamStore } from '@/stores/teamStore'

import { Check, ChevronsUpDown, CirclePlus, Loader2 } from 'lucide-vue-next'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import FormCreateTeam from './FormCreateTeam.vue'
import DialogAddMember from './DialogAddMember.vue'

import { getTeams } from '@/api/teams'
import type { Team } from '@/types/team'

const router = useRouter()
const route = useRoute()

const showNewTeamDialog = ref(false)
const showMembersDialog = ref(false)
const selectedTeam = ref<Team | null>(null)
const open = ref(false)
const currentTeamSlug = computed(() => route.params.slug)

const {
  isLoading,
  isError,
  data,
  error,
  refetch: refetchTeams
} = useQuery({
  queryKey: ['teams'],
  queryFn: getTeams
})

const teamStore = useTeamStore()

watch(data, (newVal) => {
  if (newVal) {
    const currentTeam = newVal.find((t: Team) => t.slug === currentTeamSlug.value)

    if (currentTeamSlug.value && currentTeam !== undefined) {
      selectedTeam.value = currentTeam
      teamStore.setCurrentTeam(currentTeam)

      // Chỉ chuyển hướng nếu không ở trong các route như AccountSettings
      if (
        router.currentRoute.value.name !== 'AccountSettings' &&
        router.currentRoute.value.name !== 'AccountOverview' &&
        router.currentRoute.value.name !== 'DomainsSettings'
      ) {
        router.replace({ name: 'Team', params: { slug: selectedTeam.value!.slug } })
      }
    } else if (newVal.length === 0) {
      selectedTeam.value = null
      router.replace({ name: 'Empty' })
    } else {
      selectedTeam.value = newVal[0]

      // Chỉ chuyển hướng nếu không ở trong các route như AccountSettings
      if (
        router.currentRoute.value.name !== 'AccountSettings' &&
        router.currentRoute.value.name !== 'AccountOverview' &&
        router.currentRoute.value.name !== 'DomainsSettings'
      ) {
        router.replace({ name: 'Team', params: { slug: selectedTeam.value.slug } })
      }
    }
  }
})

const onContinue = () => {
  showNewTeamDialog.value = false
  showMembersDialog.value = true
  refetchTeams() // Refetch data here
}
</script>

<template>
  <div>
    <div v-if="isLoading">
      <Loader2 class="w-4 h-4 text-blue-500 animate-spin" />
    </div>
    <div v-else>
      <div v-if="isError" class="text-red-500">Something went wrong: {{ error!.message }}</div>
      <div v-else>
        <Dialog v-model:open="showNewTeamDialog">
          <Popover v-model:open="open">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded="open"
                aria-label="Select a team"
                :class="cn('w-[200px] justify-between', $attrs.class ?? '')"
              >
                <Avatar class="w-6 h-6 mr-2 bg-gray-300"> </Avatar>
                <span v-if="selectedTeam" class="flex flex-row items-center justify-between w-full">
                  {{ selectedTeam.name }}
                  <ChevronsUpDown class="w-4 h-4 ml-auto opacity-50 shrink-0" />
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search team..." />
                  <CommandEmpty>No team found.</CommandEmpty>
                  <CommandGroup heading="Teams" :disabled="isLoading" class="flex flex-col gap-1">
                    <CommandItem
                      v-for="team in data!"
                      :value="team.slug"
                      :key="team.slug"
                      @click="
                        () => {
                          selectedTeam = team
                          router.replace({ name: 'Team', params: { slug: selectedTeam.slug } })
                          open = false
                        }
                      "
                      :class="cn('text-sm', selectedTeam?.slug === team.slug ? 'bg-blue-50' : '')"
                    >
                      <Avatar class="w-5 h-5 mr-2">
                        <AvatarImage
                          :src="`https://avatar.vercel.sh/${team.id}.png`"
                          :alt="team.name"
                          class="grayscale"
                        />
                      </Avatar>
                      {{ team.name }}
                      <Check
                        :class="
                          cn(
                            'ml-auto h-4 w-4 text-blue-600',
                            selectedTeam?.slug === team.slug ? 'opacity-100' : 'opacity-0'
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
                            showNewTeamDialog = true
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
          </Popover>
          <DialogContent v-model:open="showNewTeamDialog">
            <DialogHeader>
              <DialogTitle>Create team</DialogTitle>
              <DialogDescription>
                Continue to start collaborating on your project.
              </DialogDescription>
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
              <DialogAddMember />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>
</template>
