<template>
  <div>
    <header class="sticky top-0 flex items-center h-12 gap-4 px-4 border-b bg-background md:px-6">
      <nav
        class="flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
      >
        <a href="#" class="transition-colors text-foreground hover:text-foreground"> Dashboard </a>
        <a href="#" class="transition-colors text-muted-foreground hover:text-foreground">
          Devices
        </a>
        <a href="#" class="transition-colors text-muted-foreground hover:text-foreground">
          Members
        </a>
        <span href="#" class="transition-colors text-muted-foreground hover:text-foreground">
          <RouterLink to="/account"> Settings</RouterLink>
        </span>
      </nav>
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
              <span class="sr-only">Acme Inc</span>
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
</script>
