import type { Component } from 'vue'
import { Home, KeyRound, NotepadText, Settings, Router, Package, Tag } from 'lucide-vue-next'

export interface Menu {
  title: string
  path: string
  //   icon: Component
}

export interface Section {
  sectionName: string
  menus: Menu[]
}

export default (): {
  sections: Section[]
} => {
  const accountMenus = [
    {
      title: 'Overview',
      path: '/account'
    },
    {
      title: 'Activity',
      path: '/account/activity'
    },
    {
      title: 'Settings',
      path: '/account/settings'
    }
  ]
  const accountOverviewMenus = [
    {
      title: 'Teams',
      path: '/account'
    },
    {
      title: 'Domains',
      path: '/account/domains'
    }
  ]
  const accountSettingsMenus = [
    {
      title: 'General',
      path: '/account/settings'
    },
    {
      title: 'Authentication',
      path: '/account/settings/authentication'
    }
  ]

  const sections = [
    {
      sectionName: 'Account',
      menus: accountMenus
    },
    {
      sectionName: 'Account Overview',
      menus: accountOverviewMenus
    },
    {
      sectionName: 'Account Settings',
      menus: accountSettingsMenus
    }
  ]
  return {
    sections
  }
}
