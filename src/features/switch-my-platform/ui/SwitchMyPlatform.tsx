import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared';
import { RouterTabs, type TabItem } from '@/shared/ui';

const MY_PLATFORMS_TABS: TabItem[] = [
    { label: 'Главная', to: ROUTES.MAIN },
    // { label: 'Проектная деятельность', to: ROUTES.ACTIVITY.BASE },
    { label: 'Создание проекта', to: ROUTES.PROJECTS.CREATE },
    { label: 'Мой профиль', to: ROUTES.PROFILE.BASE },
];


export const SwitchMyPlatform = () => {
    const location = useLocation();

    let currentTabs: TabItem[] | null = null;

    if (
      location.pathname === ROUTES.MAIN || 
      location.pathname.startsWith('/profile') || 
      location.pathname.startsWith('/projects/create') ||
      location.pathname.startsWith('/activity') ||
      location.pathname.startsWith('/manage') ||
      location.pathname.startsWith('/moderation')
    ) {
        currentTabs = MY_PLATFORMS_TABS;
    }

    if (!currentTabs) return null;

    return <RouterTabs items={currentTabs} />;
}