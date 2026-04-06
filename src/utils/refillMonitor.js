import { phoneNotificationService } from './phoneNotifications';

class RefillMonitor {
  constructor() {
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
    
    console.log('RefillMonitor initialized with phone notifications:', {
      browserNotifications: this.notificationPermission === 'granted',
      phoneNotifications: this.phoneNotificationsEnabled
    });
    
    this.startMonitoring();
  }

  startMonitoring() {
    if (this.checkInterval) clearInterval(this.checkInterval);
    
    // Check every 6 hours for refill alerts
    this.checkInterval = setInterval(() => {
      this.checkRefillAlerts();
    }, 6 * 60 * 60 * 1000);
    
    // Also check immediately on initialization
    this.checkRefillAlerts();
  }

  checkRefillAlerts() {
    const medications = JSON.parse(localStorage.getItem('carebuddy_medications') || '[]');
    const alerts = [];

    medications.forEach(med => {
      if (med.currentStock <= med.lowStockThreshold) {
        alerts.push({
          type: 'low_stock',
          medication: med,
          message: `Low stock alert: ${med.name} has only ${med.currentStock} tablets left.`
        });
      }

      if (med.refillReminder && this.needsRefillSoon(med)) {
        alerts.push({
          type: 'refill_reminder',
          medication: med,
          message: `Refill reminder: ${med.name} will run out soon. Consider refilling in the next ${med.refillDaysBefore} days.`
        });
      }
    });

    alerts.forEach(alert => {
      this.sendAlert(alert);
    });
  }

  needsRefillSoon(medication) {
    if (!medication.refillReminder) return false;
    
    // Estimate days remaining based on frequency
    let dailyUsage = 1;
    switch (medication.frequency) {
      case 'daily':
        dailyUsage = 1;
        break;
      case 'weekly':
        dailyUsage = 1 / 7;
        break;
      case 'monthly':
        dailyUsage = 1 / 30;
        break;
      case 'as_needed':
        return false; // Can't predict for as-needed medications
      default:
        dailyUsage = 1;
    }

    const daysRemaining = medication.currentStock / dailyUsage;
    return daysRemaining <= medication.refillDaysBefore;
  }

  async sendAlert(alert) {
    console.log(`Sending refill alert: ${alert.message}`);
    
    // Browser notification
    if (this.notificationPermission === 'granted') {
      try {
        const notification = new Notification('Medication Alert', {
          body: alert.message,
          icon: '/favicon.svg',
          tag: `medication-${alert.type}-${alert.medication.id}`,
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
        const smsResult = await phoneNotificationService.sendRefillAlert(alert.medication, this.phoneNumber);
        console.log('SMS alert result:', smsResult);
      } catch (error) {
        console.error('SMS alert failed:', error);
      }
    }

    // Also show in-app notification
    this.showInAppAlert(alert);
  }

  showInAppAlert(alert) {
    const event = new CustomEvent('medicationAlert', {
      detail: alert
    });
    window.dispatchEvent(event);
  }

  updateStock(medicationId, newStock) {
    const medications = JSON.parse(localStorage.getItem('carebuddy_medications') || '[]');
    const updatedMeds = medications.map(med => 
      med.id === medicationId ? { ...med, currentStock: newStock } : med
    );
    localStorage.setItem('carebuddy_medications', JSON.stringify(updatedMeds));
    
    // Check for alerts after stock update
    setTimeout(() => this.checkRefillAlerts(), 1000);
  }

  getStockStatus(medication) {
    const { currentStock, lowStockThreshold } = medication;
    
    if (currentStock === 0) return { status: 'out', color: 'red', message: 'Out of stock' };
    if (currentStock <= lowStockThreshold) return { status: 'low', color: 'orange', message: 'Low stock' };
    if (this.needsRefillSoon(medication)) return { status: 'refill_soon', color: 'yellow', message: 'Refill soon' };
    return { status: 'good', color: 'green', message: 'Stock OK' };
  }

  // Set phone number for SMS notifications
  setPhoneNumber(phoneNumber) {
    this.phoneNumber = phoneNumber;
    console.log(`Phone number set for refill alerts: ${phoneNumber}`);
  }

  // Enable/disable phone notifications
  setPhoneNotificationsEnabled(enabled) {
    this.phoneNotificationsEnabled = enabled;
    console.log(`Refill alerts phone notifications ${enabled ? 'enabled' : 'disabled'}`);
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

export const refillMonitor = new RefillMonitor();
