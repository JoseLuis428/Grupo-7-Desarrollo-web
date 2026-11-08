# Star Coffee

Aplicación web de una cafetería hecha con **Node.js + Express** y el motor de templates **EJS** (Sprint 4 a 6).

## Tablero de trabajo

**Enlace al tablero:** [PEGAR AQUÍ EL ENLACE DE TU TABLERO (Trello / Jira / GitHub Projects)](https://)

## Documentación ágil

* [retro.md](./retro.md) – Retrospectiva con la dinámica de la estrella de mar.
* [daily.md](./daily.md) – Seguimiento de las reuniones diarias.

## Cómo ejecutarlo

Necesitas tener Node.js y MySQL instalados.

```bash
npm install
mysql -u root -p < database/structure.sql
mysql -u root -p < database/data.sql
npm start
```

La conexión se configura en `database/config/config.json` (usuario `root`, sin contraseña, base `star_coffee`). También se puede cambiar con las variables de entorno `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_HOST`.

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

## Qué se hizo en el Sprint 5 (Middlewares + Autenticación)

* **Registro, login y logout** con usuarios guardados en `data/users.json`. Las contraseñas nuevas se guardan cifradas (scrypt); los usuarios que ya existían siguen entrando con su contraseña de siempre.
* **Recuérdame:** casilla en el login que guarda una cookie firmada por 30 días, para volver a entrar sin loguearse otra vez.
* **Perfil** (`/perfil`): ver los datos, editar nombre y apellidos y cambiar la contraseña.
* **Middlewares** (`middlewares/auth.js`), sin paquetes extra:
  * `cargarSesion`: detecta al usuario en cada petición (cookie de sesión o "recuérdame") y lo deja disponible como `usuario` en las vistas.
  * `soloHuespedes`: rutas solo para visitantes sin login (`/login`, `/registro`). Si ya hay sesión, redirige a `/`.
  * `soloUsuarios`: rutas solo para usuarios con login (`/`, `/products`, `/carrito`, `/perfil`...). Si no hay sesión, redirige a `/login`.
* Cada visitante tiene su propia sesión (antes la sesión era una sola compartida por todos).

| Ruta                  | Método | Acceso     | Para qué sirve                       |
| --------------------- | ------ | ---------- | ------------------------------------ |
| `/login`              | GET/POST | Huéspedes | Iniciar sesión (con "Recuérdame")    |
| `/registro`           | GET/POST | Huéspedes | Crear cuenta                         |
| `/salir`              | GET    | Usuarios   | Cerrar sesión                        |
| `/perfil`             | GET    | Usuarios   | Ver el perfil                        |
| `/perfil`             | PUT    | Usuarios   | Editar nombre y apellidos            |
| `/perfil/contrasena`  | PUT    | Usuarios   | Cambiar la contraseña                |

Opcional: define la variable de entorno `SESSION_SECRET` para firmar la cookie "Recuérdame".

## Qué se hizo en el Sprint 6 (Bases de datos + Sequelize)

* Los usuarios y los productos pasaron de archivos JSON a una base de datos **MySQL** (`star_coffee`), que se maneja con **Sequelize**.
* **Diagrama de base de datos:** [database/diagrama-der.pdf](./database/diagrama-der.pdf).
* **Script de estructura:** [database/structure.sql](./database/structure.sql) crea la base de datos, las tablas, los tipos de datos, las restricciones y las claves foráneas.
* **Carpeta `database/`:** configuración de Sequelize (`config/config.json`, `.sequelizerc`) y un modelo por tabla en `database/models/`.

| Tabla          | Para qué sirve                                                       |
| -------------- | -------------------------------------------------------------------- |
| `users`        | Usuarios (nombre, apellidos, correo único, contraseña cifrada, foto) |
| `categories`   | Categorías de los productos (cafés, bebidas frías, repostería...)    |
| `products`     | Productos, cada uno con una categoría (`category_id`)                |
| `sizes`        | Tamaños disponibles (Pequeño, Mediano, Grande...)                    |
| `product_size` | Tabla intermedia: relación muchos a muchos entre productos y tamaños |

* **Relaciones:** una categoría tiene muchos productos (1:N) y un producto puede tener muchos tamaños y un tamaño puede estar en muchos productos (N:M, con `product_size`).
* **CRUD de productos** con Sequelize: crear, editar, eliminar, listar, ver el detalle y **buscar** por nombre o descripción (`/products?q=latte`, que también se combina con `?category=cafes`).
* **CRUD de usuarios** con Sequelize: crear (`/registro`), editar (`/perfil`) y ver el detalle (`/perfil`).
* Las categorías y los tamaños se crean solos la primera vez que se usan en un producto.
* Se agregó el middleware `middlewares/asincrono.js` y un manejador de errores en `app.js` para que una falla de la base de datos no deje la página colgada.
* **Script de datos:** [database/data.sql](./database/data.sql) llena las tablas con 5 usuarios y 10 productos de prueba (`admin@starcoffee.com` / `admin123` y `laura@gmail.com` / `laura123`).
