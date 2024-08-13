<template>
  <div class="sticky top-0">
    <header class="sticky top-0 flex items-center h-12 gap-4 px-4 border-b bg-background md:px-6">
      <template v-for="section in accountMenus" :key="section.sectionName">
        <nav
          class="flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
        >
          <router-link
            v-for="menu in section.menus"
            :key="menu.path"
            :to="menu.path"
            class="px-3 py-1 text-sm text-gray-400 duration-300 rounded-md hover:bg-gray-100 hover:text-gray-700"
            active-class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md"
          >
            {{ menu.title }}
          </router-link>
        </nav>
      </template>
    </header>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import useMenus from '@/hooks/useMenus'

const { sections } = useMenus()

const accountMenus = computed(() => {
  return sections.filter((section) => section.sectionName === 'Account')
})
</script>
