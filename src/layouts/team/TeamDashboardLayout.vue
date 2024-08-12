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
        <!-- Main Content -->
        <main class="flex flex-col items-center justify-center col-span-4 gap-4 overflow-auto">
          <router-view />
        </main>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts"></script>
