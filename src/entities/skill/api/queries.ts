import { useQuery } from "@tanstack/react-query";
import { getSkills } from "./requests";
import { queryKeys } from "./queryKeys";

export const useSkills = () => {
	return useQuery({
    queryKey: queryKeys.all,
    queryFn: getSkills,
    staleTime: 6000
  })
}
