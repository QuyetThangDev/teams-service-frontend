<template>
  <div class="flex flex-col w-full min-h-screen md:flex-row bg-muted">
    <main
      class="flex mx-auto w-full min-h-[calc(100vh_-_theme(spacing.16))] flex-col gap-4 bg-muted/40 p-4 md:gap-8"
    >
      <!-- Header -->
      <div class="grid w-full gap-2 mx-auto">
        <h1 class="text-3xl font-semibold">Team overview</h1>
      </div>
      <div class="grid-cols-1 md:grid md:grid-cols-5">
        <!-- Sidebar -->
        <div class="flex flex-col col-span-1 gap-5">
          <nav class="flex flex-col justify-center max-w-[15rem] gap-2 text-muted-foreground">
            <template v-for="section in teamsSettingsSection" :key="section.sectionName">
              <router-link
                v-for="(menu, i) in section.menus"
                :key="i"
                :to="menu.path"
                class="w-full p-2 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-200"
                exact-active-class="text-gray-700 bg-gray-200"
              >
                {{ menu.title }}
              </router-link>
            </template>
          </nav>
        </div>
        <!-- Main Content -->
        <main class="flex flex-col items-center justify-center col-span-4 gap-4 overflow-auto">
          <router-view />
        </main>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import useMenus from '@/hooks/useMenus'
import { computed } from 'vue'

const { sections } = useMenus()

const teamsSettingsSection = computed(() => {
  return sections.filter((section) => section.sectionName === 'Team Overview')
})
</script>
