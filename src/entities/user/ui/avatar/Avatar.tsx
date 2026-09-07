import styles from './Avatar.module.css'
import clsx from "clsx";
import React from "react";
import EditIcon from '@/shared/ui/icons/edit.svg?react';
import UserIcon from "@/shared/ui/icons/fallback_personal.svg?react";
import MentorIcon from '@/shared/ui/icons/fallback_mentor.svg?react';
import ModerIcon from '@/shared/ui/icons/fallback_moderator.svg?react';
import AdminIcon from '@/shared/ui/icons/fallback_admin.svg?react';
import OrgIcon from '@/shared/ui/icons/fallback_admin.svg?react';

export type AvatarSizeType = '108px' | '80px' | '70px' | '48px' | '40px' | '36px'
export type AvatarFallbackType = 'user' | 'mentor' | 'moder' | 'admin' | 'organization'
export type AvatarLabelColorType = 'white' | 'black'
export type AvatarStrokeColorType = 'white' | 'grey' | 'grad'


const FallbackIcons = {
  user: UserIcon,
  mentor: MentorIcon,
  moder: ModerIcon,
  admin: AdminIcon,
  organization: OrgIcon,
};

const getFallbackAvatar = (fallbackType: AvatarFallbackType) => {
  const Icon = FallbackIcons[fallbackType] || UserIcon;
  return <Icon className={styles.fallbackIcon} />;
}

const getLabelColor = (labelColor: AvatarLabelColorType) => styles[`${labelColor}Text` as keyof typeof styles] || styles.whiteText;

const getStrokeColor = (strokeColor: AvatarStrokeColorType) => styles[`${strokeColor}Stroke` as keyof typeof styles] || styles.gradStroke;

interface AvatarProps {
  picture?: string,
  className?: string,

  label?: string | undefined,
  labelColor?: AvatarLabelColorType,

  onClick?: () => void,
  onClickEditButton?: () => void,

  fallbackType: AvatarFallbackType,
  size: AvatarSizeType,

  strokeColor: AvatarStrokeColorType,
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
              getFallbackAvatar(fallbackType)
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
