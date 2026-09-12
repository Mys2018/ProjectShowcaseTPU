import styles from './AddProjectElement.module.css'
import PlusComposition from '@/shared/assets/svg/plus_composition.svg?react'
import {BluePlusVioletButton} from "@/shared/ui/elements/buttons/blue-plus-violet-button/BluePlusVioletButton.tsx";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/shared";

export const AddProjectElement = () => {

  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <PlusComposition className={styles.plusComposition}/>
      <BluePlusVioletButton
        className={styles.button}
        onClick={() => {
          navigate(ROUTES.PROJECTS.CREATE)
        }}
        textButton={"Создать новый проект"}
      />
    </div>
  )
}
