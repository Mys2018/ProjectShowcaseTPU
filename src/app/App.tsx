import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppProvider } from "./providers";
import { ModalRoot } from "@/app/providers/modalRoot/ModalRoot.tsx";
import { TestMenu } from "@/features/test-menu";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <ModalRoot/>
      <TestMenu />
    </AppProvider>
  );
}

export default App;
