class MedicationReminderSystem {
  constructor() {
    this.reminders = new Map();
    this.checkInterval = null;
    this.notificationPermission = null;
  }

  async initialize() {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
    }
    this.startReminderCheck();
  }

  startReminderCheck() {
    if (this.checkInterval) clearInterval(this.checkInterval);
    
    this.checkInterval = setInterval(() => {
      this.checkReminders();
    }, 60000); // Check every minute
  }

  addReminder(medication) {
    const reminderTime = this.parseTime(medication.time);
    const now = new Date();
    const reminderDate = new Date(now);
    reminderDate.setHours(reminderTime.hours, reminderTime.minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    this.reminders.set(medication.id, {
      ...medication,
      reminderTime: reminderDate,
      notified: false
    });
  }

  parseTime(timeString) {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return { hours, minutes };
  }

  checkReminders() {
    const now = new Date();
    
    this.reminders.forEach((reminder, id) => {
      if (!reminder.notified && now >= reminder.reminderTime) {
        this.sendNotification(reminder);
        reminder.notified = true;
        
        // Schedule next day's reminder
        const nextReminder = new Date(reminder.reminderTime);
        nextReminder.setDate(nextReminder.getDate() + 1);
        reminder.reminderTime = nextReminder;
        reminder.notified = false;
      }
    });
  }

  sendNotification(medication) {
    if (this.notificationPermission === 'granted') {
      const notification = new Notification('Medication Reminder', {
        body: `Time to take ${medication.name} (${medication.dosage}) for ${medication.patient}`,
        icon: '/favicon.svg',
        tag: `medication-${medication.id}`,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // Also show in-app notification
    this.showInAppNotification(medication);
  }

  showInAppNotification(medication) {
    // Create a custom event that components can listen for
    const event = new CustomEvent('medicationReminder', {
      detail: medication
    });
    window.dispatchEvent(event);
  }

  removeReminder(medicationId) {
    this.reminders.delete(medicationId);
  }

  updateReminder(medication) {
    this.addReminder(medication); // This will update the existing reminder
  }

  clearAllReminders() {
    this.reminders.clear();
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.clearAllReminders();
  }
}

export const medicationReminderSystem = new MedicationReminderSystem();
