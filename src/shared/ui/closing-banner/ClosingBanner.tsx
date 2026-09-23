import {type ComponentType, isValidElement, type ReactNode, type SVGProps} from "react";
import clsx from "clsx";
import CrossIcon from '../icons/cross.svg?react';
import styles from './ClosingBanner.module.css';

export type ImageProp =
  | string
  | ReactNode
  | ComponentType<SVGProps<SVGSVGElement>>
  | ComponentType<{ className?: string }>

interface ClosingBannerProps {

  backgroundClass: string;
  title: string
  description: string

  isBannerVisible: boolean
  setIsBannerVisible: () => void;
  image: ImageProp | null

  greenClickableLabelFun?: () => void;
  greenClickableLabelText?: string;

  timerText?: string
  timerValue?: string
}

export const ClosingBanner = ({title, backgroundClass, description,  isBannerVisible, setIsBannerVisible, image, greenClickableLabelFun, greenClickableLabelText, timerText, timerValue}: ClosingBannerProps) => {

  const renderImage = () => {
    if (!image) return null

    if (typeof image === 'string') {
      return <img className={styles.image} src={image} alt={title || 'Иллюстрация'} loading="lazy" decoding="async" />
    }

    if (typeof image === 'function') {
      const Component = image
      return <Component className={styles.image} />
    }

    if (isValidElement(image)) {
      return <div className={styles.imageWrapper}>{image}</div>
    }

    return null
  }

  return (
    isBannerVisible && <div className={clsx(styles.banner,backgroundClass ) }>
      <button className={styles.closeButton} onClick={setIsBannerVisible}>
        <CrossIcon />
      </button>

      {renderImage()}

      <div className={styles.description}>
        <h3 className={styles.heading}> {title}</h3>
        <p className={styles.paragraph}>
          {description}
        </p>
      </div>

      {
        greenClickableLabelFun && greenClickableLabelText && <button className={styles.greenLabel} onClick={greenClickableLabelFun}>
          {greenClickableLabelText}
        </button>
      }

      {
        timerText && timerValue && <div className={styles.timer}>
          <p className={styles.paragraph}>{timerText}</p>
          <div className={styles.badge}>{timerValue}</div>
        </div>
      }

    </div>
  )
}
