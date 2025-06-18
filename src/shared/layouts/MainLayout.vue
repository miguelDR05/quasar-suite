<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-gradient-header text-white" height-hint="64">
      <q-toolbar class="q-px-md">
        <!-- App Grid Button -->
        <q-btn
          flat
          dense
          round
          icon="apps"
          color="white"
          size="md"
          @click="toggleAppGrid"
          class="q-mr-sm"
        >
          <q-tooltip>Aplicaciones de Microsoft 365</q-tooltip>
        </q-btn>

        <!-- Outlook Title -->
        <div class="text-h6 text-weight-medium q-mr-lg">Outlook</div>

        <!-- Search Bar -->
        <div class="col-4 q-mx-lg">
          <q-input
            v-model="searchQuery"
            filled
            dense
            placeholder="Explorar contactos, directorio y grupos"
            bg-color="white"
            color="primary"
            class="search-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-7" />
            </template>
          </q-input>
        </div>

        <q-space />

        <!-- Header Actions -->
        <div class="row q-gutter-xs items-center">
          <q-btn flat dense round icon="feedback" color="white" size="sm">
            <q-tooltip>Comentarios</q-tooltip>
          </q-btn>

          <q-btn flat dense round icon="lightbulb" color="white" size="sm">
            <q-tooltip>Novedades</q-tooltip>
          </q-btn>

          <q-btn flat dense round icon="notifications" color="white" size="sm">
            <q-tooltip>Notificaciones</q-tooltip>
          </q-btn>

          <q-btn flat dense round icon="settings" color="white" size="sm">
            <q-tooltip>Configuración</q-tooltip>
          </q-btn>

          <q-btn flat dense round color="white" size="sm" class="q-ml-sm">
            <q-avatar size="32px" color="primary" text-color="white"> A </q-avatar>
            <q-tooltip>Cuenta</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Navigation Bar -->
    <q-header elevated class="bg-white text-dark navigation-bar" height-hint="48">
      <q-toolbar class="q-px-md" style="height: 48px; min-height: 48px">
        <div class="row items-center full-width">
          <!-- Navigation Items -->
          <div class="row items-center q-gutter-lg">
            <q-btn
              v-for="item in navigationItems"
              :key="item.name"
              flat
              no-caps
              :color="item.active ? 'primary' : 'grey-8'"
              :class="['nav-item', { 'nav-item--active': item.active }]"
              @click="setActiveNavItem(item.name)"
            >
              {{ item.label }}
            </q-btn>
          </div>

          <q-space />

          <!-- Right side actions -->
          <div class="row items-center q-gutter-sm">
            <q-btn flat dense icon="help" color="grey-7" size="sm">
              <q-tooltip>Ayuda</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- App Grid Popup -->
    <q-dialog v-model="showAppGrid" position="top" class="app-grid-dialog">
      <q-card class="app-grid-card">
        <q-card-section class="q-pa-lg">
          <div class="text-h6 q-mb-md text-center">Aplicaciones de Microsoft 365</div>

          <div class="app-grid">
            <div
              v-for="app in microsoftApps"
              :key="app.name"
              class="app-item"
              @click="openApp(app)"
            >
              <q-avatar :color="app.color" text-color="white" size="48px" class="q-mb-xs">
                <q-icon :name="app.icon" size="24px" />
              </q-avatar>
              <div class="app-name">{{ app.name }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// Interfaces
interface NavigationItem {
  name: string;
  label: string;
  active: boolean;
}

interface MicrosoftApp {
  name: string;
  icon: string;
  color: string;
  url?: string;
}

// Reactive data
const searchQuery = ref('');
const showAppGrid = ref(false);

const navigationItems = reactive<NavigationItem[]>([
  { name: 'inicio', label: 'Inicio', active: true },
  { name: 'vista', label: 'Vista', active: false },
  { name: 'ayuda', label: 'Ayuda', active: false },
]);

const microsoftApps: MicrosoftApp[] = [
  { name: 'Outlook', icon: 'mail', color: 'blue-6' },
  { name: 'Teams', icon: 'people', color: 'purple-6' },
  { name: 'OneDrive', icon: 'cloud', color: 'blue-7' },
  { name: 'Word', icon: 'description', color: 'blue-8' },
  { name: 'Excel', icon: 'table_chart', color: 'green-6' },
  { name: 'PowerPoint', icon: 'slideshow', color: 'orange-6' },
  { name: 'OneNote', icon: 'note', color: 'purple-7' },
  { name: 'SharePoint', icon: 'share', color: 'teal-6' },
  { name: 'Power BI', icon: 'analytics', color: 'yellow-7' },
  { name: 'Yammer', icon: 'forum', color: 'blue-5' },
  { name: 'Stream', icon: 'play_circle', color: 'red-6' },
  { name: 'Power Apps', icon: 'apps', color: 'purple-8' },
];

// Methods
const toggleAppGrid = (): void => {
  showAppGrid.value = !showAppGrid.value;
};

const setActiveNavItem = (itemName: string): void => {
  navigationItems.forEach((item) => {
    item.active = item.name === itemName;
  });
};

const openApp = (app: MicrosoftApp): void => {
  console.log(`Opening ${app.name}`);
  showAppGrid.value = false;
  // Aquí puedes agregar lógica de navegación
};
</script>

<style lang="scss" scoped>
// Header gradient similar to Outlook
.bg-gradient-header {
  background: linear-gradient(135deg, #0078d4, #106ebe, #005a9e);
}

// Search input styling
.search-input {
  .q-field__control {
    border-radius: 4px;
    height: 32px;
  }

  .q-field__native {
    padding-top: 0;
    padding-bottom: 0;
  }
}

// Navigation bar styling
.navigation-bar {
  border-bottom: 1px solid #e1e1e1;

  .nav-item {
    position: relative;
    padding: 8px 16px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(0, 120, 212, 0.1);
    }

    &--active {
      color: #0078d4 !important;

      &::after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 2px;
        background-color: #0078d4;
      }
    }
  }
}

// App grid dialog styling
.app-grid-dialog {
  .q-dialog__inner {
    padding-top: 80px; // Adjust for header height
  }
}

.app-grid-card {
  min-width: 320px;
  max-width: 480px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  justify-items: center;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .app-name {
    font-size: 12px;
    text-align: center;
    color: #424242;
    font-weight: 500;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .search-input {
    display: none;
  }

  .navigation-bar {
    .row.q-gutter-lg {
      gap: 8px;
    }
  }

  .app-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 12px;
  }
}
</style>
