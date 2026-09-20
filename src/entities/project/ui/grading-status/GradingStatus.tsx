import styles from './GradingStatus.module.css'
import type { GradingState } from "@/entities/project";
import InfoIcon from '@/shared/ui/icons/help_icons.svg?react'
import BigInfoIcon from '@/shared/ui/icons/big_info.svg?react'
import ProjectLockIcon from '@/shared/ui/icons/project_lock.svg?react'
import clsx from "clsx";
import { WhiteOutlineButton } from "@/shared";
import { InfoTooltip } from "@/shared/ui";

interface GradingStatusProps {
  type: GradingState
  count: number
  className?: string
  onClick?: () => void
  onUnblockClick?: () => void
}

export const GradingStatus = ({
  type,
  count,
  className,
  onClick,
  onUnblockClick
}: GradingStatusProps) => {
  const handleUnblock = () => {
    onUnblockClick?.();
    onClick?.();
  };

  switch (type) {
    case 'Open':
      return (
        <InfoTooltip
          title="Оцените работу участников"
          body={[{
            text: ["Первая неделя спринта подходит к концу — выставьте баллы студентам за их работу."]
          }]}
          size="large"
          pointer="bottomRight"
          className={className}
        >
          <div className={clsx(styles.base, styles.open)}>
            <InfoIcon />
            <span>Нужно оценить: {count}</span>
          </div>
        </InfoTooltip>
      );

    case 'WarningNeedsGrading':
      return (
        <InfoTooltip
          title="Пропущена оценка за 1-ю неделю"
          body={[{
            text: ["Вы не выставили баллы за прошлую неделю. Оценить работу участников сразу за обе недели можно до окончания текущего спринта."]
          }]}
          importantText="Если не закрыть спринт вовремя, возможность выставления баллов будет заблокирована."
          size="large"
          pointer="bottomRight"
          className={className}
        >
          <div className={clsx(styles.base, styles.warningNeedsGrading)}>
            <InfoIcon />
            <span>Нужно оценить: {count}</span>
          </div>
        </InfoTooltip>
      );

    case 'DangerNeedsGrading':
      return (
        <InfoTooltip
          title="Необходимо срочно закрывать спринт"
          body={[{
            text: ["До завершения спринта осталось мало времени. Необходимо проставить баллы участникам за обе недели."]
          }]}
          importantText="Если не закрыть спринт вовремя, возможность выставления баллов будет заблокирована."
          size="large"
          pointer="bottomRight"
          className={className}
        >
          <div className={clsx(styles.base, styles.dangerNeedsGrading)}>
            <BigInfoIcon className={styles.dangerNeedsGradingIcon} />
            <span>Нужно оценить: {count}</span>
          </div>
        </InfoTooltip>
      );

    case 'BlockedOverdue':
      return (
        <div className={clsx(styles.lock, className)} onClick={(e) => e.stopPropagation()}>
          <div>
            <ProjectLockIcon />
            <span>Оценивание недоступно</span>
          </div>
          <WhiteOutlineButton
            text={"Как разблокировать?"}
            onClick={handleUnblock}
          />
        </div>
      );

    case 'Closed':
    case 'LockedBeforeMidweek':
      return null;
  }
};

