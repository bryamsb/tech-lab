# Modulos — trabajo en curso

Detalle de archivos a crear, mover o editar por modulo.

Diagrama interactivo con links a cada carpeta: [bryamsb.github.io/tech-lab](https://bryamsb.github.io/tech-lab)

## Arbol actual de components/

<!-- TREE:START -->
_Actualizado: 2026-04-26 23:44 UTC_

```
src/components/
├── AirQualityViewer.tsx
├── AuthAwareLink.tsx
├── AuthGate.tsx
├── BlockchainViewer.tsx
├── DevicesAdminPage.tsx
├── EditResearcherModal.tsx
├── Footer.tsx
├── Header.tsx
├── LoRaSensorViewer.tsx
├── LoansCalendar.tsx
├── Modal.tsx
├── Model3DViewer.tsx
├── PeopleCounterViewer.tsx
├── ProfileDropdown.tsx
├── ProjectDeviceExperience.tsx
├── ProjectModals.tsx
├── ProtectedRoute.tsx
├── RelatedTechnologies.tsx
├── ResearcherModals.tsx
├── ResearcherProfileModal.tsx
├── SearchBar.tsx
├── SmartParkingViewer.tsx
├── TechLabPlatformViewer.tsx
├── ThemeToggle.tsx
├── achievements/
│   └── test.tsx
├── index.ts
├── profile/
│   └── test2.tsx
├── projects/
│   └── test3.tsx
├── publications/
│   └── test4.jsx
├── researchers/
│   └── test5.tsx
└── shared/
    └── test6.tsx
```
<!-- TREE:END -->

## Notacion

| Simbolo | Significado |
|---------|-------------|
| `+` | Archivo nuevo — se crea desde cero |
| `*` | Archivo existente que se edita |
| `~` | Archivo existente que se mueve a esta carpeta |

---

## Modulo 1 — Perfil `components/profile/`

| Archivo | Estado | Descripcion |
|---------|--------|-------------|
| `EditProfileModal.tsx` | * edita | quitar funcion de cambios realizados al modificar informacion dentro de modal |
| `EditProfileModal.tsx` | * edita | adaptar colores del boton guardar segun el theme dark o light mode de la página |
| `EditProfileModal.tsx` | * edita | quitar scroll vertical en el light-mode, solo funcionando en dark mode |
| `ProfilePage.tsx` | + nuevo | Pagina completa: ver, editar y guardar informacion (general, academico, universidad) |
| `researchers/[id]/page.tsx` | ~ mueve | Integrar boton de edicion cuando el usuario es dueno del perfil |

Acceso: editable solo por el propio usuario y por admin.

---

## Modulo 2 — Investigadores `components/researchers/`

| Archivo | Estado | Descripcion |
|---------|--------|-------------|
| `EditResearcherModal.tsx` | ~ mueve + edita | Ampliar campos (academico, universidad, logros, publicaciones) |
| `ResearcherModals.tsx` | ~ mueve | Sin cambios adicionales |
| `ResearcherProfileModal.tsx` | ~ mueve | Sin cambios adicionales |
| `CreateMemberModal.tsx` | + nuevo | Modal para que admin cree un nuevo miembro |
| `DeleteResearcherConfirm.tsx` | + nuevo | Confirmacion antes de eliminar investigador |
| `AssignProjectModal.tsx` | + nuevo | Asignar investigador a proyecto y viceversa |
| `researchers/page.tsx` | ~ mueve | Integrar modales de crear y eliminar |
| `researchers/[id]/page.tsx` | ~ mueve | Integrar asignacion y edicion ampliada |

Acceso: gestion exclusiva para admin, visualizacion para todos.

---

## Modulo 3 — Proyectos `components/projects/`

| Archivo | Estado | Descripcion |
|---------|--------|-------------|
| `ProjectModals.tsx` | ~ mueve | Sin cambios adicionales |
| `ProjectDetailPage.tsx` | + nuevo | Vista de detalle de un proyecto |
| `DeleteProjectConfirm.tsx` | + nuevo | Confirmacion antes de eliminar proyecto |

Acceso: gestion para admin, visualizacion para todos.

---

## Modulo 4 — Publicaciones `components/publications/`

| Archivo | Estado | Descripcion |
|---------|--------|-------------|
| `PublicationsManager.tsx` | + nuevo | Lista, crear, editar y eliminar publicaciones (con confirmacion) |
| `app/publications/page.tsx` | + nuevo | Ruta independiente |
| `researchers/[id]/page.tsx` | * edita | Mostrar `PublicationsManager` dentro del perfil completo |

Acceso: editable por usuario y admin.

---

## Modulo 5 — Logros `components/achievements/`

| Archivo | Estado | Descripcion |
|---------|--------|-------------|
| `AchievementsManager.tsx` | + nuevo | Lista, crear, editar y eliminar logros (con confirmacion) |
| `app/achievements/page.tsx` | + nuevo | Ruta independiente |
| `researchers/[id]/page.tsx` | * edita | Mostrar `AchievementsManager` dentro del perfil completo |

Acceso: editable por usuario y admin.

---

## Modulo 6 — UI Global / Shared `components/shared/`

| Archivo | Estado | Descripcion |
|---------|--------|-------------|
| `Modal.tsx` | ~ mueve + edita | Fix: quitar scroll, unificar colores, light mode |
| `Header.tsx` | ~ mueve | Sin cambios |
| `Footer.tsx` | ~ mueve | Sin cambios |

> Este modulo es transversal — cualquier cambio en `Modal.tsx` afecta a toda la app. Actualizar imports en todos los modulos que lo usen.
