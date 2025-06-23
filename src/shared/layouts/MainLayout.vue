<template>
  <!-- hHh lpR fFf -->
  <q-layout view="hHh LpR lFf">
    <!-- Left Sidebar with App Icons -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="48"
      :breakpoint="0"
      bordered
      class="app-sidebar"
    >
      <div class="sidebar-content">
        <!-- App Icons -->
        <div class="app-icons">
          <q-btn
            v-for="app in sidebarApps"
            :key="app.name"
            flat
            square
            :color="app.active ? 'white' : 'grey-6'"
            :class="['app-icon-btn', { 'app-icon-btn--active': app.active }]"
            @click="setActiveApp(app.name)"
          >
            <q-icon :name="app.icon" size="20px" />
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-grey-9">
              {{ app.label }}
            </q-tooltip>
          </q-btn>
        </div>

        <!-- Bottom Icons -->
        <div class="bottom-icons">
          <q-btn flat square color="grey-6" class="app-icon-btn" @click="toggleAppGrid">
            <q-icon name="apps" size="16px" />
            <q-tooltip anchor="center right" self="center left" :offset="[10, 0]" class="bg-grey-9">
              Todas las aplicaciones
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <!-- Header -->
    <q-header elevated class="bg-gradient-header text-white no-padding" height-hint="54">
      <q-toolbar class="no-padding">
        <!-- App Grid Button (Hidden on desktop, shown on mobile) -->
        <!-- @click="toggleAppGrid" -->
        <q-btn stretch flat icon="apps" color="white" size="md">
          <q-tooltip>Aplicaciones de Suite Quasar</q-tooltip>
          <q-popup-proxy
            transition-show="jump-down"
            transition-hide="jump-up"
            anchor="bottom middle"
            self="top right"
            :offset="[0, 5]"
          >
            <div class="popup-wrapper">
              <app-launcher />
            </div>
          </q-popup-proxy>
        </q-btn>

        <!-- Outlook Title -->
        <div v-if="!isSmartSearch" class="text-h6 text-weight-medium q-mx-sm">Suite Quasar</div>

        <!-- Search Bar -->
        <div v-if="!isSmartSearch" class="col-4 row text-center items-center justify-center">
          <!--
          ref="searchInput"
          v-model="searchQuery"
          class="search-input"
          borderless
          bg-color="white"
          dense
          placeholder="Buscar..."
          :style="{ height: inputHeight }"
          @focus="showDropdown = true"
          @blur="handleInputBlur"
          @keydown.down.prevent="navigateDown"
          @keydown.up.prevent="navigateUp"
          @keydown.enter.prevent="selectHighlighted"
          @keydown.escape="hideDropdown"
          -->
          <q-input
            v-model="searchQuery"
            class="search-input col-xs-10 col-sm-9 col-md-6 col-lg-6"
            bg-color="white"
            borderless
            dense
            placeholder="Buscar"
            color="primary"
            @focus="isSmartSearch = true"
          >
            <template v-slot:prepend>
              <q-icon class="cursor-pointer" name="search" color="grey-7" size="20px" />
            </template>
            <template v-slot:append>
              <q-btn flat dense icon="mdi-filter-variant" color="grey-7" size="sm" />
            </template>
          </q-input>
          <!-- <q-btn
            unelevated
            dense
            icon="mdi-filter-variant"
            color="white"
            text-color="grey-7"
            size="12px"
            class="search-button no-padding"
            style="height: 35px; border-radius: 0 6px 6px 0; min-width: 35px"
          /> -->
        </div>
        <div v-else class="col">
          <smart-search @returnSearchEngine="returnSearchEngine" />
        </div>

        <q-space />
        <!-- Header Actions -->

        <q-btn stretch flat icon="feedback" color="white" size="sm">
          <q-tooltip>Comentarios</q-tooltip>
        </q-btn>

        <q-btn stretch flat icon="lightbulb" color="white" size="sm">
          <q-tooltip>Novedades</q-tooltip>
        </q-btn>

        <q-btn stretch flat icon="notifications" color="white" size="sm">
          <q-tooltip>Notificaciones</q-tooltip>
        </q-btn>

        <q-btn stretch flat icon="settings" color="white" size="sm">
          <q-tooltip>Configuración</q-tooltip>
        </q-btn>

        <q-btn stretch flat color="white" size="sm">
          <q-avatar size="32px" color="primary" text-color="white"> A </q-avatar>
          <q-tooltip>Cuenta</q-tooltip>
        </q-btn>
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
          <div class="text-h6 q-mb-md text-center">Aplicaciones de Suite Quasar</div>

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
import AppLauncher from '@components/AppLauncher.vue';
import SmartSearch from '../components/SmartSearch.vue';

// Interfaces
interface NavigationItem {
  name: string;
  label: string;
  active: boolean;
}

interface SidebarApp {
  name: string;
  label: string;
  icon: string;
  active: boolean;
  color?: string;
}

interface MicrosoftApp {
  name: string;
  icon: string;
  color: string;
  url?: string;
}

// Reactive data
const leftDrawerOpen = ref(true);
const searchQuery = ref('');
const showAppGrid = ref(false);
const isSmartSearch = ref<boolean>(false);

const sidebarApps = reactive<SidebarApp[]>([
  { name: 'outlook', label: 'Outlook', icon: 'mail', active: true, color: 'blue-6' },
  { name: 'teams', label: 'Microsoft Teams', icon: 'people', active: false, color: 'purple-6' },
  { name: 'calendar', label: 'Calendar', icon: 'event', active: false, color: 'blue-7' },
  { name: 'todo', label: 'To Do', icon: 'check_circle', active: false, color: 'blue-8' },
  { name: 'onedrive', label: 'OneDrive', icon: 'cloud', active: false, color: 'blue-5' },
  { name: 'word', label: 'Word', icon: 'description', active: false, color: 'blue-9' },
  { name: 'excel', label: 'Excel', icon: 'table_chart', active: false, color: 'green-6' },
  { name: 'powerpoint', label: 'PowerPoint', icon: 'slideshow', active: false, color: 'orange-6' },
  { name: 'onenote', label: 'OneNote', icon: 'note', active: false, color: 'purple-7' },
]);

const navigationItems = reactive<NavigationItem[]>([
  { name: 'inicio', label: 'Inicio', active: true },
  { name: 'vista', label: 'Vista', active: false },
  { name: 'ayuda', label: 'Ayuda', active: false },
]);

const microsoftApps: MicrosoftApp[] = [
  { name: 'SharePoint', icon: 'share', color: 'teal-6' },
  { name: 'Power BI', icon: 'analytics', color: 'yellow-7' },
  { name: 'Yammer', icon: 'forum', color: 'blue-5' },
  { name: 'Stream', icon: 'play_circle', color: 'red-6' },
  { name: 'Power Apps', icon: 'apps', color: 'purple-8' },
  { name: 'Planner', icon: 'task', color: 'green-7' },
  { name: 'Whiteboard', icon: 'draw', color: 'red-7' },
  { name: 'Forms', icon: 'quiz', color: 'purple-5' },
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

const setActiveApp = (appName: string): void => {
  sidebarApps.forEach((app) => {
    app.active = app.name === appName;
  });
  // Aquí puedes agregar lógica para cambiar la vista/contenido
  console.log(`Switched to ${appName}`);
};

const openApp = (app: MicrosoftApp): void => {
  console.log(`Opening ${app.name}`);
  showAppGrid.value = false;
  // Aquí puedes agregar lógica de navegación
};

function returnSearchEngine(emit: boolean): void {
  isSmartSearch.value = emit;
}
</script>

<style lang="scss" scoped>
// Sidebar styling
.app-sidebar {
  background: linear-gradient(180deg, #0078d4, #106ebe);
  border-right: none !important;

  .sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px 0;
  }

  .app-icons {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 4px;
    flex: 1;
  }

  .bottom-icons {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 4px;
    margin-top: auto;
  }

  .app-icon-btn {
    width: 40px;
    height: 40px;
    // border-radius: 4px;
    position: relative;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &--active {
      background-color: rgba(255, 255, 255, 0.2);
      color: $primary !important;
      // border-left: 4px solid;
      // border-color: $primary;
      // background: white;

      &::before {
        content: '';
        position: absolute;
        left: -4px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 40px;
        background-color: $primary;
        border-radius: 0 2px 2px 0;
      }
    }
  }
}

// Header gradient similar to Outlook
.bg-gradient-header {
  background: linear-gradient(135deg, #0078d4, #106ebe, #005a9e);
}

// Search input styling
.search-input {
  :deep(.q-field__control) {
    background-color: white;
    //border-radius: 6px 0 0 6px;
    border-radius: 6px;
    box-shadow: none;
    padding: 0 5px;
    height: 35px;
  }

  :deep(.q-field__native) {
    padding-left: 10px;
    line-height: normal;
  }

  ::v-deep(.q-field__marginal) {
    height: 35px;
    line-height: normal;
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
    padding-top: 120px; // Adjust for header height
  }
}

.app-grid-card {
  min-width: 320px;
  max-width: 480px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.popup-wrapper {
  width: 50vh;
  max-width: 60vw;

  @media (max-width: 1200px) {
    max-width: 60vw;
  }

  // Si pantalla < 900px → 60% de la pantalla
  @media (max-width: 900px) {
    max-width: 70vw;
  }

  // Si pantalla < 600px → 2 columnas
  @media (max-width: 600px) {
    max-width: 90vw;
  }

  // Si pantalla < 400px → 1 columna
  @media (max-width: 400px) {
    max-width: 90vw;
  }
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
  .app-sidebar {
    transform: translateX(-100%);
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
