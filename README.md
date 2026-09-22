Sprint 3 – EJS y rediseño

Se migró toda la aplicación a **EJS**, organizando las vistas en subcarpetas y creando parciales 
reutilizables (`head`, `header`, `footer`, `tarjeta`). Se agregó la página **Home**, formularios de 
crear/editar productos, y se rediseñaron el **detalle de producto** (galería, tamaño, cantidad) y el 
**carrito** (resumen de pago con recálculo real). También se implementó el **login**, que ahora protege 
todas las rutas de la app.

Productos, carrito y sesión se guardan en memoria (se reinician al reiniciar el servidor).
