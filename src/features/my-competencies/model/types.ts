import type { Skill } from "@/entities/skill";

export type Competence = {
  roleTypeId: string;
  roleTypeName?: string;
  skills: Skill[]
};