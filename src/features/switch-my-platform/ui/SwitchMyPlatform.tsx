import { ROUTES } from '@/shared';
import { RouterTabs, type TabItem } from '@/shared/ui';

const MY_PLATFORMS_TABS: TabItem[] = [
    { label: 'Главная', to: ROUTES.MY_PLATFORM.BASE },
    // { label: 'Проектная деятельность', to: ROUTES.MY_PLATFORM.ACTIVITIES },
    // { label: 'Научная деятельность', to: '/my-platform/scientific-activities' },
    // { label: 'Аналитика', to: '/my-platform/analytics' },
    // { label: 'Управление проектами', to: '/my-platform/project-management' },
    { label: 'Создание проекта', to: ROUTES.MY_PLATFORM.CREATE },
    // { label: 'Управление рекламой', to: '/my-platform/ad-management' },
    { label: 'Мой профиль', to: '/profile' },
    // { label: 'Создание проекта', to: '/my-platform/profile' },
    // { label: 'Уведомления', to: '/my-platform/notifications' },
    // { label: 'Магазин', to: '/my-platform/store' },
    // { label: 'Настройки', to: '/my-platform/settings' },
];

export const SwitchMyPlatform = () => {
    return <RouterTabs items={MY_PLATFORMS_TABS} />;
}