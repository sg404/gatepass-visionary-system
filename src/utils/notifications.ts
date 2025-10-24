export interface Notification {
  id: string;
  type: 'violation' | 'suspended' | 'unauthorized' | 'system';
  title: string;
  message: string;
  plateNumber?: string;
  timestamp: string;
  acknowledged: boolean;
  priority: 'low' | 'medium' | 'high';
}

const NOTIFICATIONS_STORAGE_KEY = 'smart_vehicle_gate_pass_notifications';

export const getNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
};

export const saveNotifications = (notifications: Notification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};

export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'acknowledged'>): Notification => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: `N${String(notifications.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toLocaleString(),
    acknowledged: false,
  };

  notifications.unshift(newNotification); // Add to beginning
  saveNotifications(notifications);
  return newNotification;
};

export const acknowledgeNotification = (id: string): void => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications[index].acknowledged = true;
    saveNotifications(notifications);
  }
};

export const getUnacknowledgedNotifications = (): Notification[] => {
  return getNotifications().filter(n => !n.acknowledged);
};

export const clearOldNotifications = (daysOld: number = 7): void => {
  const notifications = getNotifications();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const filtered = notifications.filter(n => new Date(n.timestamp) > cutoffDate);
  saveNotifications(filtered);
};
