import styles from './SkillBadge.module.css'
import type {Skill} from "../../model/types.ts";

interface SkillBadgeProps {
  skill: Skill
}

export const SkillBadge = ({skill}: SkillBadgeProps) => {
  return (
    <div className={styles.skill}>
      {skill.name}
    </div>
  )
}
