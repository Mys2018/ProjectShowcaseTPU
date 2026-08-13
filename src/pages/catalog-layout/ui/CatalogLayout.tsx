import styles from './CatalogLayout.module.css';
// import { SwitchProjectMenu } from '@/features/switch-projects';
import {Outlet} from "react-router-dom";

export function CatalogLayout() {

  return (
    <div className={styles.wrap}>
      <Outlet/>
    </div>
  );
}