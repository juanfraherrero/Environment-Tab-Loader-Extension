import { StrictMode } from "react";
import OptionsPage from "./options";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container as HTMLDivElement);

root.render(
  <StrictMode>
    <OptionsPage />
  </StrictMode>
);
