import styles from './TeamUserCard.module.css'
import type { ReactNode } from "react";
import clsx from "clsx";

type TeamUserCardTextStyle = 'ALS' | 'bodyText' | 'OS-12-500' | 'bodySmall'
type TeamUserCardSubtextStyle = 'OS-10-400' | 'OS-12-350'
type TeamUserCardNameStyle = 'normal' | 'short' | 'twoLines'

interface TeamUserCardProps {
  firstName: string,
  lastName: string,
  course?: string | number,
  roles?: string[],
  competency?: string | string[],
  avatar?: ReactNode,

  nameTextStyle: TeamUserCardTextStyle
  nameSubtextStyle: TeamUserCardSubtextStyle
  nameStyle: TeamUserCardNameStyle
  anotherText?: string,
}

const getTeamUserCardTextStyle = (style: TeamUserCardTextStyle) => {
  switch (style) {
    case 'ALS':
      return styles.alsFont
    case 'bodyText':
      return styles.bodyText
    case 'OS-12-500':
      return styles.openSans
    case 'bodySmall':
      return styles.bodySmall
  }
}

const getTeamUserCardSubtextStyle = (style: TeamUserCardSubtextStyle) => {
  switch (style) {
    case 'OS-10-400':
      return styles.smallOS
    case 'OS-12-350':
      return styles.bigOS
  }
}

const getTeamUserCardNameComponent = (style: TeamUserCardNameStyle, firstName: string, lastName: string, className: string) => {
  switch (style) {
    case 'normal':
      return (
        <p className={clsx(styles.text, className)} title={`${firstName} ${lastName}`}>
          {firstName} {lastName}
        </p>
      )
    case 'short':
      return (
        <p className={clsx(styles.text, className)} title={`${firstName} ${lastName}`}>
          {firstName} {lastName.charAt(0).toUpperCase()}
        </p>
      )
    case 'twoLines':
      return (
        <div className={styles.twoLinesContainer} title={`${firstName} ${lastName}`}>
          <p className={clsx(styles.text, className)}>
            {firstName}
          </p>
          <p className={clsx(styles.text, className)}>
            {lastName}
          </p>
        </div>
      )
  }
}

export const TeamUserCard = ({
  course,
  firstName,
  lastName,
  roles,
  competency,
  avatar,
  nameTextStyle,
  nameSubtextStyle,
  nameStyle,
  anotherText
}: TeamUserCardProps) => {
  const displayRoles = competency ? [competency] : roles;

  return (
    <div className={styles.leftHalf}>
      {
        avatar
      }

      <div className={styles.infoBlock}>
        {
          getTeamUserCardNameComponent(nameStyle, firstName, lastName, getTeamUserCardTextStyle(nameTextStyle))
        }
        <div className={styles.moreInfo}>
          {
            anotherText && <p className={clsx(styles.text, getTeamUserCardSubtextStyle(nameSubtextStyle))}>
              {anotherText}
            </p>
          }
          {course && (
            <p className={clsx(styles.text, getTeamUserCardSubtextStyle(nameSubtextStyle))}>
              {course} курс
            </p>
          )}
          {(course && displayRoles && displayRoles.length > 0) && (
            <div className={styles.verticalSeparator} />
          )}
          {displayRoles && displayRoles.length > 0 && (
            <p
              className={clsx(styles.text, getTeamUserCardSubtextStyle(nameSubtextStyle))}
              title={displayRoles.join(',  ')}
            >
              {displayRoles.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
