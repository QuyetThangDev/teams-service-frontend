<template>
  <aside class="fixed inset-y-0 left-0 z-10 flex-col hidden border-r w-80 bg-background lg:flex">
    <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
      <a href="/" class="flex items-center justify-start gap-2 py-5">
        <Logo class="object-contain w-12 h-8" />
        <span class="text-lg font-bold">PE Admin</span>
      </a>
      <Button>Click me</Button>
      <!-- <template v-for="(section, i) in sections">
          <span
            class="px-2 py-2 text-xs text-muted-foreground"
            :class="i === 0 ? 'mt-2' : 'mt-7'"
            >{{ section.sectionName }}
          </span>
          <router-link
            v-for="(menu, i) in section.menus"
            :key="i"
            :to="menu.path"
            class="rounded-lg text-muted-foreground"
            active-class="text-primary bg-muted"
          >
            <a
              class="flex items-center gap-3 px-2 py-2 transition-all hover:text-primary"
            >
              <component :is="menu.icon" class="w-4 h-4" />
              {{ menu.title }}
            </a>
          </router-link>
        </template> -->
    </nav>
  </aside>
</template>

<script setup lang="ts">
// import Logo from "@/assets/logo.vue";
// import useMenus from "@/hooks/useMenus";
import { Button } from '@/components/ui/button'
// const { sections } = useMenus();
</script>
