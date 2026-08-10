import styles from './InfoTooltip.module.css'
import QuestionIcon from '@/shared/ui/icons/question.svg?react';
import HelpIcon from '@/shared/ui/icons/help_icons.svg?react';
import ImportantIcon from '@/shared/ui/icons/important.svg?react';
import BulbIcon from '@/shared/ui/icons/bulb.svg?react';
import React from "react";
import clsx from "clsx";

type SizeTooltip = 'small' | 'large'
type Pointer = 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight'

interface InfoTooltipProps {
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
  title?: string;
  body: {
    subtitle?: string;
    text?: string[];
  }[]
  size: SizeTooltip;
  importantText: string;
  link?: string;
  type?: 'question' | 'help' | 'bulb';
  pointer: Pointer;
}

const THEME_MAP: Record<SizeTooltip, {
  title: string;
  subtitle: string;
  text: string;
  important: string;
  link: string;
  tooltipBg: string;
}> = {
  small: {
    title: styles.titleSmall,
    subtitle: styles.subtitleSmall,
    text: styles.textSmall,
    important: styles.importantSmall,
    link: styles.linkSmall,
    tooltipBg: styles.tooltipSmall
  },
  large: {
    title: styles.titleLarge,
    subtitle: styles.subtitleLarge,
    text: styles.textLarge,
    important: styles.importantLarge,
    link: styles.linkLarge,
    tooltipBg: styles.tooltipLarge
  }
};

const getIconByType = (type: string, classNames: string) => {
  switch (type) {
    case 'question':
      return <QuestionIcon className={classNames} />;
    case 'help':
      return <HelpIcon className={classNames} />;
    case 'bulb':
      return <BulbIcon className={classNames} />
  }
}

export const InfoTooltip = ({ children, className, iconClassName, title, body, size, importantText, link, pointer, type }: InfoTooltipProps) => {

  const s = THEME_MAP[size];

  return (
    <div className={[styles.tooltipBody, className].filter(Boolean).join(' ')}>
      {
        type ? getIconByType(type, iconClassName || '') : children
      }
      <div className={clsx(styles.tooltip, s.tooltipBg, styles[pointer], type && styles.centered)}>
        <p className={clsx(styles.title, s.title)}>
          {title}
        </p>
        {
          body.map((block, index) => (
            <div key={index} className={styles.block}>
              {
                block.subtitle &&
                <p className={clsx(styles.subtitle, s.subtitle)}>
                  {block.subtitle}
                </p>
              }
              <div className={styles.textList}>
                {
                  block.text?.map((text, index) => (
                    <p key={index} className={clsx(styles.text, s.text)}>
                      {text}
                    </p>
                  ))
                }
              </div>
            </div>
          ))
        }

        {
          importantText &&
          <div className={styles.importantBlock}>
            <ImportantIcon />
            <p className={clsx(styles.important, s.important)}>
              {importantText}
            </p>
          </div>
        }

        {
          link &&
          <a className={clsx(styles.link, s.link)} href={link}>
            Ссылка на FAQ
          </a>
        }


      </div>
    </div>
  )
}