<template>
  <div class="w-full min-h-screen">
    <HeaderComponent />
    <div v-if="subNav === 'navbarTeam'" class="sticky top-0 z-10">
      <NavbarTeam class="sticky top-0 z-10" />
    </div>
    <div v-else-if="subNav === 'navbarAccount'">
      <NavbarAccount class="sticky top-0 z-10" />
    </div>
    <span v-else> Nav 3 </span>
    <main class="flex flex-col items-center justify-center flex-1 gap-4 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavbarAccount from '@/views/account/NavbarAccount.vue'
import HeaderComponent from '@/views/dashboard/components/HeaderComponent.vue'
import NavbarTeam from '@/views/dashboard/components/NavbarTeam.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const subNav = computed(() => route.meta.subNav)
</script>
