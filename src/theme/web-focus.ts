import { Platform } from "react-native";

/**
 * Anillo de foco visible para navegación con teclado en web (React Native Web lo quita).
 * Usa el color primario del tema (3:1 mínimo sobre las superficies, ver DESIGN.md).
 */
if (Platform.OS === "web" && typeof document !== "undefined" && !document.getElementById("web-focus-ring")) {
  const style = document.createElement("style");
  style.id = "web-focus-ring";
  style.textContent = `
    [tabindex]:focus-visible, a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
      outline: 3px solid rgb(var(--color-primary, 15 118 110));
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}
