import { useCallback, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from 'usehooks-ts'
import styles from './SomeoneProfile.module.css'
import { MyCompetenciesList } from "@/features/my-competencies";
import { Portfolio } from "@/features/portfolio/Portfolio.tsx";
import { useUserById } from "@/entities/user";
import { CONTACTS_ANCHOR_ID, SomeoneProfileHeader } from "@/shared/ui/someone-profile-header/SomeoneProfileHeader.tsx";
import { FloatingPanel } from "@/shared/ui/floating-panel";
import { PopupMenu } from "@/shared/ui/popup-menu/PopupMenu.tsx";
import { MOBILE_BREAKPOINT, useMobileChrome } from "@/shared/lib";
import { usePageTitle, usePreviousPageTitle } from "@/shared/model";
import BackIcon from '@/shared/ui/icons/back.svg?react';
import FlagIcon from '@/shared/ui/icons/flag.svg?react';
import MoreIcon from '@/shared/ui/icons/more.svg?react'

export function SomeoneProfile() {
  usePageTitle('профилю пользователя');
  const backTitle = usePreviousPageTitle('Назад к списку проектов');

  const navigate = useNavigate();
  const params = useParams<{ id: string }>()
  const uid = params.id || ''
  const { data: user } = useUserById(uid)

  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  const { panelHidden } = useMobileChrome(isMobile)
  const [highlight, setHighlight] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Скроллим к контактам, только если блок не на виду. Если он и так примерно
  // по центру экрана — дёргать страницу не за чем, хватит подсветки.
  const showContacts = useCallback(() => {
    const el = document.getElementById(CONTACTS_ANCHOR_ID)
    if (!el) return
    const r = el.getBoundingClientRect()
    const comfortablyVisible = r.top >= window.innerHeight * 0.15 && r.bottom <= window.innerHeight * 0.85
    if (!comfortablyVisible) el.scrollIntoView({ behavior: 'smooth', block: 'center' })

    if (timer.current) clearTimeout(timer.current)
    setHighlight(true)
    timer.current = setTimeout(() => setHighlight(false), 700)
  }, [])

  if (!user) {
    return null;
  }

  return (
    <div className={styles.mainContent}>
      <section className={styles.headerLeft} onClick={() => void navigate(-1)} style={{ cursor: 'pointer' }}>
        <BackIcon className={styles.backIcon} />
        <p className={styles.back}>{backTitle}</p>
      </section>

      <section className={styles.title}>
        Профиль студентика
      </section>

      <section className={styles.see}>
        <PopupMenu
          trigger={<button
            type="button"
            className={styles.moreMenuButton}
          >
            <MoreIcon />
          </button>}
        >
          <PopupMenu.Row onClick={() => { }} title={'Сообщить о нарушении'}>
            <FlagIcon />
          </PopupMenu.Row>
        </PopupMenu>
      </section>

      <section className={styles.profile}>
        <SomeoneProfileHeader user={user} links={user.meta.messengers} highlight={highlight} onClickSee={() => void navigate(`/profile/${user.id}`)} />
        <div className={styles.body}>
          {user.meta.skills && <MyCompetenciesList savedSkills={user.meta.skills} readonly={true} />}
          <Portfolio firstValue={user.meta.portfolioLink || ''} readonly={true} />

        </div>
      </section>

      {isMobile && (
        <FloatingPanel hidden={panelHidden}>
          <FloatingPanel.Back />
          <FloatingPanel.Action tone="violet" onClick={showContacts}>
            Связаться
          </FloatingPanel.Action>
          {/* TODO: navigator.share — подключить вместе с остальными страницами */}
          <FloatingPanel.Share />
        </FloatingPanel>
      )}
    </div>
  );
}
