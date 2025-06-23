<template>
  <div class="smart-search-container">
    <!-- Search Input with Dropdown -->
    <div class="search-wrapper">
      <!-- Category Select -->
      <q-select
        v-model="selectedCategory"
        :options="categoryOptions"
        class="category-select"
        dense
        borderless
        bg-color="grey-4"
        emit-value
        map-options
        :style="{ height: inputHeight }"
      >
        <template v-slot:selected>
          <span class="category-text">{{ getCategoryLabel(selectedCategory) }}</span>
        </template>
      </q-select>

      <!-- Search Input -->
      <div class="search-input-container" ref="searchContainer">
        <q-input
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
        >
          <template v-slot:prepend>
            <q-icon
              name="mdi-arrow-left"
              class="cursor-pointer text-grey-7"
              @click="emit('returnSearchEngine', false)"
            />
          </template>
          <template v-slot:append>
            <q-icon
              name="keyboard_arrow_down"
              class="cursor-pointer text-grey-7"
              :class="{ 'rotate-180': showDropdown }"
              @click="toggleDropdown"
            />
          </template>
        </q-input>

        <!-- Dropdown Panel -->
        <transition name="dropdown">
          <div v-if="showDropdown" class="dropdown-panel" @mousedown.prevent>
            <!-- Tabs -->
            <div class="tabs-container">
              <div
                v-for="tab in tabs"
                :key="tab.value"
                class="tab-item"
                :class="{ active: activeTab === tab.value }"
                @click="setActiveTab(tab.value)"
              >
                {{ tab.label }}
              </div>
            </div>

            <!-- Content Area -->
            <div class="content-area">
              <div v-if="activeTab === 'todo'" class="tab-content">
                <div class="search-suggestions">
                  <div
                    v-for="(item, index) in filteredEmails"
                    :key="index"
                    class="suggestion-item"
                    :class="{ highlighted: highlightedIndex === index }"
                    @click="selectItem(item)"
                    @mouseenter="highlightedIndex = index"
                  >
                    <div class="suggestion-content">
                      <div class="suggestion-title">{{ item.subject }}</div>
                      <div class="suggestion-meta">
                        <span class="sender">{{ item.sender }}</span>
                        <span class="date">{{ formatDate(item.date) }}</span>
                      </div>
                      <div class="suggestion-preview">{{ item.preview }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="activeTab === 'correo'" class="tab-content">
                <div class="search-suggestions">
                  <div
                    v-for="(item, index) in filteredEmails"
                    :key="index"
                    class="suggestion-item"
                    :class="{ highlighted: highlightedIndex === index }"
                    @click="selectItem(item)"
                    @mouseenter="highlightedIndex = index"
                  >
                    <q-icon name="mail" class="suggestion-icon" />
                    <div class="suggestion-content">
                      <div class="suggestion-title">{{ item.subject }}</div>
                      <div class="suggestion-meta">
                        <span class="sender">{{ item.sender }}</span>
                        <span class="date">{{ formatDate(item.date) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="activeTab === 'archivos'" class="tab-content">
                <div class="search-suggestions">
                  <div
                    v-for="(file, index) in filteredFiles"
                    :key="index"
                    class="suggestion-item"
                    :class="{ highlighted: highlightedIndex === index }"
                    @click="selectFile(file)"
                    @mouseenter="highlightedIndex = index"
                  >
                    <q-icon :name="getFileIcon(file.type)" class="suggestion-icon" />
                    <div class="suggestion-content">
                      <div class="suggestion-title">{{ file.name }}</div>
                      <div class="suggestion-meta">
                        <span class="file-size">{{ file.size }}</span>
                        <span class="date">{{ formatDate(file.modified) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="activeTab === 'equipos'" class="tab-content">
                <div class="search-suggestions">
                  <div
                    v-for="(team, index) in filteredTeams"
                    :key="index"
                    class="suggestion-item"
                    :class="{ highlighted: highlightedIndex === index }"
                    @click="selectTeam(team)"
                    @mouseenter="highlightedIndex = index"
                  >
                    <q-icon name="groups" class="suggestion-icon" />
                    <div class="suggestion-content">
                      <div class="suggestion-title">{{ team.name }}</div>
                      <div class="suggestion-meta">
                        <span class="members">{{ team.members }} miembros</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="activeTab === 'personas'" class="tab-content">
                <div class="search-suggestions">
                  <div
                    v-for="(person, index) in filteredPersons"
                    :key="index"
                    class="suggestion-item"
                    :class="{ highlighted: highlightedIndex === index }"
                    @click="selectPerson(person)"
                    @mouseenter="highlightedIndex = index"
                  >
                    <q-avatar size="32px" class="suggestion-avatar">
                      <img v-if="person.avatar" :src="person.avatar" />
                      <span v-else>{{ getInitials(person.name) }}</span>
                    </q-avatar>
                    <div class="suggestion-content">
                      <div class="suggestion-title">{{ person.name }}</div>
                      <div class="suggestion-meta">
                        <span class="position">{{ person.position }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Search Button -->
      <q-btn
        unelevated
        dense
        icon="search"
        color="grey-4"
        text-color="grey-7"
        class="search-button no-padding"
        :style="{ height: inputHeight }"
        @click="performSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

// Types
interface Email {
  subject: string;
  sender: string;
  date: Date;
  preview: string;
  read: boolean;
}

interface File {
  name: string;
  type: string;
  size: string;
  modified: Date;
}

interface Team {
  name: string;
  members: number;
}

interface Person {
  name: string;
  position: string;
  avatar?: string;
}

interface CategoryOption {
  label: string;
  value: string;
}

// Reactive data
const searchQuery = ref('');
const showDropdown = ref(false);
const activeTab = ref('todo');
const selectedCategory = ref('todas');
const highlightedIndex = ref(-1);
const inputHeight = '35px';

// Template refs
const searchInput = ref();
const searchContainer = ref();

// Configuration
const categoryOptions: CategoryOption[] = [
  { label: 'Todas las carpetas', value: 'todas' },
  { label: 'Bandeja de entrada', value: 'inbox' },
  { label: 'Enviados', value: 'sent' },
  { label: 'Borradores', value: 'drafts' },
  { label: 'Eliminados', value: 'deleted' },
];

const tabs = [
  { label: 'Todo', value: 'todo' },
  { label: 'Correo', value: 'correo' },
  { label: 'Archivos', value: 'archivos' },
  { label: 'Equipos', value: 'equipos' },
  { label: 'Personas', value: 'personas' },
];

// Mock data
const emails: Email[] = [
  {
    subject: '¡Completa la Encuesta de Servicios Marzo 2025!',
    sender: 'SAE UTP',
    date: new Date('2024-03-15'),
    preview: 'Estimado alumno, te invitamos a completar nuestra encuesta...',
    read: false,
  },
  {
    subject: '¡Realiza el pago de tu matrícula Agosto 2025 desde ahora!',
    sender: 'SAE UTP',
    date: new Date('2024-06-20'),
    preview: 'No olvides realizar el pago de tu matrícula para el siguiente semestre...',
    read: true,
  },
  {
    subject: 'Información de matrícula Agosto 2025',
    sender: 'SAE UTP',
    date: new Date('2024-06-18'),
    preview: 'Te enviamos la información importante sobre el proceso de matrícula...',
    read: true,
  },
];

const files: File[] = [
  {
    name: 'Documento_Matricula.pdf',
    type: 'pdf',
    size: '2.5 MB',
    modified: new Date('2024-06-20'),
  },
  { name: 'Horario_Clases.xlsx', type: 'excel', size: '1.2 MB', modified: new Date('2024-06-19') },
  {
    name: 'Presentacion_Curso.pptx',
    type: 'powerpoint',
    size: '5.8 MB',
    modified: new Date('2024-06-18'),
  },
];

const teams: Team[] = [
  { name: 'Equipo de Desarrollo', members: 8 },
  { name: 'Equipo de Diseño', members: 5 },
  { name: 'Equipo de Marketing', members: 6 },
];

const persons: Person[] = [
  { name: 'Ana García', position: 'Coordinadora Académica' },
  { name: 'Carlos López', position: 'Profesor de Ingeniería' },
  { name: 'María Rodríguez', position: 'Asesora Estudiantil' },
];
// Emits
const emit = defineEmits(['returnSearchEngine']);

// Computed properties
const filteredEmails = computed(() => {
  if (!searchQuery.value) return emails;
  return emails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const filteredFiles = computed(() => {
  if (!searchQuery.value) return files;
  return files.filter((file) => file.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const filteredTeams = computed(() => {
  if (!searchQuery.value) return teams;
  return teams.filter((team) => team.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const filteredPersons = computed(() => {
  if (!searchQuery.value) return persons;
  return persons.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      person.position.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// Methods
const getCategoryLabel = (value: string): string => {
  const option = categoryOptions.find((opt) => opt.value === value);
  return option?.label || 'Todas las carpetas';
};

const toggleDropdown = (): void => {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
};

const hideDropdown = (): void => {
  showDropdown.value = false;
  highlightedIndex.value = -1;
};

const handleInputBlur = (): void => {
  // Delay hiding to allow clicking on dropdown items
  setTimeout(() => {
    if (!searchContainer.value?.contains(document.activeElement)) {
      hideDropdown();
    }
  }, 200);
};

const setActiveTab = (tab: string): void => {
  activeTab.value = tab;
  highlightedIndex.value = -1;
};

const navigateDown = (): void => {
  const maxIndex = getMaxIndex();
  highlightedIndex.value = highlightedIndex.value < maxIndex ? highlightedIndex.value + 1 : 0;
};

const navigateUp = (): void => {
  const maxIndex = getMaxIndex();
  highlightedIndex.value = highlightedIndex.value > 0 ? highlightedIndex.value - 1 : maxIndex;
};

const getMaxIndex = (): number => {
  switch (activeTab.value) {
    case 'todo':
    case 'correo':
      return filteredEmails.value.length - 1;
    case 'archivos':
      return filteredFiles.value.length - 1;
    case 'equipos':
      return filteredTeams.value.length - 1;
    case 'personas':
      return filteredPersons.value.length - 1;
    default:
      return 0;
  }
};

const selectHighlighted = (): void => {
  if (highlightedIndex.value >= 0) {
    switch (activeTab.value) {
      case 'todo':
      case 'correo':
        selectItem(filteredEmails.value[highlightedIndex.value]);
        break;
      case 'archivos':
        selectFile(filteredFiles.value[highlightedIndex.value]);
        break;
      case 'equipos':
        selectTeam(filteredTeams.value[highlightedIndex.value]);
        break;
      case 'personas':
        selectPerson(filteredPersons.value[highlightedIndex.value]);
        break;
    }
  }
};

const selectItem = (item: Email): void => {
  searchQuery.value = item.subject;
  hideDropdown();
  console.log('Selected email:', item);
};

const selectFile = (file: File): void => {
  searchQuery.value = file.name;
  hideDropdown();
  console.log('Selected file:', file);
};

const selectTeam = (team: Team): void => {
  searchQuery.value = team.name;
  hideDropdown();
  console.log('Selected team:', team);
};

const selectPerson = (person: Person): void => {
  searchQuery.value = person.name;
  hideDropdown();
  console.log('Selected person:', person);
};

const performSearch = (): void => {
  console.log('Searching for:', searchQuery.value, 'in category:', selectedCategory.value);
  hideDropdown();
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `${days} días`;
  if (days < 30) return `${Math.floor(days / 7)} semanas`;
  return date.toLocaleDateString();
};

const getFileIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    pdf: 'picture_as_pdf',
    excel: 'grid_on',
    powerpoint: 'slideshow',
    word: 'description',
    image: 'image',
    video: 'videocam',
    audio: 'audiotrack',
  };
  return iconMap[type] || 'insert_drive_file';
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

// Handle outside clicks
const handleClickOutside = (event: Event): void => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    hideDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
// * Buscador
.smart-search-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.search-wrapper {
  display: flex;
  position: relative;
}

.category-select {
  width: 200px;

  ::v-deep(.q-field__control) {
    border-radius: 6px 0 0 6px;
    padding: 0 8px;
    min-height: 35px;

    // Anular los pseudo-elementos que suman altura
    // &::before,
    // &::after {
    //   content: none !important;
    //   display: none !important;
    // }
  }

  // ::v-deep(.q-field__control-container) {
  //   // height: 35px !important;
  //   // min-height: 35px !important;
  // }

  ::v-deep(.q-field__native) {
    min-height: 35px;
    height: 35px;
    line-height: normal;
  }

  ::v-deep(.q-field__marginal) {
    height: 35px;
    line-height: normal;
  }

  .category-text {
    font-size: 14px;
    color: #333;
  }
}

.search-input-container {
  flex: 1;
  position: relative;
}

.search-input {
  :deep(.q-field__control) {
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

.search-button {
  border-radius: 0 6px 6px 0;
  min-width: 40px;
  :deep(.q-btn) {
    height: 55px;
  }
}

// * Dropdown
.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 500px;
  overflow: hidden;
}

.tabs-container {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.tab-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    color: #333;
  }

  &.active {
    color: #0078d4;
    border-bottom-color: #0078d4;
    background: white;
  }
}

.content-area {
  max-height: 400px;
  overflow-y: auto;
}

.tab-content {
  padding: 8px 0;
}

.search-suggestions {
  .suggestion-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;

    &:hover,
    &.highlighted {
      background: #f8f9fa;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .suggestion-icon {
    margin-right: 12px;
    color: #666;
    font-size: 20px;
  }

  .suggestion-avatar {
    margin-right: 12px;
  }

  .suggestion-content {
    flex: 1;
    min-width: 0;
  }

  .suggestion-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .suggestion-meta {
    font-size: 12px;
    color: #666;
    display: flex;
    gap: 8px;
    margin-bottom: 2px;
  }

  .suggestion-preview {
    font-size: 12px;
    color: #888;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  .sender {
    font-weight: 500;
  }

  .date {
    margin-left: auto;
  }
}

// Animations
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.rotate-180 {
  transform: rotate(180deg);
}

// Responsive
@media (max-width: 768px) {
  .search-wrapper {
    flex-direction: column;
    gap: 8px;
  }

  .category-select {
    width: 100%;

    :deep(.q-field__control) {
      border-radius: 6px;
      border-right: 1px solid #ccc;
    }
  }

  .search-input {
    :deep(.q-field__control) {
      border-radius: 6px;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
    }
  }

  .search-button {
    border-radius: 6px;
  }
}
</style>
