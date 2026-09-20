import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AppProvider } from "./providers";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
