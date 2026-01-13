# Product Requirements Document (PRD)

## Product Name

**Celestial Orrery Clock**

## 1. Product Vision & Purpose

The Celestial Orrery Clock is a web-based, immersive 3D time visualization that represents time through the orbital mechanics of a miniature cosmic system. Instead of conventional clock hands or digits, time is expressed via the angular positions and rotations of planets orbiting a central star. The product combines functional timekeeping with cinematic, high-fidelity WebGL visuals to create a contemplative and engaging user experience.

The primary goal is to transform an abstract concept (time) into an intuitive spatial metaphor (orbital motion), while maintaining accurate real-time synchronization with the user’s local system clock.

---

## 2. Target Users

* Designers and developers seeking visual inspiration
* Tech enthusiasts interested in experimental time representations
* Users who appreciate ambient, visually rich web experiences

---

## 3. Core Functional Requirements

### 3.1 Time-to-Orbit Engine

The system shall continuously fetch the user’s local system time and map it to orbital positions in a 360° coordinate system.

**Planetary Time Mapping:**

* **Seconds Planet**

  * Completes one full orbit every 60 seconds.
* **Minutes Planet**

  * Completes one full orbit every 60 minutes.
* **Hours Planet**

  * Completes one full orbit every 12 or 24 hours.
  * Orbit mode must be user-selectable (12h / 24h).

**Self-Rotation:**

* Each planet must rotate on its own axis independently of its orbital motion.
* Rotation speed should be constant but configurable for future extensions (e.g., time-lapse mode).

**Time Accuracy Constraints:**

* Time updates must occur at least once per second.
* Visual interpolation should ensure smooth motion without visible jumps between updates.

---

### 3.2 Mathematical Orbit Logic

Planet positions in 3D space are calculated using polar-to-Cartesian conversion.

For each planet:

$$x = r \times \cos(\theta)$$
$$z = r \times \sin(\theta)$$

Where:

* $r$ = orbital radius (constant per planet)
* $\theta$ = angular position in radians

**Angle Calculations:**

* **Seconds Angle:**
  $$\theta_s = \frac{seconds}{60} \times 2\pi$$
* **Minutes Angle:**
  $$\theta_m = \frac{minutes + seconds / 60}{60} \times 2\pi$$
* **Hours Angle:**
  $$\theta_h = \frac{hours + minutes / 60}{12 \text{ or } 24} \times 2\pi$$

---

### 3.3 Dynamic Environmental Shaders

The scene environment must react to the user’s local time to simulate a cosmic day–night cycle.

**Morning / Day:**

* Brighter ambient light levels
* Warm nebula tones (pinks, oranges, light purples)
* Reduced star density

**Evening / Night:**

* Lower ambient light levels
* Cool, dark tones (deep blues, blacks)
* Increased star density and contrast

Shader transitions must be gradual and time-based, avoiding abrupt visual changes.

---

### 3.4 User Interactivity

**Camera Controls:**

* Users can freely rotate the camera using drag gestures.
* Zoom in/out supported via scroll or pinch.
* Implemented using Three.js OrbitControls.

**Planet Focus Mode:**

* A HUD element lists available planets (Seconds, Minutes, Hours).
* Selecting a planet triggers a smooth camera transition that follows the chosen planet.
* Transitions must be animated using GSAP for easing and continuity.

---

## 4. Visual & UI Requirements

### 4.1 Central Star ("Sun")

* Acts as the primary light source using a PointLight.
* Includes a bloom post-processing effect to create a cinematic glow.
* Uses a custom shader to simulate dynamic solar surface movement ("sun-fire").

---

### 4.2 Glassmorphic HUD

A futuristic, semi-transparent overlay designed using Tailwind CSS.

**HUD Elements:**

* Digital time display (HH:MM:SS format)
* Day/Night cycle toggle (manual override)
* Settings control for animation speed (normal vs time-lapse)

**Design Constraints:**

* Glassmorphic styling (blur, translucency, subtle borders)
* Must not obstruct the main orbital visualization

---

### 4.3 Planet Textures

* Planets must use high-resolution texture maps:

  * Diffuse (color)
  * Bump or Normal maps (surface detail)
  * Specular maps (light reflection)
* Textures should convey realism and depth, avoiding flat or unlit appearances.

---

## 5. Technical Stack & Architecture

| Component | Technology                   | Responsibility                              |
| --------- | ---------------------------- | ------------------------------------------- |
| Framework | Next.js                      | Application structure, routing, performance |
| 3D Engine | Three.js / React Three Fiber | WebGL scene management, geometry, lighting  |
| Animation | GSAP                         | Camera transitions, UI animations           |
| Styling   | Tailwind CSS                 | HUD and overlay design                      |
| Shaders   | GLSL                         | Sun, nebula, and environmental effects      |

---

## 6. Performance & Quality Requirements

* Must maintain 60 FPS on modern desktop browsers.
* Graceful degradation for lower-end devices (reduced effects).
* WebGL context loss must be handled without crashing the application.

---

## 7. Development Milestones

### Phase 1 – The Void

* Initialize Next.js project
* Render a black WebGL canvas
* Add a procedural starfield background

### Phase 2 – The Star

* Create the central Sun mesh
* Add PointLight and basic bloom effect

### Phase 3 – The Orrery

* Implement planet components
* Apply orbital mathematics and real-time synchronization

### Phase 4 – The Interface

* Build the glassmorphic HUD using Tailwind CSS
* Integrate GSAP camera transitions and focus logic

### Phase 5 – The Polish

* Add post-processing (Bloom, color correction)
* Fine-tune shaders, lighting, and animation timing

---

## 8. Success Criteria

* Accurate real-time mapping between system time and orbital positions
* Smooth, visually coherent animations without jitter
* Intuitive user interaction and camera control
* A distinctive, cinematic aesthetic that differentiates the product from conventional clocks
