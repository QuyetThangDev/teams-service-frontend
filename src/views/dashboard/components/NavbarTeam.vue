<template>
  <div>
    <header class="sticky top-0 flex items-center h-10 gap-4 px-4 border-b bg-background md:px-6">
      <template v-for="section in dashboardMenus" :key="section.sectionName">
        <nav
          class="flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
        >
          <router-link
            v-for="menu in section.menus"
            :key="menu.path"
            :to="`/${currentTeamSlug}${menu.path}`"
            class="px-3 py-1 text-sm text-gray-400 duration-300 rounded-md hover:bg-gray-100 hover:text-gray-700"
            active-class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md"
          >
            {{ menu.title }}
          </router-link>
        </nav>
      </template>
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" size="icon" class="shrink-0 md:hidden">
            <Menu class="w-5 h-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav class="grid gap-6 text-lg font-medium">
            <a href="#" class="flex items-center gap-2 text-lg font-semibold">
              <Package2 class="w-6 h-6" />
              <span class="sr-only"> </span>
            </a>
            <a href="#" class="text-muted-foreground hover:text-foreground"> Dashboard </a>
            <a href="#" class="text-muted-foreground hover:text-foreground"> Orders </a>
            <a href="#" class="text-muted-foreground hover:text-foreground"> Customers </a>
            <a href="#" class="text-muted-foreground hover:text-foreground"> Settings </a>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  </div>
</template>

<script setup lang="ts">
import { CircleUser, Menu, Package2, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { RouterLink } from 'vue-router'
import useMenus from '@/hooks/useMenus'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentTeamSlug = computed(() => route.params.slug)
console.log(currentTeamSlug.value)
const { sections } = useMenus()

const dashboardMenus = computed(() => {
  return sections.filter((section) => section.sectionName === 'Dashboard')
})
</script>
