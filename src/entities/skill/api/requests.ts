import type { Skill, SkillDto } from "../model/types";
import { mapSkillDto } from "../lib/mappers";
import { api, ENDPOINTS } from "@/shared";

const SKILLS_PAGE_SIZE = 100;

type GetSkillsParams = {
  query?: string;
  roleType?: string;
};

/**
 * Backend defaults to limit=10. Fetch all pages so every competency
 * has its full skill list on the frontend.
 */
export const getSkills = async (params: GetSkillsParams = {}): Promise<Skill[]> => {
  const all: Skill[] = [];
  let offset = 0;

  while (true) {
    const { data } = await api.get<SkillDto[]>(ENDPOINTS.SKILLS, {
      params: {
        query: params.query ?? "",
        ...(params.roleType ? { roleType: params.roleType } : {}),
        offset,
        limit: SKILLS_PAGE_SIZE,
      },
    });

    const page = Array.isArray(data) ? data : [];
    all.push(...page.map(mapSkillDto));

    if (page.length < SKILLS_PAGE_SIZE) {
      break;
    }

    offset += SKILLS_PAGE_SIZE;
  }

  return all;
};
