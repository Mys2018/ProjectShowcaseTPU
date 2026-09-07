import styles from "./ProjectPublicStatusLabel.module.css";
import type {ProjectStatus} from "../../model/types.ts";
import TargetIcon from '@/shared/ui/icons/target.svg?react'
import clsx from "clsx";

interface ProjectStatusLabelProps {
  status: ProjectStatus
}

const getStatusData = (status: ProjectStatus) => {
  switch (status) {
    case "Recruiting":
      return {
        label: "Набор на проект",
        className: styles.green,
        target: true
      };
    case "RecruitmentCompleted":
      return {
        label: "Набор завершен",
        className: styles.orange,
        target: true
      };
    case "InProgress":
      return {
        label: "В работе",
        className: styles.violet,
        target: true
      };
    case "Completed":
      return {
        label: "Завершен",
        className: styles.grey,
        target: false
      };
    case "NotImplemented":
      return {
        label: "Не реализован",
        className: styles.green,
        target: false
      };
    case "Rejected":
      return {
        label: "Отклонён модератором",
        className: styles.green,
        target: true
      };
    default:
      return {
        label: "Нет статуса",
        className: styles.grey,
        target: false
      };
  }
}

export const ProjectPublicStatusLabel = ({status}: ProjectStatusLabelProps) => {
  const { label, className, target } = getStatusData(status);

  return (
    <span className={clsx(styles.status, className)}>
      {
        target && <TargetIcon className={className}/>
      }
      {
        label
      }
    </span>
  )
}