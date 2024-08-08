<template>
  <div class="sticky top-0 z-10 flex flex-col w-full min-h-screen bg-white">
    <main
      class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-6 md:px-10 md:py-6"
    >
      <div class="grid w-full gap-2 mx-auto">
        <div class="grid items-center w-full grid-cols-8 gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form class="w-full col-span-7 ml-auto sm:flex-initial">
            <div class="relative">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                class="pl-8 sm:w-[200px] md:w-full"
              />
            </div>
          </form>
          <div class="col-span-1">
            <DropdownTeam />
          </div>
        </div>
      </div>
      <div class="grid items-start w-full max-w-full gap-6 mx-auto">
        <div class="grid grid-cols-4 gap-6">
          <CardTeam />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { Search } from 'lucide-vue-next'

import { Input } from '@/components/ui/input'
import CardTeam from './components/CardTeam.vue'
import DropdownTeam from './components/DropdownTeam.vue'

const route = useRoute()
const currentTeamId = computed(() => route.params.id)
</script>
