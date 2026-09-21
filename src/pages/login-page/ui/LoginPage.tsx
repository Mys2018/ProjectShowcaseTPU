import { useEffect, useRef } from "react";
import styles from "./LoginPage.module.css";
import { pkceService } from "@/features/auth";

export const LoginPage = () => {
  const startedRef = useRef(false);

  // PKCE-старт — побочный эффект, ровно один раз на маунт. В теле рендера он
  // срабатывал бы на каждый ререндер, перегенерируя code_verifier/state и
  // повторно дёргая window.location.assign.
  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    pkceService.startAuth().catch((error) => {
      console.error("Не удалось начать авторизацию:", error);
    });
  }, []);

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
