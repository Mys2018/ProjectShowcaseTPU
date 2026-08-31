import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {useEffect} from "react";
import {useMediaQuery} from "usehooks-ts";
import styles from './MainLayout.module.css'
import { Header } from '@/widgets/header'
import { MobileNavBar } from '@/widgets/mobile-nav-bar'
import {useIsProfileFilled} from "@/entities/user/lib";
import {useMe} from "@/entities/user";
import {useModalStore} from "@/shared/model";
import {MOBILE_BREAKPOINT} from "@/shared/lib";
import {ROUTES} from "@/shared";

export const MainLayout = () => {

  const { isProfileFilled } = useIsProfileFilled()
  const { data: user, isSuccess } = useMe()
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

  // Навигация живёт только на корневых страницах. На страницах-деталях её место
  // занимает панель действий — договорённость «где я» против «что я могу».
  const isRootPage = [
    ROUTES.MAIN,
    ROUTES.ACTIVITY.BASE,
    ROUTES.MANAGE.BASE,
    ROUTES.MODERATION.BASE,
    ROUTES.PROJECTS.RECRUITMENT,
    ROUTES.PROJECTS.IN_PROGRESS
  ].some(route => route === pathname);

  const openModal = useModalStore(state => state.openModal)
  const closeModal = useModalStore(state => state.closeModal)

  useEffect(() => {
    if (isSuccess && !isProfileFilled) {
      openModal('START_MODAL', {
        onClose: closeModal,
        profilePicture: user?.profilePicture,
        onCancel: () => {
          navigate(ROUTES.MAIN)
          closeModal()
        },
        onAgree: () => {
          navigate(ROUTES.PROFILE.BASE)
          closeModal()
        },
      })
    }
  }, [isSuccess, isProfileFilled, user?.profilePicture, openModal, closeModal, navigate])

  return (
    <main className={styles.mainLayout}>
      <Header/>
      <div className={styles.pageContainer}>
        <Outlet/>
      </div>
      {isMobile && isRootPage && <MobileNavBar />}
    </main>
  )
}