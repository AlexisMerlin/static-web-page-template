# Guía paso a paso: Entorno de desarrollo local para proyectos **HTML/CSS/JS estático** con Vite

> Objetivo: guiar de manera clara y reproducible a un desarrollador principiante para montar un proyecto web estático con herramientas modernas (Vite, linters, formateador, hooks de Git) usando un flujo ligero y actual.

---

## Contenido

1. Requisitos previos
2. Estructura de carpetas recomendada
3. Comandos para crear el proyecto e instalar dependencias
4. `package.json` sugerido y scripts útiles
5. Archivos de configuración (ESLint, Prettier, Stylelint, HTML-Validate)
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
├─ index.html
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ js/
│  │  └─ main.js
│  └─ images/
├─ dist/
├─ eslint.config.cjs
├─ .prettierrc
├─ .stylelintrc.json
├─ .htmlvalidate.json
├─ .gitignore
├─ package.json
└─ README.md
```

* `index.html` vive en la raíz, como espera Vite por defecto.
* `assets/` separa CSS, JS e imágenes para mantener orden.
* `dist/` es la salida de `npm run build`.

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
npm install --save-dev vite eslint @eslint/js globals prettier stylelint stylelint-config-standard html-validate
```

**Qué hace cada paquete** (resumen):

* `vite`: servidor de desarrollo rápido y herramienta de build para generar `dist/`.
* `eslint`: detecta errores y malas prácticas en JavaScript.
* `@eslint/js`: reglas base recomendadas para ESLint flat config.
* `globals`: catálogo de variables globales (p. ej. navegador) para ESLint.
* `prettier`: formatea código (JS, CSS, HTML) de forma consistente.
* `stylelint`: valida reglas de CSS (buenas prácticas y errores comunes).
* `stylelint-config-standard`: configuración base recomendada para stylelint.
* `html-validate`: analizador y linter de HTML que soporta plugins y es compatible con Prettier.

> Nota: más adelante puedes añadir `husky` y `lint-staged` para hooks de commit (se explica en la sección 7).

---

## 4) `package.json` sugerido y scripts

Sustituye o actualiza el `package.json` que se creó con `npm init` con este contenido (puedes copiar/pegar):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5000",
    "start": "vite --port 5000",
    "lint": "npm run lint:js && npm run lint:css && npm run lint:html",
    "lint:js": "eslint \"assets/js/**/*.js\"",
    "lint:css": "stylelint \"assets/css/**/*.css\"",
    "lint:html": "html-validate \"index.html\"",
    "format": "prettier --write \"./index.html\" \"./assets/**/*.{js,css,html}\""
  }
}
```

* `npm run dev`: inicia el servidor de desarrollo de Vite.
* `npm run build`: compila la versión de producción en `dist/`.
* `npm run preview`: sirve el build generado para validar producción local.
* `npm start`: levanta Vite en puerto `5000` como alternativa rápida.
* `npm run lint`: ejecuta todos los linters.
* `npm run format`: formatea todos los archivos con Prettier.

---

## 5) Archivos de configuración

A continuación se incluyen las configuraciones mínimas recomendadas. Crea cada archivo en la raíz del proyecto.

### `eslint.config.cjs` (ESLint v9+ / v10 flat config)

A partir de ESLint v9 y obligatorio en v10, se usa el nuevo sistema **flat config** en lugar de `.eslintrc.*`.

Crea un archivo llamado `eslint.config.cjs` en la raíz del proyecto:

```js
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'off',
    },
  },
];
```


**Explicación**:

* ESLint usa flat config; en este proyecto se mantiene en CommonJS con `eslint.config.cjs`.
* `@eslint/js` contiene la configuración base equivalente a `eslint:recommended`.
* `globals` evita declarar manualmente cada global del navegador.
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

### Configuración de HTML‑Validate

Crea un fichero `.htmlvalidate.json` en la raíz del proyecto. Un ejemplo mínimo que también desactiva las reglas de formato que puede chocar con Prettier es:

```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "doctype-style": "off",
    "void-style": "off",
    "close-order": "error"
  }
}
```

**Explicación**: HTML‑Validate es un linter moderno que admite configuraciones extensibles y se integra bien con Prettier. Al desactivar las reglas de formato evitamos choques cuando ambos se ejecutan sobre los mismos archivos.

### `.gitignore` (mínimo sugerido)

```
node_modules/
.DS_Store
dist/
.env
```

---

## 6) Archivos ejemplo

### `index.html` (raíz)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <main>
      <h1>Hola, mundo</h1>
      <button type="button" id="btn">Haz clic</button>
      <div>test</div>
    </main>
    <script type="module" src="/assets/js/main.js"></script>
  </body>
</html>
```

**Puntos didácticos**:

* `type="module"` permite usar `import`/`export` directamente en el navegador.
* Con Vite se usa habitualmente ruta absoluta desde raíz (`/assets/...`) para scripts y recursos.

### `assets/js/main.js`

```js
const btn = document.querySelector('#btn');

btn.addEventListener('click', () => {
  console.log('Funciona correctamente');
  btn.textContent = '¡Gracias!';
});
```

### `assets/css/styles.css`

```css
* {
  box-sizing: border-box;
}

body {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  margin: 0;
  padding: 2rem;
}

main {
  max-width: 700px;
  margin: 0 auto;
}

h1 {
  color: #1a1a1a;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
}
```
---

## 7) Integración con VSCode (recomendado)

Crea (o edita) `.vscode/settings.json` en la raíz del proyecto con estas opciones:

```jsonc
{
  "editor.formatOnSave": false,
  "eslint.validate": ["javascript", "javascriptreact"],
  "prettier.requireConfig": true,
}
```

**Explicación**:

* `formatOnSave` está desactivado para evitar cambios automáticos no deseados en cada guardado.
* `prettier.requireConfig`: asegura que Prettier use la configuración del proyecto (no ajustes globales del usuario).

Crea (o edita) `.vscode/extensions.json` en la raíz del proyecto con estas opciones:

```json
{
    "recommendations": [
        "stylelint.vscode-stylelint",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "html-validate.vscode-html-validate"  
    ]
}
```

> Explicación: `stylelint.vscode-stylelint` muestra en el editor de código los errores o advertencias en tu código CSS, `dbaeumer.vscode-eslint` muestra en el editor de código los errores o advertencias en tu código JavaScript, `esbenp.prettier-vscode` formatea rápidamente tu código respetando la configuración de tu proyecto, `html-validate.vscode-html-validate` proporciona validación de HTML usando html-validate dentro del editor.

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
  "assets/js/**/*.js": ["eslint --fix", "prettier --write"],
  "assets/css/**/*.css": ["stylelint --fix", "prettier --write"],
  "index.html": ["html-validate", "prettier --write"]
}
```

**Cómo funciona**: cuando se intenta `git commit`, Husky ejecuta el hook `pre-commit` que a su vez ejecuta `lint-staged`. `lint-staged` corre los linters/formatters únicamente sobre los archivos que están staged (lista para el commit). Si alguno falla, el commit se detiene hasta que se arregle.


## 9) Flujo de trabajo diario (sugerido)

1. `npm run dev` — trabajar en el navegador con HMR y recarga rápida de Vite.
2. Mientras codifica, guarda archivos para que VSCode formatee y aplique los fixes (si configuraste `formatOnSave`).
3. Antes de un commit: `npm run lint` y `npm run format` (si tienes Husky, parte de esto se ejecutará automáticamente).
4. `git add .` → `git commit -m "mensaje"` → si Husky + lint-staged están activos, detectará problemas y evitará commits con errores graves.
5. `npm run build` y luego `npm run preview` — para validar el resultado de producción.

---

## 10) Troubleshooting y buenas prácticas

* **ESLint no encuentra reglas**: confirma que `node_modules` está instalado y que ejecutas el comando desde la raíz del proyecto.
* **Prettier formatea distinto que ESLint**: instala `eslint-config-prettier` si quieres que ESLint no discuta con Prettier (opcional, sobre todo cuando activas reglas de estilo en ESLint).
* **Vite no levanta o puerto ocupado**: cambia el puerto (`vite --port 5174`) o cierra el proceso que ya lo use.
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
* Compilar build: `npm run build`
* Previsualizar build: `npm run preview`

---

## ¿Qué sigue? (sugerencias didácticas)

* Empieza con ejercicios pequeños: crear un componente (card) que tenga HTML, CSS y un pequeño comportamiento en JS.
* Introduce `import`/`export` dentro de `assets/js/` para practicar módulos nativos del navegador.
* Cuando esté cómodo, agrega pasos opcionales: tests con Vitest (para JS), TypeScript o CI para lint/format/build.