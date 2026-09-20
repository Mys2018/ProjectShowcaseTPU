import styles from './TeamUserCard.module.css'
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { buildRoute } from "@/shared/config/routes";
import { useModalStore } from "@/shared/model";

type TeamUserCardTextStyle = 'ALS' | 'bodyText' | 'OS-12-500' | 'bodySmall'
type TeamUserCardSubtextStyle = 'OS-10-400' | 'OS-12-350'
type TeamUserCardNameStyle = 'normal' | 'short' | 'twoLines'

interface TeamUserCardProps {
  userId?: number | string,
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void,
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
  /** Приписка сразу после фамилии, например «(Вы)». */
  nameSuffix?: ReactNode,
  /** Иконка перед ролями, например иконка компетенции. */
  rolesIcon?: ReactNode,
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

const getTeamUserCardNameComponent = (style: TeamUserCardNameStyle, firstName: string, lastName: string, className: string, suffix?: ReactNode) => {
  const tail = suffix && <> {suffix}</>
  switch (style) {
    case 'normal':
      return (
        <p className={clsx(styles.text, className)} title={`${firstName} ${lastName}`}>
          {firstName} {lastName}{tail}
        </p>
      )
    case 'short':
      return (
        <p className={clsx(styles.text, className)} title={`${firstName} ${lastName}`}>
          {firstName} {lastName.charAt(0).toUpperCase()}{tail}
        </p>
      )
    case 'twoLines':
      return (
        <div className={styles.twoLinesContainer} title={`${firstName} ${lastName}`}>
          <p className={clsx(styles.text, className)}>
            {firstName}
          </p>
          <p className={clsx(styles.text, className)}>
            {lastName}{tail}
          </p>
        </div>
      )
  }
}

export const TeamUserCard = ({
  userId,
  onClick,
  course,
  firstName,
  lastName,
  roles,
  competency,
  avatar,
  nameTextStyle,
  nameSubtextStyle,
  nameStyle,
  anotherText,
  nameSuffix,
  rolesIcon
}: TeamUserCardProps) => {
  const navigate = useNavigate();

  const handleClick = onClick ?? (userId ? (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    useModalStore.getState().closeModal();
    navigate(buildRoute.profileById(String(userId)));
  } : undefined);

  const displayRoles = competency ? [competency] : roles;
  const rolesText = displayRoles && displayRoles.length > 0 && (
    <p
      className={clsx(styles.text, getTeamUserCardSubtextStyle(nameSubtextStyle))}
      title={displayRoles.join(',  ')}
    >
      {displayRoles.join(', ')}
    </p>
  );

  return (
    <div className={clsx(styles.leftHalf, handleClick && styles.clickable)} onClick={handleClick}>
      {
        avatar
      }

      <div className={styles.infoBlock}>
        {
          getTeamUserCardNameComponent(nameStyle, firstName, lastName, getTeamUserCardTextStyle(nameTextStyle), nameSuffix)
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
          {rolesText && (
            rolesIcon ? (
              <div className={styles.rolesWithIcon}>
                {rolesIcon}
                {rolesText}
              </div>
            ) : rolesText
          )}
        </div>
      </div>
    </div>
  )
}
