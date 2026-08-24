import {useMe} from "@/entities/user";

export const useIsProfileFilled = () => {
  const { data } = useMe()
  const isSkillsFilled = !!(data?.meta.skills && data.meta.skills.length > 0)
  const isProfileFilled = !!(data?.meta.bio && data.meta.bio.trim() !== '' && isSkillsFilled)
  return { isProfileFilled, isSkillsFilled }
}