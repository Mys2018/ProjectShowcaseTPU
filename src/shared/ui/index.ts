export { Pagination } from './Pagination/Pagination'
export { default as SearchField } from './SearchField/SearchField'
export { LikeButton } from './like-button/LikeButton.tsx'
export { InfoTooltip } from './info-tooltip/InfoTooltip.tsx'
export { RouterTabs, type TabItem } from './router-tabs/RouterTabs.tsx'
export { StagesWidget } from './stages-widget/StagesWidget.tsx'

export { YourTasksWidget } from './small-widgets/your-tasks/YourTasksWidget.tsx'
export type { Activity } from './small-widgets/your-tasks/model/types.ts'
export { YourPointsWidget } from './small-widgets/your-points/YourPointsWidget.tsx'
export type { ClosingDiscipline } from './small-widgets/your-points/model/types.ts'
export { TextArea } from './textarea/TextArea.tsx'
export { FooterBlockFields } from './footer-block-fields/FooterBlockFields.tsx'
export { Checkbox } from './fields/checkbox'

export { ConfirmModal } from './confirm-modal/ConfirmModal.tsx'
export * from './skeleton'
export { FloatingTabs } from './floating-tabs/FloatingTabs.tsx'

export { EmptyStateBlock } from './empty-state-block/EmptyStateBlock.tsx';
export { AddOutlineButton } from './elements/add-outline-button/AddOutlineButton.tsx';

import userIconUrl from './icons/fallback_personal.svg'
import FeedbackIcon from './icons/feedback.svg?react'
import FolderIcon from './icons/folder.svg?react'
import LikeIcon from './icons/like.svg?react'
export { userIconUrl, FeedbackIcon, FolderIcon, LikeIcon }