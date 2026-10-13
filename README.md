# Star Coffee

Aplicación web de una cafetería hecha con **Node.js + Express** y el motor de templates **EJS** (Sprint 4).

## Tablero de trabajo

**Enlace al tablero:** [PEGAR AQUÍ EL ENLACE DE TU TABLERO (Trello / Jira / GitHub Projects)](https://)

## Documentación ágil

* [retro.md](./retro.md) – Retrospectiva con la dinámica de la estrella de mar.
* [daily.md](./daily.md) – Seguimiento de las reuniones diarias.

## Cómo ejecutarlo

Necesitas tener Node.js instalado.

```bash
npm install
npm start
```

Abre http://localhost:3000 en el navegador.

## Estructura

```text
StarCoffee_Sprint-4/
├── app.js                  # Configuración, sesión y arranque del servidor
├── package.json
├── data/
│   ├── products.json       # Productos (fuente de datos)
│   └── users.json          # Usuarios (fuente de datos)
├── models/                 # Modelos de productos, usuarios, carrito y sesión
├── controllers/            # Lógica de home, productos, carrito y autenticación
├── routes/                 # Rutas por sección
├── public/css/estilos.css  # Estilos
└── views/                  # Vistas EJS por sección
    ├── partials/           # head.ejs, header.ejs, footer.ejs y tarjeta.ejs
    ├── home/               # home.ejs
    ├── auth/               # login.ejs y registro.ejs
    ├── products/           # index.ejs, show.ejs, create.ejs y edit.ejs
    └── carrito/            # carrito.ejs
```

## Qué se hizo en el Sprint 4 (JSON + métodos HTTP)

* Los productos y los usuarios ahora viven en archivos JSON (`data/products.json` y `data/users.json`), no en el código. Los cambios se guardan y no se pierden al reiniciar el servidor.
* **Productos** (`products.json`): `id`, `name`, `description`, `image`, `category`, `sizes` y `price`. También se utiliza `section` para los recomendados y más vendidos del Home.
* **Usuarios** (`users.json`): `id`, `firstName`, `lastName`, `email`, `password` y `category`.
* **CRUD de productos** con las 7 rutas. Los formularios HTML solo envían GET y POST, por eso se usa `method-override`.

| # | Ruta                 | Método | Para qué sirve                                  |
| - | -------------------- | ------ | ----------------------------------------------- |
| 1 | `/products`          | GET    | Listado de productos (acepta `?category=cafes`) |
| 2 | `/products/create`   | GET    | Formulario de creación                          |
| 3 | `/products/:id`      | GET    | Detalle de un producto                          |
| 4 | `/products`          | POST   | Acción de creación                              |
| 5 | `/products/:id/edit` | GET    | Formulario de edición                           |
| 6 | `/products/:id`      | PUT    | Acción de edición                               |
| 7 | `/products/:id`      | DELETE | Acción de borrado                               |

* **Registro:** guarda al usuario nuevo en `users.json` y no permite correos repetidos.
* **Login:** comprueba que el correo exista en `users.json` y que la contraseña coincida.
* **Usuarios de prueba:** `admin@starcoffee.com` / `admin123` y `laura@gmail.com` / `laura123`.

## Qué se hizo en el Sprint 3

* Se configuró **EJS** como motor de templates.
* Todas las vistas se convirtieron a `.ejs` y se organizaron en subcarpetas por sección.
* Se crearon los parciales `head`, `header`, `footer` y `tarjeta` para no repetir código.
* Se creó la página **Home** (`/`) con banner, categorías, recomendados, más vendidos, promoción y nuevos productos.
* Se crearon formularios para crear productos (`/products/create`) y editarlos (`/products/:id/edit`).
* El contenido (productos, precios y carrito) se muestra de forma dinámica con EJS.

## Rediseño de Producto y Carrito

* **Detalle de producto** (`/products/:id`): galería con imagen principal y miniaturas, pestañas de descripción e información adicional, calificación, selector de tamaño (pequeño, mediano y grande), selector de cantidad y bloque de recomendaciones.
* **Carrito** (`/carrito`): diseño a dos columnas con la lista de productos a la izquierda y el resumen del pago y cupón a la derecha. Los botones `-` y `+` cambian la cantidad; los cambios se envían al servidor y el total se recalcula.
* Todos los estilos nuevos están en `public/css/estilos.css`, no dentro de las vistas.
* El Home no cambió de contenido: solo se ajustó el CSS para que las tarjetas, las categorías y el footer queden en columnas del mismo ancho.

## Inicio de sesión

* Al abrir http://localhost:3000, lo primero que aparece es el **login**.
* Mientras no se inicie sesión, cualquier ruta redirige a `/login`; solo `/login` y `/registro` son públicas.
* Al iniciar sesión o registrarse correctamente, se entra al Home.
* El menú superior (Inicio, Menú y Carrito) no aparece en login ni registro; allí solo se ve el logo.
* `/salir` cierra la sesión y vuelve al login.
* La sesión es una variable en memoria: si se reinicia el servidor, hay que volver a iniciar sesión.

## Notas

* El carrito y la sesión se guardan en memoria: si se reinicia el servidor, se vacían.
* Las contraseñas están en texto plano en `users.json` porque todavía no se ven middlewares ni autenticación (Sprint 5).
