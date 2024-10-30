import { StrictMode } from "react";
import OptionsPage from "./options";
import { createRoot } from "react-dom/client";
import "../i18n";
import Footer from "@/Footer/Footer";
import { ThemeProvider } from "@/components/theme-provider";
const container = document.getElementById("root");
const root = createRoot(container as HTMLDivElement);

root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <OptionsPage />
      <Footer />
    </ThemeProvider>
  </StrictMode>
);
