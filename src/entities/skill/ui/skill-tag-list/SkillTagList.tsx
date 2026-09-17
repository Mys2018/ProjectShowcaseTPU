import styles from './SkillTagList.module.css'
import { ProjectTeamPopup } from '@/entities/project/ui/project-team-popup/ProjectTeamPopup.tsx'
import type { Skill } from '../../model/types'
import clsx from 'clsx'
import {SkillBadge} from "@/entities/skill";

export interface SkillTagListProps {
  skills: Skill[]
  maxVisible?: number
  className?: string
}

export const SkillTagList = ({ skills, maxVisible = 3, className }: SkillTagListProps) => {
  if (!skills || skills.length === 0) {
    return <p className={clsx(styles.noSkills, className)}>Определённые навыки не требуются</p>
  }

  const visible = skills.slice(0, maxVisible)
  const hidden = skills.slice(maxVisible)

  return (
    <div className={styles.container}>
      {visible.map((skill) => (
        <SkillBadge
          key={skill.id}
          skill={skill}
        />
      ))}

      {hidden.length > 0 && (
        <ProjectTeamPopup
          title="Остальные навыки"
          triggerOn="hover"
          trigger={
            <div className={styles.remainingBadge}>
              ещё +{hidden.length}
            </div>
          }
        >
          <div className={styles.popupSkillList}>
            {hidden.map((skill) => (
              <SkillBadge
                key={skill.id}
                skill={skill}
              />
            ))}
          </div>
        </ProjectTeamPopup>
      )}
    </div>
  )
}

export { SkillTagList as SkillList }
