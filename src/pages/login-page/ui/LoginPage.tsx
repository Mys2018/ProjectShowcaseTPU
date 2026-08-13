import styles from "./LoginPage.module.css";
import { pkceService } from "@/features/auth";

export const LoginPage = () => {
  const handleLogin = async (): Promise<void> => {
    try {
      await pkceService.startAuth();
    } catch (error) {
      console.error("Не удалось начать авторизацию:", error);
    }
  };

  handleLogin()

  return (
    <div className={styles.mainContainer}>
      {/*Страница входа*/}
      {/*/!* eslint-disable-next-line @typescript-eslint/no-misused-promises *!/*/}
      {/*<button className={styles.loginButton} onClick={handleLogin}>*/}
      {/*  Войти*/}
      {/*</button>*/}
    </div>
  );
};
