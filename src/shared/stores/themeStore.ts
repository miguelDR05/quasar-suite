import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { Dark } from 'quasar';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  positive: string;
  negative: string;
  info: string;
  warning: string;
}

export interface CustomTheme {
  name: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}

export const useThemeStore = defineStore('theme', () => {
  // Estado reactivo
  const isDarkMode = ref(false);
  const themeMode = ref<'auto' | 'light' | 'dark'>('auto');
  const currentTheme = ref<string>('default');

  // Temas predefinidos
  const themes = ref<Record<string, CustomTheme>>({
    default: {
      name: 'Outlook',
      colors: {
        light: {
          primary: '#0078d4',
          secondary: '#106ebe',
          accent: '#8c4cff',
          positive: '#21ba45',
          negative: '#c10015',
          info: '#31ccec',
          warning: '#f2c037',
        },
        dark: {
          primary: '#4cc2ff',
          secondary: '#26a69a',
          accent: '#9c27b0',
          positive: '#21ba45',
          negative: '#c10015',
          info: '#31ccec',
          warning: '#f2c037',
        },
      },
    },
    blue: {
      name: 'Azul Corporativo',
      colors: {
        light: {
          primary: '#1976d2',
          secondary: '#1565c0',
          accent: '#82b1ff',
          positive: '#4caf50',
          negative: '#f44336',
          info: '#2196f3',
          warning: '#ff9800',
        },
        dark: {
          primary: '#90caf9',
          secondary: '#64b5f6',
          accent: '#3f51b5',
          positive: '#66bb6a',
          negative: '#ef5350',
          info: '#42a5f5',
          warning: '#ffb74d',
        },
      },
    },
    green: {
      name: 'Verde Natural',
      colors: {
        light: {
          primary: '#2e7d32',
          secondary: '#388e3c',
          accent: '#4fc3f7',
          positive: '#4caf50',
          negative: '#e53935',
          info: '#29b6f6',
          warning: '#ffa726',
        },
        dark: {
          primary: '#81c784',
          secondary: '#66bb6a',
          accent: '#26a69a',
          positive: '#4caf50',
          negative: '#ef5350',
          info: '#42a5f5',
          warning: '#ffb74d',
        },
      },
    },
  });

  // Computadas
  const currentColors = computed(() => {
    const theme = themes.value[currentTheme.value];
    if (theme && theme.colors) {
      return isDarkMode.value ? theme.colors.dark : theme.colors.light;
    }
    // Devuelve un objeto vacío o un fallback si no existe el tema
    return {
      primary: '',
      secondary: '',
      accent: '',
      positive: '',
      negative: '',
      info: '',
      warning: '',
    } as ThemeColors;
  });

  const availableThemes = computed(() =>
    Object.entries(themes.value).map(([key, theme]) => ({
      value: key,
      label: theme.name,
    })),
  );

  // Métodos
  const setThemeMode = (mode: 'auto' | 'light' | 'dark') => {
    themeMode.value = mode;
    localStorage.setItem('themeMode', mode);

    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDarkMode.value = prefersDark;
      Dark.set(prefersDark);
    } else {
      isDarkMode.value = mode === 'dark';
      Dark.set(mode === 'dark');
    }
  };

  const setTheme = (themeName: string) => {
    if (themes.value[themeName]) {
      currentTheme.value = themeName;
      localStorage.setItem('currentTheme', themeName);
    }
  };

  const applyColors = () => {
    const theme = currentColors.value;

    // Aplicar colores CSS custom properties
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--q-${key}`, value);
    });
  };

  const addCustomTheme = (name: string, theme: CustomTheme) => {
    themes.value[name] = theme;
    localStorage.setItem('customThemes', JSON.stringify(themes.value));
  };

  const removeCustomTheme = (name: string) => {
    if (name !== 'default' && themes.value[name]) {
      delete themes.value[name];
      if (currentTheme.value === name) {
        currentTheme.value = 'default';
      }
      localStorage.setItem('customThemes', JSON.stringify(themes.value));
    }
  };

  const initTheme = () => {
    // Cargar configuración guardada
    const savedMode = (localStorage.getItem('themeMode') as 'auto' | 'light' | 'dark') || 'auto';
    const savedTheme = localStorage.getItem('currentTheme') || 'default';
    const customThemes = localStorage.getItem('customThemes');

    if (customThemes) {
      try {
        const parsed = JSON.parse(customThemes);
        Object.assign(themes.value, parsed);
      } catch (e) {
        console.warn('Error loading custom themes:', e);
      }
    }

    currentTheme.value = savedTheme;
    setThemeMode(savedMode);

    // Escuchar cambios en preferencias del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (themeMode.value === 'auto') {
        isDarkMode.value = e.matches;
        Dark.set(e.matches);
      }
    });
  };

  // Watchers
  watch(
    [currentColors, isDarkMode],
    () => {
      applyColors();
    },
    { immediate: true },
  );

  return {
    // Estado
    isDarkMode,
    themeMode,
    currentTheme,
    themes,

    // Computadas
    currentColors,
    availableThemes,

    // Métodos
    setThemeMode,
    setTheme,
    addCustomTheme,
    removeCustomTheme,
    initTheme,
  };
});
