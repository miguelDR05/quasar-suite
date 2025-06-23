<template>
  <q-card class="no-paddimg">
    <div class="q-pa-md">
      <q-input
        color="primary"
        bg-color="grey-4"
        dense
        filled
        v-model="filter"
        placeholder="Buscar aplicaciones"
        @focus="inputFocus = true"
        ref="searchInputRef"
      >
        <template v-slot:prepend>
          <q-icon :name="inputFocus ? 'mdi-arrow-left' : 'search'" @click="removeFocus()" />
        </template>
      </q-input>
    </div>
    <div :class="!inputFocus ? 'q-pa-md' : ''">
      <div v-if="!inputFocus" class="app-grid">
        <div
          v-for="app in microsoftApps"
          :key="app.name"
          class="app-item q-pa-sm"
          @click="openApp(app)"
        >
          <q-icon :color="app.color" :name="app.icon" size="md" class="q-mb-xs" />
          <div class="app-name">{{ app.name }}</div>
        </div>
      </div>
      <div v-else class="app-list">
        <q-list v-if="filteredApps.length > 0">
          <q-item
            v-for="app in filteredApps"
            :key="app.name"
            clickable
            class="q-mx-lg q-px-none app-list-item"
            v-ripple
            @click="openApp(app)"
          >
            <q-item-section avatar class="no-padding">
              <q-icon :color="app.color" :name="app.icon" size="md" />
            </q-item-section>

            <q-item-section>{{ app.name }}</q-item-section>
          </q-item>
        </q-list>

        <!-- No se encontraron resultados -->
        <div v-else class="q-pa-md text-center text-grey">
          <q-icon name="mdi-alert-circle-outline" size="32px" class="q-mb-sm" />
          <div>No se encontraron aplicaciones para "{{ filter }}"</div>
        </div>
      </div>
      <q-item v-show="inputFocus" clickable v-ripple>
        <q-item-section>Todas las aplicaciones</q-item-section>
        <q-item-section avatar>
          <q-icon color="primary" name="mdi-arrow-right" size="md" class="q-mb-xs" />
        </q-item-section>
      </q-item>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';

const filter = ref<string>('');
const inputFocus = ref<boolean>(false);
const microsoftApps = ref([
  { name: 'Microsoft 365 Copilot', icon: 'mdi-microsoft', color: 'indigo' },
  { name: 'Outlook', icon: 'mdi-microsoft-outlook', color: 'blue-10' },
  { name: 'OneDrive', icon: 'mdi-microsoft-onedrive', color: 'light-blue-7' },
  { name: 'Word', icon: 'mdi-microsoft-word', color: 'blue' },
  { name: 'Excel', icon: 'mdi-microsoft-excel', color: 'green-7' },
  { name: 'PowerPoint', icon: 'mdi-microsoft-powerpoint', color: 'deep-orange-5' },
  { name: 'OneNote', icon: 'mdi-microsoft-onenote', color: 'deep-purple-6' },
  { name: 'SharePoint', icon: 'mdi-share-outline', color: 'teal-7' },
  { name: 'Teams', icon: 'mdi-microsoft-teams', color: 'purple-7' },
  { name: 'Sway', icon: 'mdi-view-carousel', color: 'green-5' },
  { name: 'Engage', icon: 'mdi-account-group', color: 'cyan-6' },
  { name: 'Power Automate', icon: 'mdi-cog-sync', color: 'blue-5' },
  { name: 'Adobe Identity', icon: 'mdi-adobe', color: 'red-5' },
  { name: 'Power Pages', icon: 'mdi-file-document-multiple', color: 'blue-grey-5' },
  { name: 'Canva', icon: 'mdi-palette', color: 'purple-4' },
  { name: 'Loop', icon: 'mdi-infinity', color: 'deep-purple-4' },
  { name: 'Visio', icon: 'mdi-vector-square', color: 'light-blue-5' },
  { name: 'Bookings', icon: 'mdi-calendar-check', color: 'blue-7' },
  { name: 'Calendario', icon: 'mdi-calendar-month', color: 'indigo-4' },
  { name: 'Más aplicaciones', icon: 'mdi-dots-grid', color: 'grey-7' },
]);
const filteredApps = computed(() => {
  const search = filter.value.trim().toLowerCase();
  if (!search) return microsoftApps.value;
  return microsoftApps.value.filter((app) => app.name.toLowerCase().includes(search));
});

const openApp = (app: { name: string }) => {
  console.log(`Abriendo ${app.name}`);
};

const searchInputRef = ref<InstanceType<(typeof import('quasar'))['QInput']> | null>(null);

function removeFocus(): void {
  filter.value = '';
  inputFocus.value = false;
  nextTick(() => {
    searchInputRef.value?.blur();
  });
}
</script>

<style scoped lang="scss">
.app-grid {
  display: grid;
  gap: 10px;
  justify-items: center;
  text-align: center;

  // Por defecto: 5 columnas
  grid-template-columns: repeat(5, 1fr);

  // Si pantalla < 1200px → 4 columnas
  @media (max-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }

  // Si pantalla < 900px → 4 columnas
  @media (max-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }

  // Si pantalla < 600px → 4 columnas
  @media (max-width: 600px) {
    grid-template-columns: repeat(4, 1fr);
  }

  // Si pantalla < 400px → 4 columna
  @media (max-width: 400px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
.app-item {
  width: 80px;
  height: 80px;
  transition: transform 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  }
}
.app-name {
  font-size: 0.7rem;
  margin-top: 4px;
  white-space: normal;
  word-break: break-word;
}
// Lista
.app-list {
  height: 50vh;
  overflow-y: auto;
  .app-list-item {
    padding: 5px;
    &:hover {
      border-radius: 5px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      transform: scale(1.05);
    }
  }
}
</style>
