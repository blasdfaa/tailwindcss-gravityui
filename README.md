# GravityUI plugin for Tailwind CSS

## Usage

Install the plugin from npm:

```bash
# npm
npm install -D tailwindcss-gravityui

# pnpm
pnpm install -D tailwindcss-gravityui
```

Then add the plugin to your `tailwind.config.js` file:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require('tailwindcss-gravityui'),
    // ...
  ],
}
```

> [!NOTE]
> The plugin does not import a css file with GravityUI variables, you need to import it yourself, as in the example from the [Gravity documentation](https://gravity-ui.com/libraries/uikit#styles)
