import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

export interface AppState {
  isLoading: boolean;
  sidebarOpen: boolean;
  notifications: AppNotification[];
  searchQuery: string;
}

export const useAppStore = defineStore('app', () => {
  // Estado
  const isLoading = ref(false);
  const sidebarOpen = ref(true);
  const notifications = ref<AppNotification[]>([]);
  const searchQuery = ref('');
  const currentRoute = ref('');

  // Computadas
  const unreadNotifications = computed(() => notifications.value.filter((n) => !n.read));

  const unreadCount = computed(() => unreadNotifications.value.length);

  // Métodos
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
    localStorage.setItem('sidebarOpen', sidebarOpen.value.toString());
  };

  const setSidebarOpen = (open: boolean) => {
    sidebarOpen.value = open;
    localStorage.setItem('sidebarOpen', open.toString());
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    notifications.value.unshift(newNotification);

    // Limitar a 50 notificaciones
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50);
    }
  };

  const markNotificationAsRead = (id: string) => {
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
  };

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach((n) => (n.read = true));
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAllNotifications = () => {
    notifications.value = [];
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const setCurrentRoute = (route: string) => {
    currentRoute.value = route;
  };

  const initApp = () => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    if (savedSidebarState !== null) {
      sidebarOpen.value = savedSidebarState === 'true';
    }
  };

  return {
    // Estado
    isLoading,
    sidebarOpen,
    notifications,
    searchQuery,
    currentRoute,

    // Computadas
    unreadNotifications,
    unreadCount,

    // Métodos
    toggleSidebar,
    setSidebarOpen,
    setLoading,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearAllNotifications,
    setSearchQuery,
    setCurrentRoute,
    initApp,
  };
});
