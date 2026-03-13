# GravityUI plugin for Tailwind CSS

## Installation

```bash
# npm
npm install -D tailwindcss-gravityui

# pnpm
pnpm install -D tailwindcss-gravityui
```

## Usage

### Tailwind CSS v4

Import the theme CSS file in your main stylesheet:

```css
@import "tailwindcss";
@import "tailwindcss-gravityui/theme.css";
```

### Tailwind CSS v3

Add the plugin to your `tailwind.config.js` file:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require('tailwindcss-gravityui'),
  ],
}
```

> [!NOTE]
> The plugin does not import a CSS file with GravityUI variables, you need to import it yourself, as in the example from the [Gravity documentation](https://gravity-ui.com/libraries/uikit#styles)
