<template>
  <q-layout view="hHh lpR fFf">
    <!-- Sidebar -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="280" class="bg-gradient">
      <div class="sidebar-container">
        <!-- Header del Sidebar -->
        <div class="sidebar-header q-pa-md">
          <div class="text-h6 text-weight-medium q-mb-md text-dark">Aplicaciones</div>
          <q-input
            v-model="searchText"
            filled
            dense
            placeholder="Buscar una aplicación"
            class="search-input"
            bg-color="white"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Grid de Aplicaciones -->
        <div class="apps-container q-pa-md">
          <div class="apps-grid">
            <q-card
              v-for="app in filteredApps"
              :key="app.name"
              class="app-card cursor-pointer"
              flat
              @click="selectApp(app)"
            >
              <q-card-section class="text-center q-pa-md">
                <div class="app-icon q-mb-xs" :class="app.color">
                  <q-icon :name="app.icon" size="24px" color="white" />
                </div>
                <div class="app-name text-caption text-weight-medium">
                  {{ app.name }}
                </div>
              </q-card-section>
            </q-card>

            <!-- Agregar aplicaciones -->
            <q-card class="app-card add-apps cursor-pointer" flat @click="addApps">
              <q-card-section class="text-center q-pa-md">
                <q-icon name="add" size="24px" color="grey-6" class="q-mb-xs" />
                <div class="app-name text-caption text-grey-7">Agregar aplicaciones</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Footer -->
        <div class="sidebar-footer">
          <q-btn flat class="full-width" label="Mostrar todo" color="primary" @click="showAll" />
        </div>
      </div>
    </q-drawer>

    <!-- Header -->
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />

        <q-toolbar-title class="text-h5 text-weight-medium">
          {{ currentMonth }}
        </q-toolbar-title>

        <q-space />

        <div class="text-caption text-grey-7">
          {{ statusMessage }}
        </div>
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <q-page class="q-pa-md">
        <!-- Calendar Grid -->
        <!-- <div class="calendar-container">
          <div class="calendar-grid">
            <div
              v-for="day in dayHeaders"
              :key="day"
              class="calendar-header text-center text-weight-medium"
            >
              {{ day }}
            </div>

            <q-card
              v-for="(day, index) in calendarDays"
              :key="index"
              class="calendar-day cursor-pointer"
              :class="{
                today: day.isToday,
                'other-month': day.isOtherMonth,
                'has-event': day.hasEvent,
              }"
              flat
              @click="selectDay(day)"
            >
              <q-card-section class="q-pa-sm">
                <div class="day-number text-weight-bold">
                  {{ day.number }}
                </div>
                <div v-if="day.hasEvent" class="event-indicator"></div>
              </q-card-section>
            </q-card>
          </div>
        </div> -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Reactive data
const leftDrawerOpen = ref(false);
const searchText = ref('');
const currentMonth = ref('Junio 2025');
const statusMessage = ref('Hoy no hay compañeros en la oficina');

// Apps data
const apps = ref([
  { name: 'Bookings', icon: 'event', color: 'bg-blue' },
  { name: 'Grupos', icon: 'group', color: 'bg-light-blue' },
  { name: 'Ir a Excel', icon: 'grid_on', color: 'bg-green' },
  { name: 'Ir a OneNote', icon: 'note', color: 'bg-purple' },
  { name: 'Ir a PowerPoint', icon: 'slideshow', color: 'bg-red' },
  { name: 'Ir a Word', icon: 'description', color: 'bg-indigo' },
  { name: 'Loop', icon: 'loop', color: 'bg-deep-purple' },
  { name: 'Power BI', icon: 'analytics', color: 'bg-yellow' },
  { name: 'Viva Engage', icon: 'forum', color: 'bg-cyan' },
]);

// Calendar data
const dayHeaders = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const calendarDays = ref([
  // Días del mes anterior
  { number: 26, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 27, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 28, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 29, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 30, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 31, isOtherMonth: true, hasEvent: false, isToday: false },

  // Días de junio
  { number: 1, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 2, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 3, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 4, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 5, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 6, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 7, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 8, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 9, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 10, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 11, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 12, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 13, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 14, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 15, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 16, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 17, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 18, isOtherMonth: false, hasEvent: false, isToday: true },
  { number: 19, isOtherMonth: false, hasEvent: true, isToday: false },
  { number: 20, isOtherMonth: false, hasEvent: true, isToday: false },
  { number: 21, isOtherMonth: false, hasEvent: true, isToday: false },
  { number: 22, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 23, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 24, isOtherMonth: false, hasEvent: true, isToday: false },
  { number: 25, isOtherMonth: false, hasEvent: true, isToday: false },
  { number: 26, isOtherMonth: false, hasEvent: true, isToday: false },
  { number: 27, isOtherMonth: false, hasEvent: true, isToday: false },
  { number: 28, isOtherMonth: false, hasEvent: true, isToday: false },
  { number: 29, isOtherMonth: false, hasEvent: false, isToday: false },
  { number: 30, isOtherMonth: false, hasEvent: false, isToday: false },

  // Primeros días del mes siguiente
  { number: 1, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 2, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 3, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 4, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 5, isOtherMonth: true, hasEvent: false, isToday: false },
  { number: 6, isOtherMonth: true, hasEvent: false, isToday: false },
]);

// Computed
const filteredApps = computed(() => {
  if (!searchText.value) return apps.value;
  return apps.value.filter((app) =>
    app.name.toLowerCase().includes(searchText.value.toLowerCase()),
  );
});

// Methods
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const selectApp = (app: any) => {
  $q.notify({
    message: `Aplicación seleccionada: ${app.name}`,
    type: 'positive',
    position: 'top',
  });
};

const addApps = () => {
  $q.notify({
    message: 'Agregar nuevas aplicaciones',
    type: 'info',
    position: 'top',
  });
};

const showAll = () => {
  $q.notify({
    message: 'Mostrar todas las aplicaciones',
    type: 'info',
    position: 'top',
  });
};

const selectDay = (day: any) => {
  $q.notify({
    message: `Día seleccionado: ${day.number}`,
    type: 'info',
    position: 'top',
  });
};

onMounted(() => {
  // Inicialización del componente
  console.log('Outlook Layout mounted');
});
</script>

<style lang="scss" scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.sidebar-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.search-input {
  .q-field__control {
    border-radius: 8px;
  }
}

.apps-container {
  flex: 1;
  overflow-y: auto;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.app-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
}

.add-apps {
  border: 2px dashed #ccc !important;
  background: transparent !important;

  &:hover {
    border-color: #667eea !important;
    background: rgba(102, 126, 234, 0.05) !important;
  }
}

.app-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.app-name {
  font-size: 12px;
  line-height: 1.2;
  color: #333;
}

.sidebar-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.calendar-container {
  max-width: 100%;
  overflow-x: auto;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  min-width: 700px;
}

.calendar-header {
  background: #667eea;
  color: white;
  padding: 15px 10px;
  font-size: 14px;
}

.calendar-day {
  background: white;
  min-height: 80px;
  border: none;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  &.today {
    background: #667eea;
    color: white;

    .day-number {
      color: white;
    }
  }

  &.other-month {
    background: #f8f8f8;

    .day-number {
      color: #ccc;
    }
  }

  &.has-event {
    background: rgba(214, 71, 38, 0.1);
  }
}

.day-number {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.event-indicator {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #d64726;
  border-radius: 50%;
}

// Responsive
@media (max-width: 768px) {
  .apps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
