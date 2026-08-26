import { create } from 'zustand'
import type { UserSwitchableRole } from '../types'

interface PreferencesState {
  preferredRoleType: UserSwitchableRole['type'] | null
  setPreferredRoleType: (roleType: UserSwitchableRole['type']) => void
}

export const usePreferencesStore = create<PreferencesState>(set => ({
  preferredRoleType: null,
  setPreferredRoleType: roleType => set({ preferredRoleType: roleType })
}))
