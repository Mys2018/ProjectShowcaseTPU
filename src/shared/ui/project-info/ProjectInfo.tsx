import styles from './ProjectInfo.module.css'
import {InfoTooltip} from "..";
import { typeProjectsLabel, getProjectTagBackground, type ProjectCardData } from '@/entities/project';
import { PartnerRow, PartnerRowSkeleton, usePartnerById } from '@/entities/partner';

type ProjectInfoProps = {
  data: ProjectCardData
};



export const ProjectInfo = ({ data }: ProjectInfoProps) => {

  const { data: partner, isLoading } = usePartnerById(data.partnerId, Boolean(data.partnerId));

  return (
    <div className={styles.projectMain} style={{ background: getProjectTagBackground(data.primaryTag.name) }}>
      <div className={styles.topLabel}>
        <div className={styles.mainInfo}>
          <div className={styles.tags}>
            <div className={styles.tag}>
              {data.primaryTag.name}
            </div>
            {
              data.tags.map(direction => (
                <div key={direction.id} className={styles.tag}>
                  {direction.name}
                </div>
              ))
            }
          </div>
        </div>
        <div className={styles.format}>

          <InfoTooltip
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Можно пробовать с минимальными навыками: главное — желание учиться и открывать для себя новые скиллы. Мы тебя ждём!',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topRight'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            className={styles.questionIcon}
          >
            {typeProjectsLabel(data.type)}
          </InfoTooltip>

          {/* TODO move to widget -> add like button (features/like-project) */}
        </div>
      </div>

      <div className={styles.mainBlock}>
        {partner ? (
          <PartnerRow partner={partner} />
        ) : isLoading ? (
          <PartnerRowSkeleton />
        ) : null}

        <p className={styles.description}>{data.meta.description}</p>
      </div>
    </div>
  );
};