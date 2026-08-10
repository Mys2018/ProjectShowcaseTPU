import type { ProjectCardData } from '@/entities/project/model/types';
import styles from './ProjectInfo.module.css'
import { typeProjectsLabel, getProjectTagBackground } from '@/entities/project';
import {InfoTooltip, LikeButton} from "@/shared";
import {getPartnerById} from "@/entities/partner/api/requests.ts";
import {useEffect, useState} from "react";
import type {PartnerDto} from "@/entities/partner/api/types.ts";

type ProjectInfoProps = {
  data: ProjectCardData
};



export const ProjectInfo = ({ data }: ProjectInfoProps) => {

  const [partner, setPartner] = useState<PartnerDto>();

  useEffect(() => {
    const fetchPartner = async () => {
      const partner = await getPartnerById(data.partnerId);
      setPartner(partner)
    }
    fetchPartner();
  }, [data.partnerId]);

  return (
    <div className={styles.projectMain} style={{ background: getProjectTagBackground(data.primaryTag.tagName) }}>
      <div className={styles.topLabel}>
        <div className={styles.mainInfo}>
          <div className={styles.tags}>
            <div className={styles.tag}>
              {data.primaryTag.tagName}
            </div>
            {
              data.tags.map(direction => (
                <div key={direction.tagId} className={styles.tag}>
                  {direction.tagName}
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

          <LikeButton isLiked={false} onClick={() => {}}/>
        </div>
      </div>

      <div className={styles.mainBlock}>
        <div className={styles.orgBlock}>
          <div className={styles.orgAvatarContainer}>
            {
              partner &&
              <img className={styles.orgAvatar} src={partner.profilePicture} alt={partner.name}/>
            }
          </div>
          <div className={styles.orgInfo}>
            <span className={styles.orgName}>{partner?.name}</span>
            <span className={styles.orgSub}>публикационная активность</span>
          </div>
        </div>

        <p className={styles.description}>{data.meta.description}</p>
      </div>
    </div>
  );
};