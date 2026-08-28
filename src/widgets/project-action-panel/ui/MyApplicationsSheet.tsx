import styles from './MyApplicationsSheet.module.css'
import { useCancelApplication } from '../model/applications'
import { type ProjectRoleApplication } from '@/entities/application'
import { type ProjectCardData } from '@/entities/project'

interface MyApplicationsSheetProps {
  project: ProjectCardData
  applications: ProjectRoleApplication[]
}

/**
 * Содержимое шторки «Отменить»: заявки списком, каждая снимается по отдельности.
 * Скопом ничего не отменяется — это осознанно, чтобы нельзя было случайно
 * потерять все отклики одним тапом.
 */
export function MyApplicationsSheet({ project, applications }: MyApplicationsSheetProps) {
  const cancel = useCancelApplication(project.id)

  return (
    <div className={styles.sheet}>
      <h2 className={styles.title}>Ваши отклики</h2>
      <p className={styles.hint}>Заявку можно снять, пока её не рассмотрели.</p>

      <ul className={styles.list}>
        {applications.map(application => {
          const role = project.roles.find(r => r.roleId === application.roleID)
          const pending = cancel.isPending && cancel.variables === application.applicationID
          return (
            <li key={application.applicationID} className={styles.row}>
              <div className={styles.info}>
                <p className={styles.role}>{role?.meta.name ?? 'Роль'}</p>
                <p className={styles.status}>
                  {application.status === 'Approved' ? 'Заявка одобрена' : 'На рассмотрении'}
                </p>
              </div>
              <button
                type="button"
                className={styles.cancel}
                onClick={() => cancel.mutate(application.applicationID)}
                disabled={pending}
              >
                {pending ? 'Отменяем…' : 'Отменить'}
              </button>
            </li>
          )
        })}
      </ul>

      {cancel.isError && (
        <p className={styles.error}>Не удалось отменить заявку. Попробуйте ещё раз.</p>
      )}
    </div>
  )
}
