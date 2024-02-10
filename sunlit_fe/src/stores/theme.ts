import { createEffect, createSignal } from 'solid-js';

export enum Themes {
  DARK = 'dark-theme',
  LIGHT = 'light-theme'
}

const [theme, setTheme] = createSignal(Themes.LIGHT);

const toggleTheme = () => {
  setTheme(theme() === Themes.DARK ? Themes.LIGHT : Themes.DARK);
};

createEffect(() => {
  document.body.classList.add(theme());
});

export { theme, toggleTheme };
