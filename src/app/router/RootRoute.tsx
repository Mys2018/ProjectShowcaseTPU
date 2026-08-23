import { AuthBootstrapper } from "@/features/auth";
import { Outlet } from "react-router-dom";
import { useHistoryTracker } from "@/shared/model";

export const RootRoute = () => {
  useHistoryTracker();
  
  return (
    <>
      <AuthBootstrapper />
      <Outlet />
    </>
  );
};
