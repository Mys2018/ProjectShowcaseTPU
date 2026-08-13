import styles from './Filter.module.css'
import { useFilterStore } from '../../model/useFilterStore'
import { useCompetencies } from '@/entities/competency'
import { useTags } from '@/entities/tag'
import FolderIcon from '@/shared/ui/icons/folder.svg?react'
import { getProjectFormatTranslation, PROJECT_FORMATS } from '@/entities/project'

export default function Filter() {
  const {
    projectTypes: chosenProjectTypes,
    tags: chosenTags,
    competencies: chosenCompetencies,
    toggleProjectType,
    toggleTag,
    toggleCompetency
  } = useFilterStore()
  const { data: tagGroups = [] } = useTags()
  const { data: competencies = [] } = useCompetencies()

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
            .filter(g => g.tags.length)
            .map(group => (
              <div className={styles.tagBlock} key={group.id}>
                <p className={styles.field}>{group.name}</p>
                <div className={styles.tagsList}>
                  {group.tags.map(tag => (
                    <div key={tag.id} className={`${styles.tag} ${chosenTags.has(tag.id) ? styles.selected : ''}`} onClick={() => toggleTag(tag.id)}>
                      {tag.name}
                    </div>
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
            <div
              key={competency.id}
              className={`${styles.competencies} ${chosenCompetencies.has(competency.id) ? styles.selected : ''}`}
              onClick={() => toggleCompetency(competency.id)}
            >
              {competency.name}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
