export type ApplicationStatus = 'Approved' | 'Rejected' | 'Pending' | 'Closed'

export interface Application {
  applicationID: string,
  studentID: number,
  roleID: string,
  createdAt: string,
  status: ApplicationStatus
}