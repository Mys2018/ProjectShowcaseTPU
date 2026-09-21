import styles from './Filter.module.css'
import { useFilterStore } from '../../model/useFilterStore'
import { CompetencyChip, useCompetencies } from '@/entities/competency'
import { TagChip, useTags } from '@/entities/tag'
import { getProjectFormatTranslation, PROJECT_FORMATS } from '@/entities/project'
import FolderIcon from '@/shared/ui/icons/folder.svg?react'
import {GreyFilledButton} from "@/shared";

export default function Filter() {
  const {
    projectTypes: chosenProjectTypes,
    tags: chosenTags,
    competencies: chosenCompetencies,
    query,
    toggleProjectType,
    toggleTag,
    toggleCompetency,
    reset,
  } = useFilterStore()
  const { data: rawTagGroups } = useTags()
  const { data: rawCompetencies } = useCompetencies()

  const tagGroups = Array.isArray(rawTagGroups) ? rawTagGroups : []
  const competencies = Array.isArray(rawCompetencies) ? rawCompetencies : []

  const hasActiveFilters =
    chosenProjectTypes.size > 0 ||
    chosenTags.size > 0 ||
    chosenCompetencies.size > 0 ||
    Boolean(query?.trim())

  return (
    <aside className={styles.body}>
      <div className={styles.projectContainer}>
        <h3 className={styles.title}>Тип проекта</h3>
        <div className={styles.typeProjects}>
          {PROJECT_FORMATS.map(format => (
            <div
              key={format}
              className={`${styles.project} ${chosenProjectTypes.has(format) ? styles.selected : ''}`}
              onClick={() => toggleProjectType(format)}
            >
              <FolderIcon className={styles.folderIcon} />
              <p className={styles.projectTitle}>{getProjectFormatTranslation(format)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.tagsContainer}>
        <h3 className={styles.title}>Трек-теги</h3>
        <div className={styles.bodyTags}>
          {tagGroups
            .filter(g => Array.isArray(g.tags) && g.tags.length > 0)
            .map(group => (
              <div className={styles.tagBlock} key={group.id}>
                <p className={styles.field}>{group.name}:</p>
                <div className={styles.tagsList}>
                  {group.tags.map(tag => (
                    <TagChip key={tag.id} tag={tag} active={chosenTags.has(tag.id)} onClick={() => toggleTag(tag.id)} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.competenciesContainer}>
        <h3 className={styles.title}>Компетенции</h3>
        <div className={styles.competenciesList}>
          {competencies.map(competency => (
            <CompetencyChip
              key={competency.id}
              competency={competency}
              active={chosenCompetencies.has(competency.id)}
              onClick={() => toggleCompetency(competency.id)}
            />
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <GreyFilledButton
          buttonText={'Сбросить все фильтры'}
          onClick={reset}
          className={styles.filledButton}
        />
      )}

    </aside>
  )
}

