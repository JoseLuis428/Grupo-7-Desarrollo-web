# Star Coffee

Aplicación web de una cafetería hecha con **Node.js + Express** y el motor de templates **EJS** (Sprint 4).

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
StarCoffee_Sprint-4/
├── app.js                  # Configuración, sesión y arranque del servidor (44 líneas)
├── package.json
├── data/
│   ├── products.json       # Productos (fuente de datos)
│   └── users.json          # Usuarios (fuente de datos)
├── models/                 # Leen y escriben los JSON: productModel, userModel, estado (carrito y sesión)
├── controllers/            # Lógica de cada sección: home, products, carrito, auth
├── routes/                 # Rutas por sección (llaman a los controllers)
├── public/css/estilos.css  # Estilos
└── views/                  # Vistas EJS por sección
    ├── partials/           # head.ejs, header.ejs, footer.ejs, tarjeta.ejs (se reutilizan)
    ├── home/               # home.ejs
    ├── auth/               # login.ejs, registro.ejs
    ├── products/           # index.ejs, show.ejs, create.ejs, edit.ejs
    └── carrito/            # carrito.ejs
```

## Qué se hizo en el Sprint 4 (JSON + métodos HTTP)

- Los productos y los usuarios ahora viven en archivos **JSON** (`data/products.json` y `data/users.json`),
  no en el código. Los cambios se guardan y **no se pierden** al reiniciar el servidor.
- **Productos** (`products.json`): `id`, `name`, `description`, `image`, `category`, `sizes`, `price`
  (y `section`, que usa el Home para "recomendados" y "más vendidos").
- **Usuarios** (`users.json`): `id`, `firstName`, `lastName`, `email`, `password`, `category`.
- **CRUD de productos** con las 7 rutas (los formularios HTML solo envían GET y POST, por eso
  se usa `method-override`: `action="/products/1?_method=PUT"`):

| # | Ruta | Método | Para qué sirve |
|---|------|--------|----------------|
| 1 | `/products` | GET | Listado (acepta `?category=cafes`) |
| 2 | `/products/create` | GET | Formulario de creación |
| 3 | `/products/:id` | GET | Detalle de un producto |
| 4 | `/products` | POST | Acción de creación |
| 5 | `/products/:id/edit` | GET | Formulario de edición |
| 6 | `/products/:id` | PUT | Acción de edición |
| 7 | `/products/:id` | DELETE | Acción de borrado |

- **Registro**: guarda al usuario nuevo en `users.json` (no permite correos repetidos).
- **Login**: comprueba que el correo exista en `users.json` y que la contraseña coincida.
- Usuarios de prueba: `admin@starcoffee.com` / `admin123` y `laura@gmail.com` / `laura123`.

## Qué se hizo en el Sprint 3

- Se configuró **EJS** como motor de templates.
- Todas las vistas se convirtieron a `.ejs` y se organizaron en **subcarpetas por sección**.
- Se crearon los **parciales** `head`, `header`, `footer` y `tarjeta` (tarjeta de producto) para no repetir código.
- Se creó la página **Home** (`/`) con banner, categorías, recomendados, más vendidos, promoción y nuevos productos.
- Formulario para **crear** productos (`/products/create`) y para **editar** productos (`/products/:id/edit`).
- El contenido (productos, precios, carrito) se muestra de forma **dinámica** con EJS.

## Rediseño de Producto y Carrito

- **Detalle de producto** (`/products/:id`): galería con imagen principal y miniaturas, pestañas
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
- La sesión es una variable en memoria: si se reinicia el servidor hay que volver a iniciar sesión.

## Notas

- El **carrito** y la **sesión** se guardan en memoria: si se reinicia el servidor, se vacían.
- Las contraseñas están en texto plano en `users.json` porque todavía no se ven middlewares ni autenticación (Sprint 5).
