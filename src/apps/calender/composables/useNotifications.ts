import { useQuasar } from 'quasar';
import { useAppStore } from '@stores/appStore';

export const useNotifications = () => {
  const $q = useQuasar();
  const appStore = useAppStore();

  const showSuccess = (message: string, title = 'Éxito') => {
    $q.notify({
      type: 'positive',
      message,
      position: 'top-right',
      timeout: 3000,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {},
        },
      ],
    });

    appStore.addNotification({
      title,
      message,
      type: 'success',
    });
  };

  const showError = (message: string, title = 'Error') => {
    $q.notify({
      type: 'negative',
      message,
      position: 'top-right',
      timeout: 5000,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {},
        },
      ],
    });

    appStore.addNotification({
      title,
      message,
      type: 'error',
    });
  };

  const showWarning = (message: string, title = 'Advertencia') => {
    $q.notify({
      type: 'warning',
      message,
      position: 'top-right',
      timeout: 4000,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {},
        },
      ],
    });

    appStore.addNotification({
      title,
      message,
      type: 'warning',
    });
  };

  const showInfo = (message: string, title = 'Información') => {
    $q.notify({
      type: 'info',
      message,
      position: 'top-right',
      timeout: 3000,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {},
        },
      ],
    });

    appStore.addNotification({
      title,
      message,
      type: 'info',
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
