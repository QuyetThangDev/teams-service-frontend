import { defineStore } from 'pinia'
import type { Team } from '@/types/team'

export const useTeamStore = defineStore('teamStore', {
  state: (): {
    team: Team | null
    // isLoading: boolean;
    // isError: boolean;
    // error: Error | null;
    // selectedTeam: Team | null
    // showNewTeamDialog: boolean
    // showMembersDialog: boolean
  } => ({
    team: null
    // isLoading: false,
    // isError: false,
    // error: null,
    // selectedTeam: null,
    // showNewTeamDialog: false,
    // showMembersDialog: false
  }),
  actions: {
    setCurrentTeam(team: Team) {
      this.team = team
    }
  }
})
