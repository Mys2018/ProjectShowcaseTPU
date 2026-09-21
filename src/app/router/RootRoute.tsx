import { AuthBootstrapper } from "@/features/auth";
import { Outlet } from "react-router-dom";
import { useHistoryTracker } from "@/shared/model";
import { ModalRoot } from "@/app/providers/modalRoot/ModalRoot";

export const RootRoute = () => {
  useHistoryTracker();
  
  return (
    <>
      <AuthBootstrapper />
      <Outlet />
      <ModalRoot />
    </>
  );
};
