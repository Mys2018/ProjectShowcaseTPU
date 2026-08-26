import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared';
import { RouterTabs, type TabItem } from '@/shared/ui';

const MY_PLATFORMS_TABS: TabItem[] = [
    { label: 'Главная', to: ROUTES.MY_PLATFORM.BASE },
    // { label: 'Проектная деятельность', to: ROUTES.MY_PLATFORM.ACTIVITIES.BASE },
    { label: 'Создание проекта', to: ROUTES.MY_PLATFORM.CREATE },
    { label: 'Мой профиль', to: '/profile' },
];


export const SwitchMyPlatform = () => {
    const location = useLocation();

    let currentTabs: TabItem[] | null = null;

    if (location.pathname.startsWith('/my-platform') || location.pathname.startsWith('/profile')) {
        currentTabs = MY_PLATFORMS_TABS;
    }

    if (!currentTabs) return null;

    return <RouterTabs items={currentTabs} />;
}