# 🧉 Truco Criollo Argentino - Escuela Interactiva & Partida vs PC

Una aplicación web completa, moderna y didáctica para aprender a jugar al **Truco Argentino tradicional** desde cero y luego poner a prueba tus habilidades jugando partidas contra la computadora con asistencia en vivo.

---

## 🌟 Características Principales

### 1. 🎓 Escuela Interactiva de Truco (Tutorial Paso a Paso)
- **Módulo 1: Baraja y Jerarquía de Cartas**:
  - Las 40 cartas españolas (Espadas, Bastos, Oros, Copas).
  - Las 4 cartas bravas: Ancho de Espada (#1), Ancho de Basto (#2), 7 Bravo (#3) y 7 de Oro (#4).
  - Identificación de cartas falsas (Ases falsos y 7 falsos) vs cartas verdaderas.
  - Cuestionarios interactivos: desafío de mano a mano ("¿Qué carta gana?").
- **Módulo 2: El Envido y el Tanteo**:
  - Regla de las dos cartas del mismo palo (+20).
  - Regla de las figuras (10, 11 y 12 valen 0).
  - Escala de cantos: Envido, Real Envido, Falta Envido.
  - Regla de oro: desempate por ser MANO.
  - Desafío interactivo de cálculo de tantos.
- **Módulo 3: Desarrollo de la Mano y Ley de Pardas**:
  - Las 3 rondas (primera, segunda y tercera mano).
  - ¿Qué ocurre en caso de empate (parda) en 1ra, 2da o 3ra?
  - El principio de "Primera gana".
  - Desafío interactivo de resolución de escenarios.
- **Módulo 4: El Canto del Truco y la Mentira**:
  - Truco (2 pts), Re-truco (3 pts), Vale Cuatro (4 pts).
  - El "No quiero" y cuántos puntos otorga.
  - Cuándo mentir ("bluff") y cuándo "Irse al mazo" para no regalar puntos.
- **Módulo 5: La Flor (Regla Tradicional)**:
  - 3 cartas del mismo palo (3 puntos).
  - Cómo anula el envido y se canta en primera mano.
- **📜 Diccionario Truquero Criollo**:
  - Glosario de términos populares: *Mano, Pie, Parda, Empardar, Irse al mazo, Malas y Buenas, Cartas bravas, Matar, Tantos*.

---

### 2. ⚔️ Partida Libre contra la PC
- **3 Niveles de Inteligencia Artificial**:
  - **👦 El Gauchito Aprendiz (Fácil)**: Juega transparente, sin dobleces, no suele mentir.
  - **🤠 Don Facundo (Medio - Gaucho Criollo)**: Mata justo con la carta que alcanza, canta envido si es mano, responde con picardía y dichos criollos.
  - **🦊 El Zorro de las Pampas (Difícil - Estratégico)**: Cuenta cartas del mazo, aprovecha ventajas de posición, detecta debilidad y miente tácticamente.
- **Tanteador Tradicional con Fósforos / Porotos**:
  - Visualización auténtica de fósforos agrupados de a 5 (cuadrado con diagonal).
  - División de **A las Malas** (1-15) y **A las Buenas** (16-30).
  - Indicador dinámico de **MANO ✋**.
- **Opciones Configurables**:
  - Partidas a **15 puntos** (chico rápido) o a **30 puntos** (partida completa tradicional).
  - Modo **Con Flor** o **Sin Flor**.
  - Efectos de sonido sintetizados en tiempo real con Web Audio API (golpe de mesa al cantar truco, fósforos en tanteador, fanfarria de triunfo, etc.).

---

### 3. 🤠 Mentor en Vivo ("Don Facundo - Tu Asesor Criollo")
- Durante cualquier partida contra la computadora, el mentor te acompaña con un panel interactivo:
  - Calcula automáticamente tus tantos de envido.
  - Te indica la jerarquía y fuerza de tus cartas.
  - Te da sugerencias tácticas en tiempo real: cuándo cantar Envido, cuándo matar una carta o guardar la brava, y cuándo decir "Quiero" o "No quiero".
  - Podés minimizarlo o desactivarlo cuando ya sientas que dominás el juego.

---

### 4. 👑 Modal de Jerarquía Rápida
- Acceso con un clic en cualquier momento a la pirámide completa de los 14 escalones de cartas de Truco Argentino.

---

## 🚀 Cómo Ejecutar el Proyecto

1. Abrir una terminal en el directorio del proyecto:
   ```bash
   cd "c:\Desarrollos Propios\Juego Truco Argentino"
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir en tu navegador:
   👉 **http://localhost:5173**

Para compilar la versión optimizada de producción:
```bash
npm run build
```
