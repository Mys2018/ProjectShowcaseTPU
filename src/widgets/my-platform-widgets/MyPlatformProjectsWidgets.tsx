import {CuratorWidget} from "./widgets/curator-widget/CuratorWidget.tsx";
import {usePreferencesStore} from "@/entities/user";

export const MyPlatformProjectsWidgets = () => {

  const { preferredRoleType } = usePreferencesStore()

  switch (preferredRoleType) {
    case 'Student':
      return <></>
    case 'Curator':
      return <CuratorWidget/>
    case 'Moderator':
      return <></>
    default:
      return <></>
  }

}
