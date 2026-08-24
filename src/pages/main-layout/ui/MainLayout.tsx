import {Outlet, useNavigate} from 'react-router-dom'
import styles from './MainLayout.module.css'
import { Header } from '@/widgets/header'
import {useIsProfileFilled} from "@/entities/user/lib";
import {useModalStore} from "@/shared/model";
import {useEffect} from "react";
import {useMe} from "@/entities/user";
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
          navigate(ROUTES.MY_PLATFORM)
          closeModal()
        },
        onAgree: () => {
          navigate(ROUTES.MY_PROFILE)
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