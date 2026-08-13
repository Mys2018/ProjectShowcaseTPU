import { create } from 'zustand'
import type { UserRole } from '../types'

interface PreferencesState {
  preferredRoleType: UserRole['type']
  setPreferredRoleType: (roleType: UserRole['type']) => void
}

export const usePreferencesStore = create<PreferencesState>(set => ({
  preferredRoleType: 'Default',
  setPreferredRoleType: roleType => set({ preferredRoleType: roleType })
}))
