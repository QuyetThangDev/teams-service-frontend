<template>
  <Tabs default-value="teamMembers" class="flex flex-col flex-grow">
    <div class="grid items-center justify-between w-full grid-cols-4 gap-2 mb-4">
      <div class="col-span-2">
        <TabsList class="grid w-[300px] gap-4 grid-cols-2">
          <CustomTabsTrigger value="teamMembers" class="text-left">Team Members</CustomTabsTrigger>
          <CustomTabsTrigger value="pendingInvitations" class="text-left"
            >Pending Invitations</CustomTabsTrigger
          >
        </TabsList>
      </div>
      <div class="flex flex-row justify-end col-span-2 gap-2">
        <RoleFilterPopover :roles="roleList" />
        <CardTeamAddMembers />
      </div>
    </div>

    <div class="flex-grow">
      <TabsContent value="teamMembers">
        <Card class="shadow-none">
          <CardContent class="p-0">
            <ScrollArea class="w-full whitespace-nowrap">
              <ScrollArea class="h-[64vh] w-full relative">
                <Table class="w-full shadow-none">
                  <TableBody>
                    <!-- Loop through paginatedMembers and render each member -->
                    <TableRow v-for="member in paginatedMembers" :key="member.id">
                      <TableCell>{{ member.first_name }}</TableCell>
                      <TableCell>{{ member.last_name }}</TableCell>
                      <TableCell>{{ member.email }}</TableCell>
                      <TableCell>{{ member.role }}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
          <CardFooter class="flex items-end justify-end flex-1 mr-4">
            <div class="flex space-x-6">
              <div class="flex items-center gap-1 text-sm text-muted-foreground">
                <span class="sr-only sm:not-sr-only">Items per page:</span>
                <Select>
                  <SelectTrigger class="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="size in ITEM_PER_PAGES"
                        :key="size"
                        :value="size.toString()"
                      >
                        {{ size }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex w-[100px] items-center justify-center text-sm font-medium"></div>
              <Pagination
                :total="totalCount"
                :page="currentPage"
                :page-size="pageSize"
                @change="handlePageChange"
              >
                <PaginationList class="flex items-center gap-1">
                  <PaginationFirst :disabled="isFirstPage" @click="goToPage(1)" />
                  <PaginationPrev :disabled="isFirstPage" @click="prevPage" />
                  <PaginationNext :disabled="isLastPage" @click="nextPage" />
                  <PaginationLast :disabled="isLastPage" @click="goToPage(totalPages)" />
                </PaginationList>
              </Pagination>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="pendingInvitations">
        <Card class="shadow-none">
          <CardContent class="p-0">
            <ScrollArea class="w-full whitespace-nowrap">
              <ScrollArea class="h-[64vh] w-full relative">
                <Table class="w-full shadow-none">
                  <TableBody>
                    <!-- Pending invitations content -->
                    <TableRow>
                      <TableCell v-if="team">{{ team.name }}</TableCell>
                      <TableCell v-else>N/A</TableCell>
                      <TableCell v-if="team">{{ team.description }}</TableCell>
                      <TableCell v-else>No description available</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
          <CardFooter class="flex items-end justify-end flex-1 mr-4">
            <div class="flex space-x-6">
              <div class="flex items-center gap-1 text-sm text-muted-foreground">
                <span class="sr-only sm:not-sr-only">Items per page:</span>
                <Select>
                  <SelectTrigger class="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="size in ITEM_PER_PAGES"
                        :key="size"
                        :value="size.toString()"
                      >
                        {{ size }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex w-[100px] items-center justify-center text-sm font-medium"></div>
              <Pagination
                :total="totalCount"
                :page="currentPage"
                :page-size="pageSize"
                @change="handlePageChange"
              >
                <PaginationList class="flex items-center gap-1">
                  <PaginationFirst :disabled="isFirstPage" @click="goToPage(1)" />
                  <PaginationPrev :disabled="isFirstPage" @click="prevPage" />
                  <PaginationNext :disabled="isLastPage" @click="nextPage" />
                  <PaginationLast :disabled="isLastPage" @click="goToPage(totalPages)" />
                </PaginationList>
              </Pagination>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </div>
  </Tabs>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import CustomTabsTrigger from '@/views/team/teamSettings/components/CustomTabsTrigger.vue'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { useTeamStore } from '@/stores/teamStore'
import membersfake from './memberfake.json' // Giả lập API, thay thế khi có API thật
import RoleFilterPopover from './RoleFilterPopover.vue'
import type { TeamMember, TeamRole } from '@/types/team'
import CardTeamAddMembers from './CardTeamAddMembers.vue'

const ITEM_PER_PAGES = [10, 20, 30, 40, 50]

const route = useRoute()
const router = useRouter()
const store = useTeamStore()
const { team } = storeToRefs(store)

const roleList = ref<TeamRole[]>([])
const paginatedMembers = ref<any[]>([])

const defaultPageSize = 6
const defaultPage = 1

const pageSize = ref(parseInt(route.query.pageSize as string) || defaultPageSize)
const currentPage = ref(parseInt(route.query.page as string) || defaultPage)
const totalCount = ref(0)

async function fetchData(pageSize: number, page: number) {
  const start = (page - 1) * pageSize
  const end = start + pageSize

  const response = membersfake
  totalCount.value = response.total
  return response.items.slice(start, end)
}

async function fetchRoles() {
  const data = await fetchData(pageSize.value, currentPage.value)
  const rolesSet = new Set<string>()
  data.forEach((member) => rolesSet.add(member.role))
  const uniqueRoles = Array.from(rolesSet)

  // Update roleList with unique roles
  roleList.value = uniqueRoles.map((role) => ({ name: role }))
}

async function loadData() {
  const data = await fetchData(pageSize.value, currentPage.value)
  await fetchRoles() // Update roleList here
  paginatedMembers.value = data
  console.log('Roles', roleList.value)
}

onMounted(() => {
  if (!route.query.page || !route.query.pageSize) {
    router.replace({ query: { page: defaultPage, pageSize: defaultPageSize } })
  }
  loadData()
})

watch([pageSize, currentPage], () => {
  router.push({ query: { pageSize: pageSize.value, page: currentPage.value } })
  loadData()
})

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))
const isFirstPage = computed(() => currentPage.value === 1)
const isLastPage = computed(() => currentPage.value === totalPages.value)

function handlePageChange(newPage: number) {
  currentPage.value = newPage
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function prevPage() {
  if (!isFirstPage.value) {
    currentPage.value -= 1
  }
}

function nextPage() {
  if (!isLastPage.value) {
    currentPage.value += 1
  }
}
</script>
