/* eslint-disable fsd/no-cross-slice-dependency */
/* eslint-disable fsd/forbidden-imports */
import type { PROJECT_FORMATS } from "./constants";
import type { CheckpointGroup } from "@/entities/checkpoint";
import type { Tag } from "@/entities/tag";

export type ProjectDirection = 'web' | 'mobile' | 'engineering' | 'ml' | 'fintech' | 'design';
export type ProjectFormat = typeof PROJECT_FORMATS[number];
export type CreateProjectRequestType =
  | 'Case'
  | 'Real'
  | 'Study';

export interface ProjectDirectionItem {
  key: ProjectDirection;
  label: string;
}

interface TagItem {
  tagId: string;
  tagName: string;
  groupId: string;
}

export interface ProjectCardData {
  id: string;
  type: ProjectFormat;
  tags: Tag[];
  primaryTag: Tag;
  ownerId: number;
  partnerId: string;
  status: string;
  meta: {
    title: string;
    description: string;
  };
  checkpoints: CheckpointGroup;
  roles: {
    roleId: string;
    placesCount: number;
    minPlacesCount: number;
    places: number;
    meta: {
      name: string;
      description: string;
    };
    skills: {
      skillId: string;
      skillName: string;
      requireSkill?: boolean;
    }[];
  }[];
  prdMeta: PrdMeta;
  extended?: boolean;
  brandColor?: string;
  liked: boolean
}

export interface ProjectResponseCheckpointDto {
  limit: number;
  offset: number;
  total: number;
  checkpoints: ProjectCheckpoints[];
}

interface ProjectCheckpoint {
  title: string;
  deadline: string;
}

interface ProjectCheckpoints {
  id?: string;
  name: string;
  checkpoints: ProjectCheckpoint[];
}

export interface GetProjectResponseCheckpoint {
  checkpointId: string
}

export interface ProjectRole {
  roleId: string;
  roleType: {
    id: string;
    name: string;
  };
  placesCount: number;
  minPlacesCount: number;
  places: number[];
  skills: {
    skillId: string;
    skillName: string;
  }[];
  meta: {
    description: string;
  };
}

export interface AudienceSegment {
  title: string;
  minAge: number;
  maxAge: number;
  description: string;
}

export interface PrdMeta {
  prerequisites?: string,
  productVision?: string,
  audience?: AudienceSegment[],
  projectGoal?: string,
  businessGoal?: string,
  problemStatement?: string,
  functional?: string[],
  nonFunctional?: string[],
  keyFunctionality?: string[],
  businessMetrics?: string[],
  projectPlan?: string[]
}

export interface ProjectDto {
  id: string;
  ownerId: number;
  tags: TagItem[];
  primaryTag: TagItem;
  partnerId: string;
  status: 'Active' | 'Approved' | 'Archived' | 'Completed' | 'NeedsRework' | 'Pending' | 'Rejected';
  meta: {
    title: string;
    description: string;
  };
  checkpoints: ProjectCheckpoints;
  roles: ProjectRole[];
  prdMeta: PrdMeta;
  type?: ProjectFormat;
  isLikedByMe?: boolean
}

export interface ProjectsResponseDto {
  hits: ProjectDto[];
  total: number;
  offset: number;
  limit: number;
}

export interface GetProjectsResponse {
  projects: ProjectCardData[];
  total: number;
}

export interface GetProjectsQueryParams {
  q?: string;
  projectType?: string[]
  status?: string[];
  tagId?: string[];
  roleTypeId?: string[];
  userId?: number[];
  managerId?: number[];
  sort?: 'relevance' | 'created_asc' | 'created_desc';
  offset?: number;
  limit?: number;
}

export interface CreateProjectRolePayload {
  roleTypeId: string;
  placesCount: number;
  minPlacesCount: number;
  meta: {
    name: string;
    description: string;
  };
  tags: TagItem[];
  primaryTag: TagItem;
}

export interface BaseCreateProjectDto {
  ownerId: number;
  partnerId: string;
  checkpoints: string;
  meta: {
    title: string;
    description: string;
  };
  roles: CreateProjectRolePayload[];
  tags: TagItem[];
  primaryTag: TagItem;
  repository?: { platformId: string, url: string }[];
  taskTracker?: { platformId: string, url: string }[];
  designEnvironment?: { platformId: string, url: string }[];
}

export interface CreateStudyProjectDto extends BaseCreateProjectDto {
  type: 'Study';
  prdMeta: {
    prerequisites: string;
    projectGoal: string;
    keyFunctionality: string[];
  };
}

export interface CreateCaseProjectDto extends BaseCreateProjectDto {
  type: 'Case';
  prdMeta: {
    prerequisites: string,
    audience: AudienceSegment[],
    projectGoal: string,
    functional: string[],
    problemStatement: string
  };
}

export interface CreateRealProjectDto extends BaseCreateProjectDto {
  type: 'Real';
  prdMeta: {
    productVision: string,
    audience: AudienceSegment[],
    projectGoal: string,
    businessGoal: string,
    functional: string[],
    nonFunctional: string[],
    businessMetrics: string[],
    projectPlan: string[]
  };
}

export type CreateProjectDto = CreateCaseProjectDto | CreateRealProjectDto | CreateStudyProjectDto;