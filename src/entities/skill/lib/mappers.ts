import type { Skill, SkillDto } from '../model/types'

export const mapSkillDto = (dto: SkillDto): Skill => ({
  id: dto.skillId,
  name: dto.skillName,
  roleTypeId: dto.roleTypeId
})
