import {CuratorWidget} from "@/widgets/my-platform-widgets/widgets/curator-widget";
import {StudentWidget} from "@/widgets/my-platform-widgets/widgets/student-widget";
import {usePreferencesStore} from "@/entities/user";
import {assertNever} from "@/shared";

export const MyPlatformProjectsWidgets = () => {

  const preferredRoleType = usePreferencesStore(s => s.preferredRoleType)

  switch (preferredRoleType) {
    case 'Student':
      return <StudentWidget/>
    case 'Curator':
      return <CuratorWidget/>
    case 'Moderator':
    case null:
      return <></>
    default:
      return assertNever(preferredRoleType)
  }

}
