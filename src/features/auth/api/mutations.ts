import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { pkceService } from "../lib/pkce";
import { recordAuthSuccess, resetRefreshDeadCoolOff } from "@/shared";
import {
  login,
  logout,
  useAuthStore,
  type OAuthExchangeParams,
} from "@/entities/user";

export const useLogin = (): UseMutationResult<
  void,
  AxiosError,
  OAuthExchangeParams
> => {
  const setStatus = useAuthStore((state) => state.setStatus);
  const setLoggedOut = useAuthStore((state) => state.setLoggedOut);

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      recordAuthSuccess();
      resetRefreshDeadCoolOff();
      setLoggedOut(false);
      setStatus("authenticated");
      pkceService.clear();
    },
  });
};

export const useLogout = (): UseMutationResult<void, AxiosError, void> => {
  const queryClient = useQueryClient();
  const setStatus = useAuthStore((state) => state.setStatus);
  const setLoggedOut = useAuthStore((state) => state.setLoggedOut);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      setLoggedOut(true);
      setStatus("unauthenticated");
    },
  });
};
