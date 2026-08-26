import {useEffect} from "react";
import {Outlet, useNavigate} from 'react-router-dom'
import styles from './MainLayout.module.css'
import { Header } from '@/widgets/header'
import {useIsProfileFilled} from "@/entities/user/lib";
import {useMe} from "@/entities/user";
import {useModalStore} from "@/shared/model";
import {ROUTES} from "@/shared";

export const MainLayout = () => {

  const { isProfileFilled } = useIsProfileFilled()
  const { data: user, isSuccess } = useMe()
  const navigate = useNavigate();

  const openModal = useModalStore(state => state.openModal)
  const closeModal = useModalStore(state => state.closeModal)

  useEffect(() => {
    if (isSuccess && !isProfileFilled) {
      openModal('START_MODAL', {
        onClose: closeModal,
        profilePicture: user?.profilePicture,
        onCancel: () => {
          navigate(ROUTES.MY_PLATFORM.BASE)
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
    </main>
  )
}