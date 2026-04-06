import { phoneNotificationService } from './phoneNotifications';

class MedicationReminderSystem {
  constructor() {
    this.reminders = new Map();
    this.checkInterval = null;
    this.notificationPermission = null;
    this.phoneNotificationsEnabled = false;
    this.phoneNumber = null;
  }

  async initialize() {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
    }
    
    // Initialize phone notification service
    phoneNotificationService.initialize({
      testMode: true,
      testPhoneNumber: '9913390910'
    });
    
    this.phoneNotificationsEnabled = true;
    
    console.log('MedicationReminderSystem initialized with phone notifications:', {
      browserNotifications: this.notificationPermission === 'granted',
      phoneNotifications: this.phoneNotificationsEnabled
    });
    
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

  async sendNotification(medication) {
    console.log(`Sending notification for medication: ${medication.name}`);
    
    // Browser notification
    if (this.notificationPermission === 'granted') {
      try {
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
      } catch (error) {
        console.error('Browser notification failed:', error);
      }
    }

    // Phone notification (SMS)
    if (this.phoneNotificationsEnabled) {
      try {
        const smsResult = await phoneNotificationService.sendMedicationReminder(medication, this.phoneNumber);
        console.log('SMS notification result:', smsResult);
      } catch (error) {
        console.error('SMS notification failed:', error);
      }
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

  // Set phone number for SMS notifications
  setPhoneNumber(phoneNumber) {
    this.phoneNumber = phoneNumber;
    console.log(`Phone number set for notifications: ${phoneNumber}`);
  }

  // Enable/disable phone notifications
  setPhoneNotificationsEnabled(enabled) {
    this.phoneNotificationsEnabled = enabled;
    console.log(`Phone notifications ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Test notification system
  async testNotifications(phoneNumber = null) {
    console.log('Testing notification system...');
    
    const testMedication = {
      id: 'test',
      name: 'Test Medication',
      dosage: '500mg',
      patient: 'Test Patient',
      time: new Date().toLocaleTimeString()
    };
    
    // Test SMS notification
    if (this.phoneNotificationsEnabled) {
      const smsResult = await phoneNotificationService.testSMS(phoneNumber);
      console.log('SMS test result:', smsResult);
      return smsResult;
    }
    
    return { success: false, message: 'Phone notifications not enabled' };
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
