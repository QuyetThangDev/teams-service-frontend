<script setup lang="ts">
import CardTeamAddMembers from './components/CardTeamAddMembers.vue'
import CardTeamMemberList from './components/CardTeamMemberList.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <div class="flex flex-col w-full min-h-screen">
    <main
      class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 md:gap-8 px-4"
    >
      <div class="grid items-start w-full gap-6 mx-auto">
        <div class="grid w-full gap-6">
          <Card class="border border-gray-300 shadow-none">
            <CardHeader class="flex flex-row items-center justify-between w-full p-6 border-b">
              <div class="flex flex-col items-start gap-2 py-2">
                <CardTitle> Team Members </CardTitle>
                <span class="text-sm text-gray-500"> Manage team members and invitations </span>
              </div>
              <!-- <CardTeamAddMembers /> -->
            </CardHeader>
            <CardContent class="flex flex-col mt-6">
              <CardTeamMemberList class="w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
