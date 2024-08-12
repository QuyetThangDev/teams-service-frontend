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
  const dashboardMenus = [
    {
      title: 'Dashboard',
      path: '/dashboard'
    },
    {
      title: 'Devices',
      path: '/devices'
    },
    { title: 'Settings', path: '/settings' }
  ]
  const teamSettingMenus = [
    {
      title: 'General',
      path: ''
    },
    {
      title: 'Invoices',
      path: '/invoices'
    },
    {
      title: 'Members',
      path: '/members'
    },
    {
      title: 'Access Groups',
      path: '/access-groups'
    },
    {
      title: 'Security & Privacy',
      path: '/security'
    }
  ]
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
      sectionName: 'Dashboard',
      menus: dashboardMenus
    },
    {
      sectionName: 'Teams Settings',
      menus: teamSettingMenus
    },
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
