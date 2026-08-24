import type { Skill, SkillDto } from "../model/types";
import { mapSkillDto } from "../lib/mappers";
import { api, ENDPOINTS } from "@/shared";

export const getSkills = async (): Promise<Skill[]> => {
	const { data } =  await api.get<SkillDto[]>(ENDPOINTS.SKILLS)
	return data.map(mapSkillDto)
}