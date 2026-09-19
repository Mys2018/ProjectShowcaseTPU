import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppProvider } from "./providers";
import { ModalRoot } from "./providers/modalRoot/ModalRoot.tsx";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <ModalRoot/>
    </AppProvider>
  );
}

export default App;
