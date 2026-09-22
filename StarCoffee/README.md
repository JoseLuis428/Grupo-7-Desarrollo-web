# Star Coffee

Aplicación web de una cafetería hecha con **Node.js + Express** y el motor de templates **EJS** (Sprint 3).

## Tablero de trabajo

**Enlace al tablero:** [PEGAR AQUÍ EL ENLACE DE TU TABLERO (Trello / Jira / GitHub Projects)](https://)

## Documentación ágil

- [retro.md](./retro.md) – Retrospectiva con la dinámica de la estrella de mar
- [daily.md](./daily.md) – Seguimiento de las reuniones diarias

## Cómo ejecutarlo

Necesitas tener Node.js instalado.

```bash
npm install
npm start
```

Abre <http://localhost:3000> en el navegador.

## Estructura

```
StarCoffee/
├── app.js                  # Servidor y rutas
├── package.json
├── public/css/estilos.css  # Estilos
└── views/                  # Vistas EJS por sección
    ├── partials/           # head.ejs, header.ejs, footer.ejs, tarjeta.ejs (se reutilizan)
    ├── home/               # home.ejs
    ├── auth/               # login.ejs, registro.ejs
    ├── productos/          # lista.ejs, detalle.ejs, nuevo.ejs, editar.ejs
    └── carrito/            # carrito.ejs
```

## Qué se hizo en el Sprint 3

- Se configuró **EJS** como motor de templates.
- Todas las vistas se convirtieron a `.ejs` y se organizaron en **subcarpetas por sección**.
- Se crearon los **parciales** `head`, `header`, `footer` y `tarjeta` (tarjeta de producto) para no repetir código.
- Se creó la página **Home** (`/`) con banner, categorías, recomendados, más vendidos, promoción y nuevos productos.
- Formulario para **crear** productos (`/productos/nuevo`) y para **editar** productos (`/productos/:id/editar`).
- El contenido (productos, precios, carrito) se muestra de forma **dinámica** con EJS.

## Rediseño de Producto y Carrito

- **Detalle de producto** (`/productos/:id`): galería con imagen principal y miniaturas, pestañas
  *Descripción / Información adicional*, calificación, selector de **tamaño** (pequeño, mediano, grande),
  selector de **cantidad** y bloque de recomendaciones.
- **Carrito** (`/carrito`): diseño a dos columnas con la lista de productos a la izquierda y el
  **resumen del pago** + **cupón** a la derecha. Los botones `-` y `+` cambian la cantidad
  (se envían al servidor, así que el total se recalcula de verdad).
- Todos los estilos nuevos están en `public/css/estilos.css`, no dentro de las vistas.
- El **home** no cambió de contenido: solo se ajustó el CSS para que las tarjetas, las categorías
  y el footer queden en columnas del mismo ancho.

## Inicio de sesión

- Al abrir <http://localhost:3000> lo primero que aparece es el **login**.
- Mientras no se inicie sesión, cualquier ruta redirige a `/login` (solo `/login` y `/registro` son públicas).
- Al iniciar sesión o registrarse correctamente se entra al **Home**.
- El menú superior (Inicio, Menú, Carrito) **no aparece** en login ni registro: allí solo se ve el logo.
- `/salir` cierra la sesión y vuelve al login.
- La sesión es una variable en memoria (`sesionIniciada`), todavía no hay usuarios reales.

## Notas

- Los productos y el carrito se guardan **en memoria**: si se reinicia el servidor, vuelven a los datos iniciales.
- El login y el registro solo validan los campos; todavía no guardan usuarios.
