import styles from './MyPlatformLayout.module.css';
import { Outlet } from "react-router-dom";

export const MyPlatformLayout = () => {
    return (
        <div className={styles.wrap}>
            <Outlet />
        </div>
    );
}