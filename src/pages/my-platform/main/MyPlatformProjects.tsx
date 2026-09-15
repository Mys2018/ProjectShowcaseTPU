import styles from './MyPlatformPage.module.css'
import { ProjectsGrid } from '@/widgets/projects-grid'
import { usePreferencesStore } from '@/entities/user'
import { assertNever } from '@/shared'

export function MyPlatformProjects() {
  const preferredRoleType = usePreferencesStore(s => s.preferredRoleType)

  switch (preferredRoleType) {
    case 'Student':
      return (
        <div className={styles.list}>
          <h2 className={styles.heading}>Проекты для вас</h2>
          <ProjectsGrid />
        </div>
      )
    case 'Curator':
    case 'Moderator':
    case null:
      return <></>
    default:
      return assertNever(preferredRoleType)
  }
}
