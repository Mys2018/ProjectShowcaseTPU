import styles from './TestMenu.module.css'
import {updateProfileMeta} from "@/entities/user/api/requests.ts";


export const TestMenu = () => {
  const clearProfileData = () => {
    updateProfileMeta({
      "bio": "",
      "skills": [
      ]
    }).then(
      () => console.log('Данные профиля очищены')
    )
  }

  return (
    <div className={styles.containerList}>
      <button onClick={clearProfileData}>
        Очистить данные профиля
      </button>
    </div>
  )
}
