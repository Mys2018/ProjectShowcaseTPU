import styles from './SkillTagList.module.css'
import { ProjectTeamPopup } from '@/entities/project/ui/project-team-popup/ProjectTeamPopup'

interface SkillItem {
  id: string
  name: string
}

interface SkillTagListProps {
  skills: SkillItem[]
  maxVisible?: number
}

export const SkillTagList = ({ skills, maxVisible = 3 }: SkillTagListProps) => {
  if (skills.length === 0) {
    return <p className={styles.noSkills}>Определённые навыки не требуются</p>
  }

  const visible = skills.slice(0, maxVisible)
  const hidden = skills.slice(maxVisible)

  return (
    <div className={styles.container}>
      {visible.map((skill) => (
        <div key={skill.id} className={styles.skill}>
          {skill.name}
        </div>
      ))}

      {hidden.length > 0 && (
        <ProjectTeamPopup
          title="Остальные навыки"
          triggerOn="hover"
          trigger={
            <div className={styles.remainingBadge}>
              +{hidden.length}
            </div>
          }
        >
          <div className={styles.popupSkillList}>
            {hidden.map((skill) => (
              <div key={skill.id} className={styles.popupSkill}>
                {skill.name}
              </div>
            ))}
          </div>
        </ProjectTeamPopup>
      )}
    </div>
  )
}
