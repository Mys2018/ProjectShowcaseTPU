import styles from './Avatar.module.css'
import clsx from "clsx";
import EditIcon from '@/shared/ui/icons/edit.svg?react';
import UserIcon from "@/shared/ui/icons/fallback_personal.svg?react";
import MentorIcon from '@/shared/ui/icons/fallback_mentor.svg?react';
import ModerIcon from '@/shared/ui/icons/fallback_moderator.svg?react';
import AdminIcon from '@/shared/ui/icons/fallback_admin.svg?react';
import OrgIcon from '@/shared/ui/icons/fallback_admin.svg?react';
import React from "react";

type SizeType = '108px' | '80px' | '70px' | '48px' | '40px' | '36px'
type FallbackType = 'user' | 'mentor' | 'moder' | 'admin' | 'organization'
type LabelColorType = 'white' | 'black'
type StrokeColorType = 'white' | 'grey' | 'grad'


const FallbackIcons = {
  user: UserIcon,
  mentor: MentorIcon,
  moder: ModerIcon,
  admin: AdminIcon,
  organization: OrgIcon,
};

const getFallbackAvatar = (fallbackType: FallbackType, sizeStyle: React.CSSProperties) => {
  const Icon = FallbackIcons[fallbackType] || UserIcon;
  return <Icon style={sizeStyle} />;
}

const getLabelColor = (labelColor: LabelColorType) => styles[`${labelColor}Text` as keyof typeof styles] || styles.whiteText;

const getStrokeColor = (strokeColor: StrokeColorType) => styles[`${strokeColor}Stroke` as keyof typeof styles] || styles.gradStroke;

interface AvatarProps {
  picture?: string,
  className?: string,

  label?: string | undefined,
  labelColor?: LabelColorType,

  onClick?: () => void,
  onClickEditButton?: () => void,

  fallbackType: FallbackType,
  size: SizeType,

  strokeColor: StrokeColorType,
}


export const Avatar = ({picture, className, label, onClick, onClickEditButton, fallbackType, labelColor, size, strokeColor}: AvatarProps) => {
  const sizeStyle: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size
  };

  return (
    <div className={clsx(styles.avatarContainer, className, getStrokeColor(strokeColor))} style={sizeStyle} onClick={onClick}>
      {
        picture ?
          <img className={clsx(styles.avatar)} src={picture} alt="Аватар студента" /> :
          <div className={styles.avatar}>
            {
              getFallbackAvatar(fallbackType, sizeStyle)
            }
          </div>
      }
      {label && labelColor && (
        <div className={clsx(styles.status, getLabelColor(labelColor))}>
          {label}
        </div>
      )}
      {
        onClickEditButton && (
          <button className={styles.editButton} onClick={onClickEditButton}>
            <EditIcon />
          </button>
        )
      }
    </div>
  )
}
