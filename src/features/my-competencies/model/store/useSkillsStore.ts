import { create } from "zustand";
import type { Skill, Competence } from "@/features/my-competencies/model/types.ts";

interface SkillsStoreTypes {
  originalData: Competence[];
  draftData: Competence[];
  currentFullSkills: Skill[];
  hasChanges: boolean;

  isEditing: boolean;
  popoverOpenFor: string | null;

  globalSkills: Skill[];
  setGlobalSkills: (skills: Skill[]) => void;

  setInitialData: (data: Competence[]) => void;
  setOriginalData: (draftData: Competence[]) => void;
  startEditing: () => void;
  cancelEditing: () => void;
  // TODO Сохранить данные
  saveChanges: () => void;
  resetHasChanges: () => void;

  // TODO Типы поменять
  removeSkill: (competenceId: string, skillId: string) => void;
  addSkill: (skill: Skill) => void;
  removeCompetency: (competenceId: string) => void;
  addCompetency: (competenceId: string, roleTypeName: string) => void;
  setCompetencies: (selectedRoles: { id: string; name: string }[]) => void;

  setPopoverOpenFor: (competenceId: string | null) => void;

  getSkillsForCompetence: (competenceId: string) => void;
}

export const useSkillsStore = create<SkillsStoreTypes>((set) => ({
  originalData: [],
  draftData: [],
  hasChanges: false,

  currentFullSkills: [],

  isEditing: false,
  popoverOpenFor: null,

  globalSkills: [],
  setGlobalSkills: (skills) => set({ globalSkills: skills }),

  setInitialData: (data) => set({ originalData: data, draftData: data, hasChanges: false }),
  setOriginalData: (data) => set({ originalData: data }),

  startEditing: () => { set({ isEditing: true, popoverOpenFor: null }) },

  cancelEditing: () => { set((state) => ({ isEditing: false, draftData: [...state.originalData], hasChanges: false, popoverOpenFor: null })) },

  saveChanges: () => set((state) => ({ originalData: state.draftData, hasChanges: false, isEditing: false, popoverOpenFor: null })),

  resetHasChanges: () => set({ hasChanges: false }),

  removeSkill: (competenceId, skillId) => set((state) => {
    const newDraft = state.draftData.map((comp) =>
      comp.roleTypeId === competenceId ? { ...comp, skills: comp.skills.filter(skill => skill.skillId !== skillId) } : comp
    );
    let newCurrentFullSkills = state.currentFullSkills;
    if (state.popoverOpenFor === competenceId) {
      const addedSkillIds = new Set(newDraft.find(c => c.roleTypeId === competenceId)?.skills.map(s => s.skillId) ?? []);

      const filteredGlobals = state.globalSkills;

      newCurrentFullSkills = filteredGlobals.filter(s => !addedSkillIds.has(s.skillId));
    }
    return { draftData: newDraft, currentFullSkills: newCurrentFullSkills, hasChanges: JSON.stringify(newDraft) !== JSON.stringify(state.originalData) };
  }),

  addSkill: (skill) => set((state) => {
    const newDraft = state.draftData.map((comp) => {
      // Check if this skill actually belongs to the current competence being edited if needed.
      // Assuming addSkill adds to the competence that opened the popover:
      if (comp.roleTypeId === state.popoverOpenFor) {
        if (comp.skills.some((s) => s.skillId === skill.skillId)) return comp;
        return { ...comp, skills: [...comp.skills, skill] }
      }
      return comp
    });
    const newCurrentFullSkills = state.currentFullSkills.filter(s => s.skillId !== skill.skillId);
    return { draftData: newDraft, currentFullSkills: newCurrentFullSkills, hasChanges: JSON.stringify(newDraft) !== JSON.stringify(state.originalData) };
  }),

  removeCompetency: (competenceId) => set((state) => ({
    draftData: state.draftData.filter((comp) => comp.roleTypeId !== competenceId),
    hasChanges: true
  })),

  addCompetency: (competenceId, roleTypeName) => set((state) => {
    const newCompetence = {
      roleTypeId: competenceId,
      roleTypeName,
      skills: []
    };
    return {
      draftData: [...state.draftData, newCompetence],
      hasChanges: true
    };
  }),

  setCompetencies: (selectedRoles) => set((state) => {
    const selectedMap = new Map(selectedRoles.map((r) => [r.id, r.name]));
    const newDraft: Competence[] = [];

    // Keep existing competencies that are still selected
    for (const existing of state.draftData) {
      if (selectedMap.has(existing.roleTypeId)) {
        newDraft.push(existing);
        selectedMap.delete(existing.roleTypeId);
      }
    }

    // Add newly selected competencies
    for (const [id, name] of selectedMap.entries()) {
      newDraft.push({
        roleTypeId: id,
        roleTypeName: name,
        skills: []
      });
    }

    return {
      draftData: newDraft,
      hasChanges: JSON.stringify(newDraft) !== JSON.stringify(state.originalData)
    };
  }),

  setPopoverOpenFor: (competenceId) => set({ popoverOpenFor: competenceId }),

  getSkillsForCompetence: (competenceId) => set((state) => {
    const addedSkillIds = new Set(
      state.draftData.find(c => c.roleTypeId === competenceId)?.skills.map(s => s.skillId) ?? []
    );

    const filteredGlobals = state.globalSkills;

    return {
      currentFullSkills: filteredGlobals.filter(s => !addedSkillIds.has(s.skillId)),
    };
  }),

}))