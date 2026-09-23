import styles from './ProfileWidget.module.css';
// import { InfoTooltip } from '@/shared';
import {Avatar, TeamUserCard} from "@/entities/user";

interface ProfileWidgetProps {
  userId?: number | string;
  first_name: string;
  last_name: string;
  role: string;
  avatarSrc?: string;
  onClick?: () => void;
}


export const ProfileWidget = ({ userId, first_name, last_name, role, avatarSrc, onClick }: ProfileWidgetProps) => {
  return (
    <div className={styles.profileWidget}>
      <TeamUserCard
        userId={userId}
        onClick={onClick}
        firstName={last_name}
        lastName={first_name}
        nameTextStyle={"ALS"}
        nameSubtextStyle={"OS-10-400"}
        nameStyle={"normal"}
        anotherText={role}
        avatar={
          <Avatar
            userId={userId}
            fallbackType={"user"}
            size={"48px"}
            strokeColor={"white"}
            picture={avatarSrc}
          />
        }
      />


      {/*<InfoTooltip*/}
      {/*  title="Заголовок тултипа"*/}
      {/*  body={*/}
      {/*    [*/}
      {/*      {*/}
      {/*        text: [*/}
      {/*          'Бла бла',*/}
      {/*        ]*/}
      {/*      },*/}
      {/*    ]*/}
      {/*  }*/}
      {/*  size={'small'}*/}
      {/*  pointer={'topRight'}*/}
      {/*  importantText={'Важно тут!'}*/}
      {/*  link={'sdfsdsdsds'}*/}
      {/*  className={styles.questionIcon}*/}
      {/*  type={'help'}*/}
      {/*/>*/}
    </div>
  )
}