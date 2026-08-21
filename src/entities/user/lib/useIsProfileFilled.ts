import {useMe} from "@/entities/user";

export const useIsProfileFilled = () => {
  const { data } = useMe()
  const isProfileFilled = data?.meta.bio && data.meta.skills
  return { isProfileFilled }
}