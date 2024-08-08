<template>
  <div>
    <Card class="border border-gray-300 shadow-none">
      <CardHeader class="flex flex-col items-start gap-4 p-4 border-b">
        <CardTitle>Default Team</CardTitle>
        <CardDescription>
          Your default team will be used when you make a request through the API or CLI where you
          don’t specify a particular team. It will also be the team selected when you first navigate
          to the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4">
          <TeamSwitcher />
        </form>
      </CardContent>
      <CardFooter class="px-6 py-4 border-t">
        <Button>Save</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import TeamSwitcher from '@/views/dashboard/components/TeamSwitcher.vue'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>
