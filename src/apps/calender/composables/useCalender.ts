// import { computed, ref } from 'vue'
import { useCalendarStore } from '../stores/calenderStore';
import type { CalendarEvent } from '../stores/calenderStore';

export interface CalendarDay {
  day: number;
  date: string;
  month: number;
  year: number;
  currentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  isWeekend: boolean;
  isDisabled?: boolean;
}

export const useCalendar = () => {
  const calendarStore = useCalendarStore();

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const monthNamesShort = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const dayNamesShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dayNamesMin = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const generateCalendarDays = (year: number, month: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    const selectedDate = calendarStore.selectedDate;

    // Ajustar el primer día de la semana (Lunes = 0)
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();

    const days: CalendarDay[] = [];

    // Días del mes anterior
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthIndex = month === 0 ? 11 : month - 1;

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(prevYear, prevMonthIndex, day);
      const dayOfWeek = date.getDay();

      days.push({
        day,
        date: `${date.toISOString().split('T')[0]}`,
        month: prevMonthIndex,
        year: prevYear,
        currentMonth: false,
        isToday: isSameDay(date, today),
        isSelected: isSameDay(date, selectedDate),
        events: calendarStore.getEventsForDate(date),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();

      days.push({
        day,
        date: `${date.toISOString().split('T')[0]}`,
        month,
        year,
        currentMonth: true,
        isToday: isSameDay(date, today),
        isSelected: isSameDay(date, selectedDate),
        events: calendarStore.getEventsForDate(date),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }

    // Días del mes siguiente
    const remainingCells = 42 - days.length;
    const nextYear = month === 11 ? year + 1 : year;
    const nextMonthIndex = month === 11 ? 0 : month + 1;

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(nextYear, nextMonthIndex, day);
      const dayOfWeek = date.getDay();

      days.push({
        day,
        date: `${date.toISOString().split('T')[0]}`,
        month: nextMonthIndex,
        year: nextYear,
        currentMonth: false,
        isToday: isSameDay(date, today),
        isSelected: isSameDay(date, selectedDate),
        events: calendarStore.getEventsForDate(date),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  const formatDate = (date: Date, format: 'short' | 'long' | 'numeric' = 'long'): string => {
    switch (format) {
      case 'short':
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      case 'numeric':
        return `${date.toISOString().split('T')[0]}`;
      case 'long':
      default:
        return `${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours ?? '00:00');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getWeekDays = (date: Date): Date[] => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
    start.setDate(diff);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const isEventInTimeSlot = (event: CalendarEvent, hour: number): boolean => {
    if (!event.time) return false;
    const eventHour = parseInt(`${event.time.split(':')[0]}`);
    return eventHour === hour;
  };

  const getEventDuration = (event: CalendarEvent): number => {
    if (!event.time || !event.endTime) return 1;

    const [startHour, startMinute] = event.time.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);

    const startMinutes = (startHour ?? 1) * 60 + (startMinute ?? 0);
    const endMinutes = (endHour ?? 1) * 60 + (endMinute ?? 0);

    return Math.max(1, Math.ceil((endMinutes - startMinutes) / 60));
  };

  return {
    monthNames,
    monthNamesShort,
    dayNames,
    dayNamesShort,
    dayNamesMin,
    generateCalendarDays,
    isSameDay,
    formatDate,
    formatTime,
    getWeekDays,
    isEventInTimeSlot,
    getEventDuration,
  };
};
