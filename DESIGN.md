# Sistema de diseño: control de gastos

App móvil (iOS, Android y web) para registrar y revisar gastos. Tono: claro, calmado y confiable; los números son los protagonistas.

**Fuente de verdad:** los colores viven en [`src/theme/colors.js`](src/theme/colors.js); `ThemeProvider` ([`src/theme/theme.tsx`](src/theme/theme.tsx)) los publica como variables CSS (`--color-*`) y se exponen como clases en [`tailwind.config.js`](tailwind.config.js) y la animación en [`src/theme/motion.ts`](src/theme/motion.ts). Si cambias un valor, cámbialo ahí y actualiza este documento.

## Color

El usuario elige Sistema, Claro u Oscuro en Ajustes (se guarda en el dispositivo); "Sistema" sigue el del dispositivo. Los componentes usan solo nombres semánticos (`bg-surface`, `text-muted`), nunca hex, y el cambio de tema es automático, sin variantes `dark:`.

| Token (clase) | Claro | Oscuro | Uso |
|---|---|---|---|
| `background` | `#F8FAFC` | `#0B1220` | Fondo de pantalla |
| `surface` | `#FFFFFF` | `#111A2C` | Tarjetas, hojas, inputs |
| `surface-muted` | `#F1F5F9` | `#1A2438` | Chips, filas alternas, estados deshabilitados |
| `border` | `#CBD5E1` | `#26334C` | Divisores decorativos (no portan información) |
| `outline` | `#64748B` | `#76869E` | Bordes de inputs y controles (≥ 3:1) |
| `foreground` | `#0F172A` | `#F1F5F9` | Texto principal |
| `muted` | `#475569` | `#A3B1C6` | Texto secundario |
| `primary` | `#0F766E` | `#2DD4BF` | Acción principal, foco, marca |
| `primary-foreground` | `#FFFFFF` | `#042F2E` | Texto/icono sobre `primary` |
| `success` | `#15803D` | `#4ADE80` | Ahorro, dentro del presupuesto |
| `warning` | `#B45309` | `#FBBF24` | Cerca del límite |
| `danger` | `#B91C1C` | `#F87171` | Errores, sobre presupuesto, borrar |
| `info` | `#1D4ED8` | `#60A5FA` | Avisos neutros |

Las opacidades funcionan (`bg-primary/10`) porque las variables son tripletas RGB.

### Contraste (WCAG 2.2 AA)

- Texto normal: ≥ 4.5:1. Componentes de UI e iconos con significado (`outline`): ≥ 3:1.
- `npm run check:contrast` calcula 42 pares en ambos temas y falla si alguno no cumple. Corre ese script al tocar la paleta.
- Los colores `success`, `warning`, `danger` e `info` pasan 4.5:1 sobre `background` y `surface`. **No** los uses sobre `surface-muted` ni sobre `primary`, que no se verifican.
- Nunca comuniques estado solo con color: acompáñalo con icono o texto (p. ej. "−$120" y flecha, no solo rojo).

## Tipografía

Fuente del sistema (SF Pro en iOS, Roboto en Android, system-ui en web): cero peso de carga y se ve nativa. Los importes llevan cifras tabulares (`tabular-nums`) para que las columnas alineen.

| Clase | Tamaño / interlínea | Peso | Uso |
|---|---|---|---|
| `text-display` | 40 / 44 | 800 | Total del mes |
| `text-headline` | 28 / 34 | 700 | Título de pantalla |
| `text-title` | 22 / 28 | 700 | Título de sección |
| `text-subtitle` | 18 / 26 | 600 | Importe en fila, nombre de tarjeta |
| `text-body` | 16 / 24 | 400 | Texto base (mínimo en inputs, evita zoom en iOS) |
| `text-footnote` | 13 / 18 | 400 | Notas, fechas |
| `text-caption` | 12 / 16 | 500 | Etiquetas; nunca para información crítica |

Respeta el tamaño de fuente del sistema: no pongas `allowFontScaling={false}` y deja que las filas crezcan en alto.

## Espaciado

Rejilla de 4 px (la escala por defecto de Tailwind, `p-1` = 4 px). Valores recomendados:

| Clase | px | Uso |
|---|---|---|
| `1` / `2` | 4 / 8 | Entre icono y texto, huecos pequeños |
| `3` / `4` | 12 / 16 | Padding de tarjetas y filas, margen lateral de pantalla (`px-4`) |
| `6` | 24 | Entre secciones |
| `8` | 32 | Separación grande, encabezados |

Zonas táctiles de al menos 44 × 44 pt (`min-h-11 min-w-11`) con ≥ 8 px entre objetivos. Respeta las áreas seguras con `react-native-safe-area-context`.

## Radios

| Clase | px | Uso |
|---|---|---|
| `rounded-sm` | 8 | Chips, badges pequeños |
| `rounded-md` | 12 | Botones, inputs |
| `rounded-lg` | 16 | Tarjetas |
| `rounded-xl` | 24 | Hojas inferiores (parte superior) |
| `rounded-full` | ∞ | Avatares, iconos de categoría, FAB |

## Elevación

Sin sombras pesadas: se separa con `surface` sobre `background` y `border` de 1 px. Usa sombra solo en elementos flotantes (FAB, hojas) con opacidad ≤ 0.12; en tema oscuro se prefiere borde a sombra.

## Animación (react-native-reanimated)

Constantes en `src/theme/motion.ts`. La animación aclara qué pasó; nunca es decoración.

| Qué | Cómo | Valores |
|---|---|---|
| Feedback al presionar | Escala + spring `press` | `pressScale` = 0.97, sin rebote |
| Entrada de elementos | `timing.base` (ease-out) | 240 ms, con desplazamiento ≤ 16 px y opacidad 0→1 |
| Salida | `timing.exit` (ease-in) | 160 ms; salir es más rápido que entrar |
| Cambios de estado (chip activo, switch) | `timing.fast` | 160 ms |
| Hojas y tarjetas que se acomodan | Spring `smooth` | amortiguado, sin rebote |
| Confirmación (gasto guardado) | Spring `bouncy` | un rebote leve, una sola vez |
| Lista al entrar | Escalonado | 40 ms por elemento, tope 300 ms en total |
| Cambio de importe | Fundido cruzado `timing.fast` | no cuentes dígitos animados |

Reglas:

1. **Solo `transform` y `opacity`.** No animes `width`, `height`, `margin` ni `top/left`, que fuerzan layout. Para listas que cambian de tamaño usa `layout` transitions de Reanimated.
2. **Menos de 400 ms** para cualquier transición; interacciones directas (toque) responden en < 100 ms.
3. **Reduce motion:** si `useReducedMotion()` es `true` o el sistema lo pide, sustituye desplazamientos y escalas por un fundido de ≤ 160 ms. Ninguna información debe depender de una animación.
4. **Interrumpible:** el usuario puede tocar mientras algo se anima; usa springs y no bloquees la interacción.
5. **Una cosa a la vez:** máximo un movimiento principal por pantalla; el resto, fundidos.
6. Los colores no se animan con el sistema de clases; si hace falta, anima `opacity` entre dos capas.

## Implementación

Pantallas (Expo Router, `src/app`): pestañas **Inicio**, **Historial** y **Ajustes** en `(tabs)`, y el formulario **Gasto** (nuevo/editar) como modal en `gasto.tsx`.

Componentes (`src/components`): `Button`/`PressableScale` (escala al pulsar), `Chip` (opción tipo radio), `TextField`, `DateField` + `CalendarPicker` (calendario propio, igual en web y móvil), `ExpenseRow`, `CategoryChart`, `ConfirmDialog` (capa propia, no `Alert`, que no existe en web), `MonthSwitcher`, `AddButton`.

Accesibilidad aplicada:

- Todo texto en español; botones con `accessibilityLabel` y, cuando ayuda, `accessibilityHint`.
- Encabezados con `accessibilityRole="header"`; grupos de opciones como `radiogroup` con `checked`.
- Errores de formulario como texto (no solo color) con rol `alert` y región `polite`; se borran al corregir el campo.
- Importes y fechas con etiqueta hablada ("85 pesos con 50 centavos", "27 de octubre de 2026").
- Iconos de categoría decorativos: el nombre siempre va en texto.
- Zonas táctiles ≥ 44 px; el movimiento respeta "reducir movimiento".

Trampas conocidas:

- Los componentes de `react-native-reanimated` (`Animated.View`) **no procesan `className`**: usa `style` (o envuelve con un `View` con `className`).
- Los colores de categorías viven en `src/data/categories.ts` (≥ 3:1 sobre ambas superficies, verificado por pruebas); úsalos para el icono y su fondo al 12–15 % de opacidad.
- `darkMode: "class"` en `tailwind.config.js` evita un error de NativeWind en web; no usamos variantes `dark:`.
