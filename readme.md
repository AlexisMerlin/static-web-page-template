# Guía paso a paso: Entorno de desarrollo local para proyectos **HTML/CSS/JS estático** (modo moderno)

> Objetivo: guiar de manera clara y reproducible a un desarrollador principiante para montar un proyecto web estático con herramientas modernas (linters, formateador, servidor local, hooks de Git) sin usar *bundlers*.

---

## Contenido

1. Requisitos previos
2. Estructura de carpetas recomendada
3. Comandos para crear el proyecto e instalar dependencias
4. `package.json` sugerido y scripts útiles
5. Archivos de configuración (ESLint, Prettier, Stylelint, HTMLHint)
6. Archivos ejemplo: `index.html`, `main.js`, `styles.css`
7. Integración con VSCode (ajustes recomendados)
8. Opcional: hooks de Git con Husky + lint-staged
9. Flujo de trabajo diario (qué ejecutar y cuándo)
10. Troubleshooting y buenas prácticas

---

## 1) Requisitos previos

* Tener instalado **Node.js** (versión LTS recomendada). `npm` viene con Node.
* Un editor de código (recomendado: **Visual Studio Code**).
* Git (para usar hooks y control de versiones).

Verifica instalación:

```bash
node --version
npm --version
git --version
```

---

## 2) Estructura de carpetas recomendada

```
mi-proyecto/
├─ public/
│  ├─ index.html
│  └─ assets/
│     ├─ css/
│     │  └─ styles.css
│     │
│     ├─ js/
│     │  └─ main.js
│     └─ images/
│
├─ eslint.config.cjs
├─ .prettierrc
├─ .stylelintrc.json
├─ .htmlhintrc
├─ .gitignore
├─ package.json
└─ README.md
```

* `public/` contiene los archivos que el navegador va a consumir tal cual. No hay paso de build.
* `assets/` separa CSS, JS e imágenes para mantener orden.

---

## 3) Crear el proyecto e instalar dependencias

Ejecuta estos comandos en la carpeta donde quieras crear el proyecto:

```bash
mkdir mi-proyecto
cd mi-proyecto
npm init -y
```

Instala las herramientas de desarrollo (devDependencies):

```bash
npm install --save-dev eslint @eslint/js prettier stylelint stylelint-config-standard htmlhint serve live-server 
```

**Qué hace cada paquete** (resumen):

* `eslint`: detecta errores y malas prácticas en JavaScript.
* `prettier`: formatea código (JS, CSS, HTML) de forma consistente.
* `stylelint`: valida reglas de CSS (buenas prácticas y errores comunes).
* `stylelint-config-standard`: configuración base recomendada para stylelint.
* `htmlhint`: valida HTML según reglas configurables.
* `serve`: servidor estático compacto para publicar la carpeta `public` (útil para producción/local).
* `live-server`: servidor de desarrollo con recarga automática (ideal para editar y ver cambios al instante).

> Nota: más adelante puedes añadir `husky` y `lint-staged` para hooks de commit (se explica en la sección 7).

---

## 4) `package.json` sugerido y scripts

Sustituye o actualiza el `package.json` que se creó con `npm init` con este contenido (puedes copiar/pegar):

```json
{
  "scripts": {
    "dev": "live-server public --port=5173",
    "start": "serve public -s -l 5000",
    "lint": "npm run lint:js && npm run lint:css && npm run lint:html",
    "lint:js": "eslint \"public/assets/js/**/*.js\"",
    "lint:css": "stylelint \"public/assets/css/**/*.css\"",
    "lint:html": "htmlhint \"public/**/*.html\"",
    "format": "prettier --write \"public/**/*.{js,css,html}\""
  }
}
```

* `npm run dev`: inicia el servidor de desarrollo con recarga automática.
* `npm start`: sirve la carpeta `public` con `serve` (útil para pruebas de despliegue local).
* `npm run lint`: ejecuta todos los linters.
* `npm run format`: formatea todos los archivos con Prettier.

---

## 5) Archivos de configuración

A continuación se incluyen las configuraciones mínimas recomendadas. Crea cada archivo en la raíz del proyecto.

### `eslint.config.cjs` (ESLint v9+ / v10 flat config)

A partir de ESLint v9 y obligatorio en v10, se usa el nuevo sistema **flat config** en lugar de `.eslintrc.*`.

Crea un archivo llamado `eslint.config.js` en la raíz del proyecto:

```js
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['public/assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off'
    }
  }
];
```


**Explicación**:

* ESLint ahora usa un archivo `eslint.config.js` en formato ESM.
* `@eslint/js` contiene la configuración base equivalente a `eslint:recommended`.
* `files` indica qué archivos deben ser evaluados.
* `ecmaVersion: 'latest'` permite sintaxis moderna.
* `sourceType: 'module'` habilita `import`/`export`.

> ⚠️ Si existe un archivo `.eslintrc.*`, elimínalo para evitar conflictos.

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

**Explicación**: reglas de formato (punto y coma, comillas simples, ancho de línea, tabulación).

### `.stylelintrc.json`

```json
{
  "extends": "stylelint-config-standard"
}
```

**Explicación**: `stylelint-config-standard` aplica un set de reglas ampliamente adoptado para CSS. Si usas CSS moderno (p. ej. `@layer`, `@apply`) podríamos añadir excepciones con `rules`.

### `.htmlhintrc`

```json
{
  "tagname-lowercase": true,
  "attr-lowercase": true,
  "doctype-first": true,
  "id-unique": true
}
```

**Explicación**: reglas simples para evitar errores comunes en HTML.

### `.gitignore` (mínimo sugerido)

```
node_modules/
.DS_Store
dist/
.env
```

---

## 6) Archivos ejemplo (copiar a `public/`)

### `public/index.html`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi Proyecto</title>
    <link rel="stylesheet" href="./assets/css/styles.css" />
  </head>
  <body>
    <main>
      <h1>Hola, mundo</h1>
      <button id="btn">Haz clic</button>
    </main>

    <script type="module" src="./assets/js/main.js"></script>
  </body>
</html>
```

**Puntos didácticos**:

* `type="module"` permite usar `import`/`export` directamente en el navegador.
* Rutas relativas claras para que el alumno entienda la relación archivos/HTML.

### `public/assets/js/main.js`

```js
const btn = document.querySelector('#btn');

btn.addEventListener('click', () => {
  console.log('Funciona correctamente');
  btn.textContent = '¡Gracias!';
});
```

### `public/assets/css/styles.css`

```css
* { box-sizing: border-box; }
body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin: 0; padding: 2rem; }
main { max-width: 700px; margin: 0 auto; }
h1 { color: #1a1a1a; }
button { padding: 0.5rem 1rem; border-radius: 6px; }
```
---

## 7) Integración con VSCode (recomendado)

Crea (o edita) `.vscode/settings.json` en la raíz del proyecto con estas opciones:

```json
{
  "editor.formatOnSave": true,
  "eslint.validate": ["javascript"],
  "prettier.requireConfig": true
}
```

**Explicación**:

* `formatOnSave`: formatea al guardar (Prettier).
* `codeActionsOnSave.source.fixAll.eslint`: aplica correcciones automáticas de ESLint al guardar.
* `prettier.requireConfig`: asegura que Prettier use la configuración del proyecto (no ajustes globales del usuario).

Crea (o edita) `.vscode/extensions.json` en la raíz del proyecto con estas opciones:

```json
{
    "recommendations": [
        "stylelint.vscode-stylelint",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "HTMLHint.vscode-htmlhint"
    ]
}
```

Explicación: `stylelint.vscode-stylelint` muestra en el editor de código los errores o advertencias en tu código CSS, `dbaeumer.vscode-eslint` muestra en el editor de código los errores o advertencias en tu código JavaScript, `esbenp.prettier-vscode` formatea rápidamente tu código respetando la configuración de tu proyecto, `HTMLHint.vscode-htmlhint` muestra advertencias sobre posibles errores en tu código html.

---

## 8) Opcional: Hooks de Git (pre-commit) con Husky + lint-staged

Estos pasos son opcionales, pero recomendados para proteger la calidad antes de commits.

Instalación:

```bash
npm install --save-dev husky lint-staged
npx husky install
```

Añadir hook pre-commit (ejemplo):

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

Agregar `lint-staged` al `package.json` (ejemplo):

```json
"lint-staged": {
  "public/assets/js/**/*.js": ["eslint --fix", "prettier --write"],
  "public/assets/css/**/*.css": ["stylelint --fix", "prettier --write"],
  "public/**/*.html": ["htmlhint", "prettier --write"]
}
```

**Cómo funciona**: cuando se intenta `git commit`, Husky ejecuta el hook `pre-commit` que a su vez ejecuta `lint-staged`. `lint-staged` corre los linters/formatters únicamente sobre los archivos que están staged (lista para el commit). Si alguno falla, el commit se detiene hasta que se arregle.


## 9) Flujo de trabajo diario (sugerido)

1. `npm run dev` — trabajar en el navegador con recarga automática.
2. Mientras codifica, guarda archivos para que VSCode formatee y aplique los fixes (si configuraste `formatOnSave`).
3. Antes de un commit: `npm run lint` y `npm run format` (si tienes Husky, parte de esto se ejecutará automáticamente).
4. `git add .` → `git commit -m "mensaje"` → si Husky + lint-staged están activos, detectará problemas y evitará commits con errores graves.
5. `npm start` — para probar la carpeta `public` servida como si fuera un despliegue estático.

---

## 10) Troubleshooting y buenas prácticas

* **ESLint no encuentra reglas**: confirma que `node_modules` está instalado y que ejecutas el comando desde la raíz del proyecto.
* **Prettier formatea distinto que ESLint**: instala `eslint-config-prettier` si quieres que ESLint no discuta con Prettier (opcional, sobre todo cuando activas reglas de estilo en ESLint).
* **live-server no recarga**: revisa la consola donde ejecutaste `npm run dev` para ver errores; comprueba que no tengas otro proceso en el puerto especificado.
* **Problemas con módulos ESM (import/export)**: asegúrate de usar `type="module"` en el `script` del HTML y que el navegador soporte módulos (todos los navegadores modernos lo hacen).
* **Si quieres añadir TypeScript**: podríamos añadir `tsconfig.json`, `typescript` y un pequeño paso de compilación; no es necesario para empezar.

---

## Apéndice: Comandos útiles de verificación

* Ejecutar linters:

  * `npm run lint:js`
  * `npm run lint:css`
  * `npm run lint:html`
* Formatear todo: `npm run format`
* Levantar dev server: `npm run dev`
* Servir carpeta para pruebas: `npm start`

---

## ¿Qué sigue? (sugerencias didácticas)

* Empieza con ejercicios pequeños: crear un componente (card) que tenga HTML, CSS y un pequeño comportamiento en JS.
* Introduce `import`/`export` dentro de `public/assets/js/` para que aprenda módulos nativos del navegador.
* Cuando esté cómodo, agrega pasos opcionales: tests con Jest (para JS), TypeScript, o un bundler ligero como Vite si necesita usar herramientas modernas de build.