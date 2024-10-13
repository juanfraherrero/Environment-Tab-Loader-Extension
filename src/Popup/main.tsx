import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PopupPage from "./popup";

const container = document.getElementById("root");
const root = createRoot(container as HTMLDivElement);

root.render(
  <StrictMode>
    <PopupPage />
  </StrictMode>
);