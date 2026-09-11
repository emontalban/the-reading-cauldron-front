# The Reading Cauldron

En este repositorio esta el Frontend de **The Reading Cauldron**,  que es una  aplicación web de biblioteca personal.

La aplicación permite buscar libros,  y llevar un control de los libros que se consultan de esta manera se crea una biblioteca propia de los libros que guardan en la biblioteca privada y asi consultar y llevar un control de los libros que tenemos o queremos tener todo ello esta conectado a un backend propio desarrollado con Flask.

## Funcionalidades principales

* Página principal con secciones de libros.
* Búsqueda de libros.
* Página de detalle de libro.
* Registro de usuario.
* Inicio de sesión.
* Cierre de sesión.
* Biblioteca personal protegida.
* Guardado de libros en la biblioteca.
* Edición de libros guardados.
* Eliminación de libros.
* Marcado de favoritos.
* Filtros por estado y formato.
* Página 404.
* Diseño responsive para escritorio, tablet y móvil.

## Tecnologías utilizadas

* React
* Vite
* JavaScript
* React Router DOM
* Axios
* SCSS
* Font Awesome
* HTML
* CSS

## API externa

El frontend utiliza **Open Library API** para buscar libros y obtener información como:

* Título.
* Autor.
* Portada.
* Año de publicación.
* Idioma.
* Categoría.
* ISBN.
* Descripción.

## Conexión con el backend

El frontend se conecta a una API propia desarrollada con Flask.
La URL del backend se configura mediante una variable de entorno.

Archivo `.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

## Rutas principales

```txt
/                       Página principal
/search                 Búsqueda de libros
/login                  Inicio de sesión
/register               Registro
/library                Biblioteca personal
/book-detail/works/:id  Detalle del libro
*                       Página 404
```

## Estructura del proyecto

```txt
the-reading-cauldron-frontend/
│
├── package.json
├── .env.example
├── index.html
│
└── src/
    ├── api/
    │   └── axiosConfig.js
    │
    ├── assets/
    |   |__ images/
    |   |__ logos /
    │
    ├── components/
    │   ├── AppToast.jsx
    │   ├── BookCard.jsx
    │   ├── BookSection.jsx
    │   ├── Footer.jsx
    │   ├── LibraryBookCard.jsx
    │   ├── LibraryBookEditForm.jsx
    │   ├── LibraryBookEditModal.jsx
    │   ├── LibraryFilters.jsx
    │   ├── LibraryStats.jsx
    │   ├── LoginForm.jsx
    │   └── ProtectedRoute.jsx
    │   ├── NavBar.jsx
    │   └── RegisterForm.jsx
    │
    ├── pages/
    │   ├── BookDetailPage.jsx
    │   ├── HomePage.jsx
    │   ├── LibraryPage.jsx
    │   ├── LoginPage.jsx
    │   ├── NotFoundPage.jsx
    │   ├── RegisterPage.jsx
    │   └── SearchBooksPage.jsx
    │
    ├── style/
    │   ├── main.scss
    │   ├── _variables.scss
    │   ├── _base.scss
    │   ├── _navbar.scss
    │   ├── _footer.scss
    │   ├── _book-card.scss
    │   ├── _search-books.scss
    │   ├── _library.scss
    │   ├── _library-modal.scss
    │   ├── _app-toast.scss
    │   ├── _book-details.scss
    │   ├── _login-form.scss
    │   ├── _register-page.scss
    │   └── _not-found.scss
    │   ├── _mixins.scss
    │   └── _home.scss    
    │
    ├── App.jsx
    └── main.jsx
```

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO_FRONTEND
cd the-reading-cauldron-frontend
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` a partir de `.env.example`.

Ejemplo:

```env
VITE_API_URL=http://localhost:5000
```

Arrancar el proyecto:

```bash
npm run dev
```

Por defecto, el frontend se ejecuta en:

```txt
http://localhost:5173
```

## Flujo principal de uso

1. El usuario accede a la aplicación puede ver diferentes secciones de libros.
2. Puede buscar libros.
3. Puede consultar el detalle de un libro.
4. Para guardar libros, para ello tiene que registrarse o iniciar sesión.
5. Después de iniciar sesión, puede añadir libros a su biblioteca.
6. Desde la biblioteca puede editar, filtrar, marcar como favorito o eliminar libros.

## Gestión de autenticación

Después del login, el frontend guarda el token JWT en `localStorage`.

El token se utiliza para acceder a rutas protegidas ya que no se puede guardar libros si no se esta registrado y enviar peticiones privadas al backend.

La ruta `/library` está protegida. Si el usuario no ha iniciado sesión, no puede acceder a su biblioteca personal.

## CRUD 

El CRUD principal se realiza desde la página **Mi biblioteca** hay es donde podemos realizar las acciones.

### Create

El usuario guarda un libro lo puede hacer desde la busqueda o desde la pagina de inicio.

### Read

El usuario  puede ver todos los libros guardados en su biblioteca.

### Update

El usuario puede  editar la información de lectura de un libro guardado, añadir a favorito, crear notas, etc.

### Delete

El usuario puede eliminar un libro de su biblioteca.


## Repositorio backend

El backend de este proyecto está en otro repositorio.

Repositorio backend:

```txt
URL_DEL_REPOSITORIO_BACKEND
```

## Funcionamiento de Open Library en el proyecto

El proyecto utiliza **Open Library API** como fuente externa de información sobre libros 

Open Library permite consultar libros mediante peticiones HTTP y devuelve los resultados en formato JSON. La aplicacion utiliza para buscar libros, y consultar los datos derivados de esos libros.

### Búsqueda de libros

Cuando el usuario realiza una búsqueda, se envía una petición a Open Library usando el endpoint:
```text
https://openlibrary.org/search.json
```
La búsqueda se realiza enviando el texto introducido por el usuario como parámetro `q`.

Por Ejemplo:

https://openlibrary.org/search.json?q=harry+potter



Campos utilizados:

key
title
author_name
cover_i
first_publish_year
language
subject
isbn
publisher

### imagenes

Open Library devuelve un identificador  para la imagen llamado cover_i, con este identificador  se construye la imagen.


Ejemplo:

https://covers.openlibrary.org/b/id/15155833-M.jpg

En el proyecto se utiliza así:

https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg

La letra final indica el tamaño de la portada:

S → pequeña
M → mediana
L → grande



