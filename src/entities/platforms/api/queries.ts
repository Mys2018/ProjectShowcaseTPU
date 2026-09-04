import {useQuery} from "@tanstack/react-query";
import {getPlatforms} from "./requests.ts";
import {platformsKeys} from "./queryKeys.ts";

export const usePlatforms = () => {
  return useQuery({
    queryFn: getPlatforms,
    queryKey: platformsKeys.all,
    staleTime: 60 * 1000
  })
}