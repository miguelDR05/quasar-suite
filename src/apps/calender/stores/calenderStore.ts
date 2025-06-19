import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  description?: string;
  color: string;
  type: 'event' | 'holiday' | 'reminder' | 'meeting';
  location?: string;
  attendees?: string[];
  isAllDay?: boolean;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
}

export const useCalendarStore = defineStore('calendar', () => {
  // Estado
  const currentDate = ref(new Date());
  const selectedDate = ref(new Date());
  const viewType = ref<'month' | 'week' | 'day' | 'agenda'>('month');
  const events = ref<CalendarEvent[]>([
    {
      id: '1',
      title: 'Día de la Independencia del Perú',
      date: '2025-07-28',
      type: 'holiday',
      color: 'red-6',
      isAllDay: true,
    },
    {
      id: '2',
      title: 'Reunión de equipo',
      date: '2025-06-18',
      time: '10:00',
      endTime: '11:30',
      type: 'meeting',
      color: 'blue-6',
      location: 'Sala de conferencias A',
      attendees: ['juan@company.com', 'maria@company.com'],
    },
    {
      id: '3',
      title: 'Recordatorio: Entrega de proyecto',
      date: '2025-06-20',
      time: '09:00',
      type: 'reminder',
      color: 'orange-6',
      description: 'Entregar el proyecto final del trimestre',
    },
  ]);

  const selectedEvents = ref<CalendarEvent[]>([]);
  const isLoading = ref(false);

  // Computadas
  const currentMonth = computed(() => currentDate.value.getMonth());
  const currentYear = computed(() => currentDate.value.getFullYear());
  const currentWeek = computed(() => {
    const start = new Date(currentDate.value);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
    start.setDate(diff);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  });

  const todayEvents = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return events.value.filter((event) => event.date === today);
  });

  const upcomingEvents = computed(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return events.value
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  // Métodos
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.value.filter((event) => event.date === dateStr);
  };

  const getEventsForDateRange = (startDate: Date, endDate: Date): CalendarEvent[] => {
    if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return [];
    }
    const start = startDate.toISOString().split('T')[0] ?? '';
    const end = endDate.toISOString().split('T')[0] ?? '';

    return events.value.filter((event) => {
      return event.date >= start && event.date <= end;
    });
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>): string => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    events.value.push(newEvent);
    saveEventsToStorage();
    return newEvent.id;
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>): boolean => {
    const index = events.value.findIndex((event) => event.id === id);
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...updates };
      saveEventsToStorage();
      return true;
    }
    return false;
  };

  const removeEvent = (id: string): boolean => {
    const index = events.value.findIndex((event) => event.id === id);
    if (index !== -1) {
      events.value.splice(index, 1);
      saveEventsToStorage();
      return true;
    }
    return false;
  };

  const duplicateEvent = (id: string, newDate: string): string | null => {
    const event = events.value.find((e) => e.id === id);
    if (event) {
      // Excluye 'id' al duplicar el evento
      const { id: _omit, ...rest } = event;
      const duplicated: Omit<CalendarEvent, 'id'> = {
        ...rest,
        date: newDate,
        title: `${event.title} (Copia)`,
      };
      return addEvent(duplicated);
    }
    return null;
  };

  const moveEvent = (id: string, newDate: string): boolean => {
    return updateEvent(id, { date: newDate });
  };

  const searchEvents = (query: string): CalendarEvent[] => {
    const lowerQuery = query.toLowerCase();
    return events.value.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description?.toLowerCase().includes(lowerQuery) ||
        event.location?.toLowerCase().includes(lowerQuery),
    );
  };

  const getEventsByType = (type: CalendarEvent['type']): CalendarEvent[] => {
    return events.value.filter((event) => event.type === type);
  };

  const setCurrentDate = (date: Date) => {
    currentDate.value = new Date(date);
  };

  const setSelectedDate = (date: Date) => {
    selectedDate.value = new Date(date);
    selectedEvents.value = getEventsForDate(date);
  };

  const setViewType = (type: 'month' | 'week' | 'day' | 'agenda') => {
    viewType.value = type;
    localStorage.setItem('calendarViewType', type);
  };

  const navigateToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate.value);
    switch (viewType.value) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigatePrevious = () => {
    const newDate = new Date(currentDate.value);
    switch (viewType.value) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const saveEventsToStorage = () => {
    localStorage.setItem('calendarEvents', JSON.stringify(events.value));
  };

  const loadEventsFromStorage = () => {
    const saved = localStorage.getItem('calendarEvents');
    if (saved) {
      try {
        events.value = JSON.parse(saved);
      } catch (e) {
        console.warn('Error loading events from storage:', e);
      }
    }
  };

  const initCalendar = () => {
    loadEventsFromStorage();
    const savedViewType = localStorage.getItem('calendarViewType') as typeof viewType.value;
    if (savedViewType) {
      viewType.value = savedViewType;
    }
  };

  return {
    // Estado
    currentDate,
    selectedDate,
    viewType,
    events,
    selectedEvents,
    isLoading,

    // Computadas
    currentMonth,
    currentYear,
    currentWeek,
    todayEvents,
    upcomingEvents,

    // Métodos
    getEventsForDate,
    getEventsForDateRange,
    addEvent,
    updateEvent,
    removeEvent,
    duplicateEvent,
    moveEvent,
    searchEvents,
    getEventsByType,
    setCurrentDate,
    setSelectedDate,
    setViewType,
    navigateToToday,
    navigateNext,
    navigatePrevious,
    initCalendar,
  };
});
