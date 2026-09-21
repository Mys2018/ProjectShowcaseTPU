import { useMemo } from 'react';
import type { GradingState } from './types';
import { useProjectSprints, useSprintsGradingStatus } from '../api';

export interface ProjectGradingResult {
  state: GradingState;
  unratedCount: number;
  isLoading: boolean;
  isError: boolean;
}

export const useProjectGrading = (
  projectId: string,
  enabled: boolean = true
): ProjectGradingResult => {
  // Локальная дата в YYYY-MM-DD
  const today = useMemo(() => new Date().toLocaleDateString('sv-SE'), []);

  const sprintsQuery = useProjectSprints(projectId, enabled && !!projectId);

  const startedSprintIds = useMemo(() => {
    if (!enabled || !sprintsQuery.data) return [];
    return sprintsQuery.data
      .filter(s => s.startDate <= today)
      .map(s => s.id);
  }, [enabled, sprintsQuery.data, today]);

  const gradingsQuery = useSprintsGradingStatus(
    projectId,
    startedSprintIds,
    enabled && startedSprintIds.length > 0
  );

  const result = useMemo<ProjectGradingResult>(() => {
    if (!enabled || !projectId) {
      return {
        state: 'Closed',
        unratedCount: 0,
        isLoading: false,
        isError: false,
      };
    }

    const isLoading = sprintsQuery.isLoading || gradingsQuery.isLoading;
    const isError = sprintsQuery.isError || gradingsQuery.isError;

    const sprints = sprintsQuery.data ?? [];
    const gradings = gradingsQuery.data ?? [];

    if (isLoading) {
      return {
        state: 'Closed',
        unratedCount: 0,
        isLoading: true,
        isError: false,
      };
    }

    if (isError || sprints.length === 0) {
      return {
        state: 'Closed',
        unratedCount: 0,
        isLoading: false,
        isError,
      };
    }

    // 1. Если хотя бы один спринт просрочен и заблокирован — блокируется всё оценивание проекта
    const hasBlocked = gradings.some(g => g.overallState === 'BlockedOverdue');
    if (hasBlocked) {
      return {
        state: 'BlockedOverdue',
        unratedCount: 0,
        isLoading: false,
        isError: false,
      };
    }

    // 2. Ищем текущий спринт
    const currentSprint =
      sprints.find(s => s.isCurrent) ||
      [...sprints]
        .filter(s => s.startDate <= today)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .pop();

    if (!currentSprint) {
      return {
        state: 'LockedBeforeMidweek',
        unratedCount: 0,
        isLoading: false,
        isError: false,
      };
    }

    const currentGrading = gradings.find(g => g.sprintId === currentSprint.id);

    if (!currentGrading) {
      return {
        state: 'LockedBeforeMidweek',
        unratedCount: 0,
        isLoading: false,
        isError: false,
      };
    }

    const state = currentGrading.overallState;

    // Считаем количество неоценённых ячеек/студентов
    let unratedCount = 0;
    const students = currentGrading.students ?? [];

    if (students.length > 0) {
      for (const student of students) {
        for (const week of student.weeks ?? []) {
          if (
            (week.hours == null || week.hours === undefined) &&
            (week.state === 'Open' ||
              week.state === 'WarningNeedsGrading' ||
              week.state === 'DangerNeedsGrading')
          ) {
            unratedCount++;
          }
        }
      }
    } else {
      // Фолбэк, если список студентов внутри grading не передан
      unratedCount = state === 'DangerNeedsGrading' ? 10 : 5;
    }

    // Если всё уже оценено (unratedCount === 0), но статус не Closed/BlockedOverdue
    if (unratedCount === 0 && state !== 'BlockedOverdue' && state !== 'LockedBeforeMidweek') {
      return {
        state: 'Closed',
        unratedCount: 0,
        isLoading: false,
        isError: false,
      };
    }

    return {
      state,
      unratedCount,
      isLoading: false,
      isError: false,
    };
  }, [
    enabled,
    projectId,
    sprintsQuery.isLoading,
    sprintsQuery.isError,
    sprintsQuery.data,
    gradingsQuery.isLoading,
    gradingsQuery.isError,
    gradingsQuery.data,
    today,
  ]);

  return result;
};
