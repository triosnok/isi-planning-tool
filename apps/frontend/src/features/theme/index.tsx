import { createPrefersDark } from '@solid-primitives/media';
import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  useContext,
} from 'solid-js';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

export interface ThemeContextValue {
  theme: Accessor<Theme>;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>();

const THEME_LOCALSTORAGE_KEY = 'preferred-theme';

export const ThemeProvider: Component<{ children: JSX.Element }> = (props) => {
  const prefersDarkMode = createPrefersDark();
  const [preferredTheme, setPreferredTheme] = createSignal(
    localStorage.getItem(THEME_LOCALSTORAGE_KEY)
  );

  const theme = createMemo(() => {
    const preferred = preferredTheme();
    const prefersDark = prefersDarkMode();
    let theme = prefersDark ? Theme.DARK : Theme.LIGHT;

    if (
      preferred !== null &&
      [Theme.DARK, Theme.LIGHT].includes(preferred as any)
    ) {
      theme = preferred as Theme;
    }

    return theme;
  });

  createEffect(() => {
    const t = theme();
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(t);
  });

  const setTheme = (theme: Theme) => {
    localStorage.setItem(THEME_LOCALSTORAGE_KEY, theme);
    setPreferredTheme(theme);
  };

  const toggleTheme = () => {
    const currentTheme = theme();
    const newTheme = currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return ctx;
};
