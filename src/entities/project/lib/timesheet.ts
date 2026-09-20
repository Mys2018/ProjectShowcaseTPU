import type { ProjectTimesheetSummaryResponse } from '../model/types'

export const getStudentProjectHours = (
  summary?: ProjectTimesheetSummaryResponse,
  studentId?: number | string
): number => {
  if (!summary || !studentId) return 0
  const student = summary.students?.find(
    (s) => String(s.studentId) === String(studentId)
  )
  return student?.totalHours ?? 0
}
