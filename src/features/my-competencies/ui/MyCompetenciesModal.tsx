import styles from './MyCompetenciesModal.module.css'
import type { Skill } from "@/features/my-competencies/model/types.ts";

type MyCompetenciesModalProps = {
  currentFullSkills: Skill[],
  addSkill: (skill: Skill) => void;
  setPopoverOpenFor: (competenceId: string | null) => void;
};

export const MyCompetenciesModal = ({ currentFullSkills, addSkill, setPopoverOpenFor }: MyCompetenciesModalProps) => {
  return (
    <div className={styles.modalBody}>
      <div className={styles.skillsList}>
        {currentFullSkills.map((skill) => (
          <button type="button" key={skill.skillId} className={styles.skill} onClick={() => addSkill(skill)}>
            {skill.skillName}
          </button>
        ))}

        {
          currentFullSkills.length === 0 && (
            <p className={styles.allSelected}>
              Все навыки выбраны
            </p>
          )
        }
      </div>

      <button
        type="button"
        className={styles.closeButton}
        onClick={() => setPopoverOpenFor(null)}
      >
        свернуть
      </button>
    </div>
  );
};