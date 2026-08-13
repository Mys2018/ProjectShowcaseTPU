import styles from './MyPlatformLayout.module.css';
import { Outlet } from "react-router-dom";
import { SwitchMyPlatform } from '@/features/switch-my-platform';

export const MyPlatformLayout = () => {
    return (
        <div className={styles.wrap}>
            <SwitchMyPlatform />
            <Outlet />
        </div>
    );
}