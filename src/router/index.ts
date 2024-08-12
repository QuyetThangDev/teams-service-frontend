import { useUserStore } from '@/stores/userStore'
import { createRouter, createWebHistory } from 'vue-router'

const DashboardLayout = () => import('@/layouts/DashboardLayout.vue')
const FullLayout = () => import('@/layouts/FullLayout.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/auth',
      component: FullLayout,
      redirect: '/login',
      meta: {
        authRequired: false
      },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/auth/LoginView.vue')
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/views/auth/SignupView.vue')
        },
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          component: () => import('@/views/auth/ForgotPasswordView.vue')
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          component: () => import('@/views/auth/ResetPasswordView.vue')
        }
      ]
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardLayout,
      meta: {
        authRequired: true
      },
      children: [
        {
          path: '',
          name: 'Empty',
          component: () => import('@/views/dashboard/EmptyDashboard.vue')
        }
      ]
    },
    {
      path: '/teams',
      name: 'Teams',
      redirect: 'teams/:id/dashboard',
      component: DashboardLayout,
      meta: {
        authRequired: true
      },
      children: [
        {
          path: ':id',
          name: 'Team',

          meta: {
            subNav: 'navbarTeam'
          },
          component: () => import('@/layouts/team/TeamDashboardLayout.vue'),
          children: [
            {
              path: 'dashboard',
              name: 'TeamDashboard',
              meta: {
                subNav: 'navbarTeam'
              },
              component: () => import('@/layouts/team/TeamDashboardLayout.vue')
            },
            {
              path: 'devices',
              name: 'TeamDevices',
              meta: {
                subNav: 'navbarTeam'
              },
              component: () => import('@/views/team/teamDevices/TeamDevicesView.vue')
            },
            {
              path: 'settings',
              name: 'TeamSettings',
              meta: {
                subNav: 'navbarTeam'
              },
              component: () => import('@/layouts/team/TeamSettingsLayout.vue'),
              children: [
                {
                  path: '',
                  name: 'TeamSettingsGeneral',
                  meta: {
                    subNav: 'navbarTeam'
                  },
                  component: () =>
                    import('@/views/team/teamSettings/components/TeamSettingsGeneralView.vue')
                },
                {
                  path: 'invoices',
                  name: 'TeamSettingsInvoices',
                  meta: {
                    subNav: 'navbarTeam'
                  },
                  component: () =>
                    import('@/views/team/teamSettings/components/TeamSettingsInvoicesView.vue')
                },
                {
                  path: 'Members',
                  name: 'TeamSettingsMembers',
                  meta: {
                    subNav: 'navbarTeam'
                  },
                  component: () =>
                    import('@/views/team/teamSettings/components/TeamSettingsMembersView.vue')
                },
                {
                  path: 'access-groups',
                  name: 'TeamSettingsAccessGroups',
                  meta: {
                    subNav: 'navbarTeam'
                  },
                  component: () =>
                    import('@/views/team/teamSettings/components/TeamSettingsAccessGroupsView.vue')
                },
                {
                  path: 'security',
                  name: 'TeamSettingsSecurity',
                  meta: {
                    subNav: 'navbarTeam'
                  },
                  component: () =>
                    import('@/views/team/teamSettings/components/TeamSettingsSecurityView.vue')
                }
              ]
            }
          ]
        }
      ]
    },

    {
      path: '/account',
      name: 'Account',
      redirect: '/account/overview',
      component: DashboardLayout,
      meta: {
        authRequired: true
      },
      children: [
        {
          path: '',
          name: 'AccountOverview',
          meta: {
            subNav: 'navbarAccount'
          },
          component: () => import('@/layouts/account/AccountOverviewLayout.vue'),
          children: [
            {
              path: '',
              name: 'AccountOverview',
              meta: {
                subNav: 'navbarAccount'
              },
              component: () => import('@/views/account/accountOverview/AccountOverviewView.vue')
            },
            {
              path: 'domains',
              name: 'DomainsSettings',
              meta: {
                subNav: 'navbarAccount'
              },
              component: () => import('@/views/account/accountOverview/AccountDomainsView.vue')
            }
          ]
        },

        {
          path: 'activity',
          name: 'AccountActivity',
          meta: {
            subNav: 'navbarAccount'
          },
          component: () => import('@/views/account/accountActivity/AccountActivityView.vue')
        },
        {
          path: 'settings',
          name: 'AccountSettings',
          meta: {
            subNav: 'navbarAccount'
          },
          component: () => import('@/layouts/account/AccountSettingsLayout.vue'),
          children: [
            {
              path: '',
              name: 'AccountGeneral',
              meta: {
                subNav: 'navbarAccount'
              },
              component: () => import('@/views/account/accountSettings/AccountGeneralView.vue')
            },
            {
              path: 'authentication',
              name: 'AccountAuthentication',
              meta: {
                subNav: 'navbarAccount'
              },
              component: () =>
                import('@/views/account/accountSettings/AccountAuthenticationView.vue')
            }
          ]
        }
      ]
    }
  ]
})

export function toLogin(path?: string): void {
  const userStore = useUserStore()
  userStore.logout()
  const currentPath = router.currentRoute.value.path
  currentPath !== '/auth/login' &&
    router.push({
      path: '/auth/login'
      // query: { to: path ? path : (currentPath ?? undefined) }
    })
}

export default router
