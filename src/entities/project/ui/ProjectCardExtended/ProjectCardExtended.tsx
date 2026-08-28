import styles from './ProjectCardExtended.module.css';
import type { ProjectCardData } from '../../model/types';
import Pattern from '@/assets/svg/Pattern.svg'
import { typeProjectsLabel } from '@/shared/constants/type-project-label/typeProjectsLabel';

interface Props {
  project: ProjectCardData;
}

export default function ProjectCardExtended({ project }: Props) {
  const { id, type, tags, primaryTag, partnerId, meta, roles, brandColor } = project;

  const visibleDirections = tags.slice(0, 3);
  const remainCount = tags.length - 3;

  const competencies = roles.map(role => role.meta.name);

  return (
    <div className={`${styles.cardBody}`} style={brandColor ? { '--accent': brandColor.startsWith('#') ? brandColor : `#${brandColor}` } as React.CSSProperties : undefined}>
      <div className={styles.accentBody}>
        <img className={styles.pattern} src={Pattern} alt='Узор' />

        <div className={`${styles.header} ${styles[primaryTag.id]}`}>
          <div className={styles.tags}>
            {visibleDirections.map((d) => (
              <div key={d.id} className={styles.tag}>{primaryTag.name}</div>
            ))}
            {remainCount > 0 && (
              <div className={styles.tagCount}>Ещё +{remainCount}</div>
            )}
          </div>

        </div>

        <div className={styles.body}>
          <div className={styles.titleAndOrg}>
            <div className={styles.metaContainer}>
              <div className={styles.meta}>
                {typeProjectsLabel(type)}
                <div className={styles.id}>№ {id}</div>
              </div>
              <div className={styles.title}>{meta.title}</div>
            </div>


            <div className={styles.org}>
              <div className={styles.orgAvatar}>Т</div>
              <div className={styles.orgInfo}>
                <span className={styles.orgName}>{(partnerId as any)?.verbose || partnerId}</span>
                <span className={styles.orgSub}>публикационная активность</span>
              </div>
            </div>
          </div>


          {meta.description && <p className={styles.description}>{meta.description}</p>}

          <div className={styles.competenciesBlock}>
            <div className={styles.competenciesLabel}>{competencies.length} компетенций:</div>
            <div className={styles.competenciesWrapper}>
              <div className={styles.competencies}>
                {competencies.map((c, i) => (
                  <span key={i} className={styles.competency}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}