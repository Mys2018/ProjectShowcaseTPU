export type Skill = {
  id: string
  name: string
  roleTypeId: string // TODO change to competenceId
}

export type SkillDto = {
  skillId: string
  skillName: string
  roleTypeId: string
}
