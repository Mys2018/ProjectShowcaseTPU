import styles from './CreateProjectCard.module.css'
import {ProjectCardData} from './data.ts'
import {typeProjectsLabel} from "@/shared/constants/type-project-label/typeProjectsLabel.tsx";
import ImageIcon from '@/shared/ui/icons/image.svg?react'
import clsx from "clsx";
import {SmallGreenButton} from "@/shared/ui/elements/buttons";

type CreateProjectCardProps = {
  type: 'Case' | 'Real' | 'Study',
  onClick?: () => void
};

const getClass = (type: "Case" | "Real" | "Study" | undefined) => {
  switch (type) {
    case 'Real':
      return styles.real;
    case 'Study':
      return styles.study;
    case 'Case':
      return styles.case;
    default:
      return '';
  }
}

export function CreateProjectCard({type, onClick}: CreateProjectCardProps) {

  const card = ProjectCardData.find(item => item.type === type)

  return (
      <div className={styles.body}>

        <div className={styles.header}>
          {typeProjectsLabel(type)}
          <p>
            <span>{card?.courses}</span> курc
          </p>
        </div>

        <div className={clsx(styles.image, getClass(card?.type))}>
          <ImageIcon className={getClass(card?.type)}/>
        </div>

        <p className={clsx(styles.title, getClass(card?.type))}>
          {card?.description}
        </p>

        <div className={styles.footer}>
          <div className={styles.info}>

            <div className={styles.block}>
              <p className={styles.blockTitle}>
                Требования к продукту (PRD):
              </p>
              <p className={styles.prd}>
                {card?.prd}
              </p>
            </div>

            <div className={styles.block}>
              <p className={styles.blockTitle}>
                Возможный заказчик:
              </p>
              <div className={styles.custList}>
                {card?.customers.map((cust) => (
                    <p key={cust} className={styles.item}>
                      {cust}
                    </p>
                ))}
              </div>
            </div>

          </div>

          <SmallGreenButton
            onClick={onClick}
            textButton={'Выбрать'}
          />
        </div>

      </div>
  );
};