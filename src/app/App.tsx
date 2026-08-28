import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppProvider } from "./providers";
import {ModalRoot} from "@/app/providers/modalRoot/ModalRoot.tsx";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <ModalRoot/>
      {/* TestMenu убран по просьбе команды: перекрывал плавающую панель и дёргал боевой API.
          Вернуть — <TestMenu/> из @/features/test-menu */}
    </AppProvider>
  );
}

export default App;
