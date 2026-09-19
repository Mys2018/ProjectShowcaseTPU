/* eslint-disable fsd/no-cross-slice-dependency */
/* eslint-disable fsd/forbidden-imports */
import type { PROJECT_FORMATS } from "./constants";
import type { CheckpointGroup, CheckpointDto } from "@/entities/checkpoint";
import type { Tag } from "@/entities/tag";
import type { Partner } from "@/entities/partner";
import type { UserCard } from "@/entities/user";

export type ProjectDirection = 'web' | 'mobile' | 'engineering' | 'ml' | 'fintech' | 'design';
export type ProjectFormat = typeof PROJECT_FORMATS[number];
// TODO Убрать лишнее
export type ProjectStatus = 'Pending' | 'NeedsRework' | 'Recruiting'  | 'RecruitmentCompleted' | 'InProgress' | 'Completed' | 'NotImplemented' | 'Rejected';
export type ProjectStatusOld = 'Active' | 'Approved' | 'Archived' | 'Completed' | 'NeedsRework' | 'Pending' | 'Rejected';
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

export interface ProjectPartnerDto {
  projectPartnerId: string;
  name: string;
  profilePicture?: string;
}

/** @deprecated Use UserCard from @/entities/user instead according to OpenAPI spec */
export type ProjectTeamMember = UserCard;
export type ProjectTeamMemberDto = UserCard;

/** Ссылка проекта на внешнюю платформу. По api.yaml: ProjectPlatformLink. */
export interface ProjectPlatformLink {
  platformId: string;
  url: string;
  name: string;
}

export interface ProjectCardData {
  id: string;
  type: ProjectFormat;
  tags: Tag[];
  primaryTag: Tag;
  ownerId: number;
  partner: Partner;
  status: ProjectStatus;
  meta: {
    title: string;
    description: string;
  };
  checkpoints: CheckpointGroup;
  roles: {
    roleId: string;
    roleTypeId?: string;
    placesCount: number;
    minPlacesCount: number;
    places: number;
    placeUserIds: number[];
    meta: {
      name: string;
      description: string;
    };
    skills: {
      skillId: string;
      skillName: string;
      requireSkill?: boolean;
    }[];
    relevance?: number;
  }[];
  prdMeta: PrdMeta;
  isLiked: boolean;
  /** TODO: заглушка — отзывов в API пока нет */
  hasMyReview: boolean;
  extended?: boolean;
  brandColor?: string;
  liked: boolean;
  repository?: ProjectPlatformLink[];
  taskTracker?: ProjectPlatformLink[];
  designEnvironment?: ProjectPlatformLink[];
  otherPlatforms?: ProjectPlatformLink[];
  team?: UserCard[];
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
  relevance?: number;
  applicationsCount?: number;
  isAppliedByMe?: boolean;
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
  projectGoal: string,
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
  partner: ProjectPartnerDto;
  status: ProjectStatus;
  meta: {
    title: string;
    description: string;
  };
  checkpoints: ProjectCheckpoints;
  customCheckpoints?: CheckpointDto[];
  roles: ProjectRole[];
  prdMeta: PrdMeta;
  type?: ProjectFormat;
  isLikedByMe?: boolean;
  repository?: ProjectPlatformLink[];
  taskTracker?: ProjectPlatformLink[];
  designEnvironment?: ProjectPlatformLink[];
  otherPlatforms?: ProjectPlatformLink[];
}

export interface ProjectsResponseDto {
  hits: ProjectDto[];
  total: number;
  offset: number;
  limit: number;
}

export interface GetProjectReviewResponse {
  comment?: string
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
  onlyApplied?: boolean;
}

export interface GetUserProjectsParams {
  offset?: number;
  limit?: number;
}

export type GetLikedProjectsParams = GetUserProjectsParams;
export type GetManagedProjectsParams = GetUserProjectsParams;
export type GetCuratedProjectsParams = GetUserProjectsParams;
export type GetParticipatingProjectsParams = GetUserProjectsParams;
export type GetAppliedProjectsParams = GetUserProjectsParams;

export interface CreateProjectRolePayload {
  roleTypeId: string;
  placesCount: number;
  minPlacesCount: number;
  skillIds: string[];
}

export interface BaseCreateProjectDto {
  ownerId?: number;
  partnerId: string;
  checkpoints: string;
  customCheckpoints?: { title: string; deadline: string }[];
  meta: {
    title: string;
    description: string;
  };
  roles: CreateProjectRolePayload[];
  tagIds: string[];
  primaryTagId: string;
  repository?: { platformId: string; name: string; url: string }[];
  taskTracker?: { platformId: string; name: string; url: string }[];
  otherPlatforms?: { platformId: string; name: string; url: string }[];
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
    prerequisites: string,
    productVision: string,
    audience: AudienceSegment[],
    projectGoal: string,
    businessGoal: string,
    keyFunctionality: string[],
    functional: string[],
    nonFunctional: string[],
    problemStatement: string,
    businessMetrics: string[],
    projectPlan: string[]
  };
}

export type CreateProjectDto = CreateCaseProjectDto | CreateRealProjectDto | CreateStudyProjectDto;
/* ── Спринты и табель часов ───────────────────────────────────────── */

export type GradingState =
  | 'BlockedOverdue'
  | 'Closed'
  | 'DangerNeedsGrading'
  | 'LockedBeforeMidweek'
  | 'Open'
  | 'WarningNeedsGrading'

export interface ProjectSprint {
  id: string
  /** YYYY-MM-DD */
  startDate: string
  /** YYYY-MM-DD */
  endDate: string
  isCurrent: boolean
}

export interface WeekGradingStatus {
  weekNumber: number
  /** Нет поля — часы за неделю ещё не выставлены. */
  hours?: number
  state: GradingState
}

export interface StudentGradingStatus {
  studentId: number
  studentName: string
  weeks?: WeekGradingStatus[]
}

export interface SprintGradingStatus {
  sprintId: string
  overallState: GradingState
  students?: StudentGradingStatus[]
}

export interface StudentHoursInput {
  studentId: number
  /** Тот же weekNumber, что пришёл в grading-status. */
  weekNumber: number
  hours: number
}

export interface SprintHoursBatch {
  sprintId: string
  records: StudentHoursInput[]
}
