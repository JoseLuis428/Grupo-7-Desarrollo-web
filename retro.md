# 🌟 Retrospectiva – Sprint 3 (Dinámica de la Estrella de Mar)

| | |
|---|---|
| **Proyecto** | Star Coffee |
| **Sprint** | Sprint 3 – Implementación del motor de templates EJS |
| **Periodo del sprint** | 14 de septiembre de 2026 – 21 de septiembre de 2026 |
| **Fecha de la retrospectiva** | [DD/MM/2026] |
| **Facilitador(a)** | [Nombre] |
| **Participantes** | [Integrante 1], [Integrante 2], [Integrante 3] |

**Objetivo del sprint:** implementar EJS en la aplicación Node.js + Express para reutilizar componentes
y mostrar contenido dinámico, reorganizando las vistas y aplicando metodologías ágiles.

---

## ⭐ La estrella de mar

La dinámica de la estrella de mar organiza la retrospectiva en cinco categorías. Cada integrante aporta
ideas y luego el equipo las prioriza.

### 1. ✅ Seguir haciendo (Keep doing)
*Lo que funciona bien y debemos mantener.*

- Reunirnos brevemente cada día (daily) para detectar bloqueos temprano.
- Dividir el trabajo en tareas pequeñas en el tablero (vistas, parciales, formularios, documentación).
- Revisar el código de los compañeros antes de fusionar a la rama principal.

### 2. ➕ Hacer más (More of)
*Lo que ya hacemos y nos conviene intensificar.*

- Reutilizar componentes: los parciales `head`, `header` y `footer` evitaron duplicar código en todas las vistas.
- Probar cada formulario (crear y editar) con datos válidos e inválidos antes de entregar.
- Hacer commits pequeños y con mensajes descriptivos.

### 3. ➖ Hacer menos (Less of)
*Lo que hacemos demasiado y podemos reducir.*

- Dejar la documentación para el último día del sprint.
- Repetir el mismo CSS y HTML en cada página (ahora hay un solo `estilos.css` y parciales).
- Trabajar varias personas sobre el mismo archivo al mismo tiempo (genera conflictos de merge).

### 4. 🚀 Empezar a hacer (Start doing)
*Lo que aún no hacemos y deberíamos probar.*

- Definir una "definición de terminado" (DoD) para cada historia de usuario.
- Crear una rama por tarea y abrir *pull requests* para integrarlas.
- Guardar los productos en una base de datos en lugar de la memoria.

### 5. 🛑 Dejar de hacer (Stop doing)
*Lo que nos hace perder tiempo o que no aporta valor.*

- Dejar de trabajar con HTML estático duplicado en cada página.
- Dejar de subir cambios grandes sin avisar al resto del equipo.
- Dejar de estimar tareas sin haber revisado antes su alcance.

---

## 🎯 Acciones de mejora para el próximo sprint

| # | Acción | Categoría | Responsable | Fecha límite |
|---|--------|-----------|-------------|--------------|
| 1 | Definir y publicar la "definición de terminado" en el tablero | Empezar a hacer | [Nombre] | [DD/MM/2026] |
| 2 | Trabajar con una rama por tarea y *pull requests* | Empezar a hacer | [Nombre] | [DD/MM/2026] |
| 3 | Actualizar la documentación al cerrar cada tarea, no al final | Hacer menos / Hacer más | [Nombre] | [DD/MM/2026] |
| 4 | Agregar pruebas para las rutas de productos y carrito | Empezar a hacer | [Nombre] | [DD/MM/2026] |

## 📌 Conclusiones

- Se logró migrar todas las vistas a EJS, organizadas por sección y con parciales reutilizables.
- Los formularios de creación y edición de productos quedaron funcionales.
- Para el siguiente sprint el equipo se enfocará en mejorar la organización del trabajo (ramas, PR y DoD)
  y en completar las funcionalidades pendientes (usuarios reales y pago).
