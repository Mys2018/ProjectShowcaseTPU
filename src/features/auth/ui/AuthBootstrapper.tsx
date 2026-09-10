import { useAuthBootstrap } from "../lib/useAuthBootstrap";
import { useProactiveTokenRefresh } from "../lib/useProactiveTokenRefresh";

export const AuthBootstrapper = () => {
  useAuthBootstrap();
  useProactiveTokenRefresh();
  return null;
};