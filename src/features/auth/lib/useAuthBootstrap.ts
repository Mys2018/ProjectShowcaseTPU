import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../api/mutations";
import { pkceService } from "./pkce";
import {
  getSwitchableRoles,
  useAuthStatus,
  useAuthStore,
  useMe,
  usePreferencesStore,
  type OAuthExchangeParams,
} from "@/entities/user";
import { ROUTES } from "@/shared";

export const useAuthBootstrap = () => {
  const navigate = useNavigate();
  const status = useAuthStore((state) => state.status);
  const isLoggedOut = useAuthStore((state) => state.isLoggedOut);
  const setStatus = useAuthStore((state) => state.setStatus);
  const {data: userData} = useMe(status === 'authenticated')
  const setPreferredRoleType = usePreferencesStore((state) => state.setPreferredRoleType);
  const loginMutation = useLogin();
  const callbackHandledRef = useRef(false);
  const [callbackParams, setCallbackParams] =
    useState<OAuthExchangeParams | null>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const hasOAuthCallback =
    searchParams.has("code") && searchParams.has("state");

  useEffect(() => {
    if (userData?.roles) {
      const preferredRole = getSwitchableRoles(userData.roles).at(0)
      if (preferredRole) setPreferredRoleType(preferredRole.type)
    }
  }, [userData, setPreferredRoleType])

  useEffect(() => {
    if (!hasOAuthCallback) {
      return;
    }

    const parsedCallback = pkceService.parseCallback(window.location.search);
    if (!parsedCallback) {
      pkceService.clear();
      setStatus("unauthenticated");
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    setCallbackParams(parsedCallback);
  }, [hasOAuthCallback, setStatus]);

  const shouldCheckSession =
    !isLoggedOut &&
    !hasOAuthCallback &&
    (status === "idle" || status === "loading");
  const authStatusQuery = useAuthStatus(shouldCheckSession);

  useEffect(() => {
    if (status === "idle" && shouldCheckSession) {
      setStatus("loading");
    }
  }, [setStatus, shouldCheckSession, status]);

  useEffect(() => {
    if (!shouldCheckSession) {
      return;
    }

    if (authStatusQuery.isSuccess) {
      setStatus("authenticated");
      return;
    }

    if (authStatusQuery.isError) {
      setStatus("unauthenticated");
    }
  }, [
    authStatusQuery.isError,
    authStatusQuery.isSuccess,
    setStatus,
    shouldCheckSession,
  ]);

  useEffect(() => {
    if (!callbackParams || callbackHandledRef.current) {
      return;
    }

    callbackHandledRef.current = true;
    setStatus("loading");

    loginMutation.mutate(callbackParams, {
      onSuccess: () => {
        navigate(ROUTES.MAIN, { replace: true });
      },
      onError: () => {
        setStatus("unauthenticated");
        navigate(ROUTES.LOGIN, { replace: true });
      },
    });
  }, [callbackParams, loginMutation, navigate, setStatus]);
};
