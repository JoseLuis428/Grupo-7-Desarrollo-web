# 🌟 Retrospectiva – Sprint 5 (Dinámica de la Estrella de Mar)

| | |
|---|---|
| **Proyecto** | Star Coffee |
| **Sprint** | Sprint 5 – Middlewares + Autenticación |
| **Fecha de la retrospectiva** | [DD/MM/2026] |
| **Participantes** | [Integrante 1], [Integrante 2], [Integrante 3] |

**Objetivo del sprint:** permitir registro, login, logout y recordar al usuario, con rutas solo para huéspedes y rutas solo para usuarios con login.

---

## ⭐ La estrella de mar

### 1. 🚀 Comenzar a hacer
*Lo que aún no hacemos y deberíamos probar.*

- Pasar los datos de JSON a una base de datos real, para que el sitio escale y no dependa de leer y escribir archivos.
- Diseñar el diagrama de la base de datos antes de escribir código.
- Manejar los errores del servidor con un middleware, en lugar de dejar que una falla deje la página colgada.

### 2. ➕ Hacer más
*Lo que ya hacemos y nos conviene intensificar.*

- Probar cada ruta con casos válidos e inválidos (correo repetido, contraseña corta, archivo que no es imagen).
- Separar responsabilidades: middlewares para la sesión y controladores para la lógica de cada pantalla.
- Documentar en el README lo que se hace en cada sprint mientras se trabaja.

### 3. ✅ Continuar haciendo
*Lo que funciona bien y debemos mantener.*

- Reunirnos para dividir las tareas y revisar el tablero.
- Usar parciales y vistas organizadas por sección.
- Guardar las contraseñas cifradas y mantener las rutas protegidas con `soloUsuarios` y `soloHuespedes`.

### 4. ➖ Hacer menos
*Lo que hacemos demasiado y podemos reducir.*

- Guardar datos y sesiones en memoria o en archivos: se pierden al reiniciar o se pisan entre sí.
- Dejar la documentación para el final del sprint.
- Repetir código parecido entre controladores.

### 5. 🛑 Dejar de hacer
*Lo que nos hace perder tiempo o que no aporta valor.*

- Dejar de guardar contraseñas en texto plano en los datos de prueba.
- Dejar de depender de un archivo JSON como fuente de datos.
- Dejar de dar por terminada una tarea sin probarla en el navegador.

---

## 🎯 Acciones de mejora para el próximo sprint

| # | Acción | Categoría | Responsable | Fecha límite |
|---|--------|-----------|-------------|--------------|
| 1 | Armar el diagrama de entidad-relación antes de programar | Comenzar a hacer | [Nombre] | [DD/MM/2026] |
| 2 | Migrar usuarios y productos a una base de datos con Sequelize | Dejar de hacer | [Nombre] | [DD/MM/2026] |
| 3 | Agregar manejo de errores a las rutas | Comenzar a hacer | [Nombre] | [DD/MM/2026] |
| 4 | Actualizar el README al cerrar cada tarea | Hacer menos | [Nombre] | [DD/MM/2026] |

## 📌 Conclusiones

- Se logró el registro, el login, el logout y la opción "Recuérdame", con rutas separadas para huéspedes y para usuarios.
- El perfil permite ver y editar los datos, cambiar la contraseña y subir la foto.
- El siguiente paso natural es reemplazar los archivos JSON por una base de datos, que es el foco del Sprint 6.
