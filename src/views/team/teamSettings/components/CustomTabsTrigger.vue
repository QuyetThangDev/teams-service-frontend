<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'relative inline-flex items-center justify-start whitespace-nowrap py-2 text-sm ring-offset-background transition-all duration-300 ease-in-out text-gray-400 border-b-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:scale-x-0 before:bg-gray-500 before:transition-transform before:duration-300 before:ease-in-out',
        'data-[state=active]:text-foreground data-[state=active]:before:scale-x-100',
        props.class
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>
