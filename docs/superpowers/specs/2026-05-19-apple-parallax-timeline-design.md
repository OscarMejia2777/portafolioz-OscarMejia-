# Design Spec: Web Presentation Fluida (Estilo Apple Timelapse)

**Fecha:** 2026-05-19
**Estado:** En revisión técnica

## 1. Objetivo

Crear una experiencia de navegación "scrollytelling" continua en todo el sitio web (excepto en la sección de contacto). El sitio debe sentirse como una presentación fluida donde una línea de tiempo vertical (sin fechas) guía al usuario a través de diferentes hitos o secciones, similar a la narrativa visual de Apple.

## 2. Experiencia de Usuario (UX)

- **Navegación Narrativa:** El usuario no solo hace scroll, sino que siente que está recorriendo un "timelapse".
- **Foco Seccional:** Cada hito de la línea de tiempo presenta una sección del contenido.
- **Claridad Funcional:** La sección de Contacto se mantendrá con un diseño estático y limpio para facilitar la interacción del usuario.

## 3. Diseño Visual

- **Look & Feel:** Estilo Apple Premium (Dark Mode, Glassmorphism, tipografía refinada).
- **Línea de Vida (Organic Path):** Una línea que no es estática; fluye de un lado a otro de la pantalla "como si estuviera viva", guiando el ojo del usuario hacia los bloques de contenido que alternan de posición.
- **Transiciones:** Cada sección entra con un efecto de revelado elástico (spring physics). No se usan fechas, solo títulos y contenido que fluyen en una narrativa continua.
- **Destino:** La línea recorre todo el sitio y termina en la sección de Contacto, marcando el fin de la presentación fluida.

## 4. Arquitectura Técnica

- **Framework:** React + Vite.
- **Animación:** `framer-motion` para el seguimiento del scroll (`useScroll`, `useTransform`) y para generar el trazado orgánico de la línea (SVG paths animados).
- **Estilos:** `Tailwind CSS v4` para la base de estilos y efectos de cristal (backdrop-filter).
- **Estructura:**
  - `ScrollLayout`: Wrapper principal que gestiona el SVG de la línea orgánica y el progreso.
  - `TimelineStep`: Cada hito de la presentación (Hero, Proyectos, Skills, etc.).
  - `ContactFinal`: El hito final donde termina la línea y se presenta el formulario.

## 5. Plan de Verificación

- **Performance:** Asegurar 60fps constantes durante el scroll, optimizando el renderizado del SVG interactivo.
- **Responsividad:** En móviles, la línea se simplifica a un lateral para no obstruir el texto en pantallas pequeñas.
- **Accesibilidad:** Mantener el orden semántico del DOM.

## 6. Preguntas Abiertas

- (Cerrado) Trayectoria de la línea: Flujo orgánico zig-zag "viva".
- (Cerrado) Contacto: Destino final del viaje.
