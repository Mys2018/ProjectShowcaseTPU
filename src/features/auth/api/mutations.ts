import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import type { AxiosError } from "axios";
import { pkceService } from "../lib/pkce";
import { recordAuthSuccess, rejectAuthQueue, resetRefreshDeadCoolOff } from "@/shared";

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
  const queryClient = useQueryClient();
  const setStatus = useAuthStore((state) => state.setStatus);
  const setLoggedOut = useAuthStore((state) => state.setLoggedOut);

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Граница идентичности: после login-обмена в куках может быть другой
      // пользователь (общий компьютер, повторный вход). Кэш прошлого
      // пользователя нельзя уносить в новую сессию — особенно с
      // staleTime: Infinity у useMe/useUserById, который сам не рефетчится.
      queryClient.clear();
      rejectAuthQueue();
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
      rejectAuthQueue();
      setLoggedOut(true);
      setStatus("unauthenticated");
    },
  });
};
