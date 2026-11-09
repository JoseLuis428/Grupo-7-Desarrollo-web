# 🌟 Retrospectiva – Sprint 6 (Dinámica de la Estrella de Mar)

| | |
|---|---|
| **Proyecto** | Star Coffee |
| **Sprint** | Sprint 6 – Bases de datos + Sequelize |
| **Fecha de la retrospectiva** | [DD/MM/2026] |
| **Participantes** | [Integrante 1], [Integrante 2], [Integrante 3] |

**Objetivo del sprint:** pasar los usuarios y los productos de archivos JSON a una base de datos MySQL manejada con Sequelize, con su diagrama, sus scripts SQL y el CRUD funcionando.

---

## ⭐ La estrella de mar

### 1. 🚀 Comenzar a hacer
*Lo que aún no hacemos y deberíamos probar.*

- Validar los datos de los formularios en el back-end antes de guardarlos: hoy casi solo se revisa que los campos no estén vacíos.
- Validar también en el front-end para avisarle al usuario al instante qué corregir.
- Agregar a la base de datos restricciones más estrictas (largos mínimos, precios mayores a 0) como última defensa.

### 2. ➕ Hacer más
*Lo que ya hacemos y nos conviene intensificar.*

- Probar el CRUD con datos inválidos (nombre vacío, precio negativo, correo repetido, archivo que no es imagen).
- Revisar entre todos los cambios de modelos y de SQL antes de integrarlos.
- Mantener el diagrama de la base de datos como referencia cada vez que se toque una tabla.

### 3. ✅ Continuar haciendo
*Lo que funciona bien y debemos mantener.*

- Diseñar el diagrama entidad-relación antes de programar (`database/diagrama-der.pdf`).
- Mantener los scripts `structure.sql` y `data.sql` para armar la base en pocos minutos en cualquier computador.
- Usar el middleware `asincrono` y el manejador de errores de `app.js` para que una falla no deje la página colgada.
- Documentar en el README lo que se hace en cada sprint.

### 4. ➖ Hacer menos
*Lo que hacemos demasiado y podemos reducir.*

- Crear categorías y tamaños automáticamente a partir de lo que llega del formulario, sin controlar qué se está enviando.
- Repetir revisiones parecidas dentro de cada controlador.
- Guardar el carrito y la sesión en memoria: se pierden al reiniciar el servidor.

### 5. 🛑 Dejar de hacer
*Lo que nos hace perder tiempo o que no aporta valor.*

- Dejar de asumir que el usuario siempre llena bien los formularios.
- Dejar de dar por terminada una tarea sin probarla contra la base de datos real.
- Dejar la documentación y la retro para el último día del sprint.

---

## 🎯 Acciones de mejora para el próximo sprint

| # | Acción | Categoría | Responsable | Fecha límite |
|---|--------|-----------|-------------|--------------|
| 1 | Validar los formularios en el back-end con Express Validator | Comenzar a hacer | [Nombre] | [DD/MM/2026] |
| 2 | Validar los formularios en el front-end con validaciones propias | Comenzar a hacer | [Nombre] | [DD/MM/2026] |
| 3 | Agregar restricciones (CHECK) a `structure.sql` y validaciones en los modelos | Comenzar a hacer | [Nombre] | [DD/MM/2026] |
| 4 | Verificar que categoría y tamaños existan en la base antes de guardar un producto | Hacer menos | [Nombre] | [DD/MM/2026] |

## 📌 Conclusiones

- Los usuarios y los productos ya viven en MySQL, con diagrama, estructura, datos de prueba y CRUD con Sequelize.
- La base de datos protege la estructura, pero todavía aceptaba datos sin sentido que llegaban desde los formularios.
- El siguiente paso natural es validar en el back-end y en el front-end, que es el foco del Sprint 7.
