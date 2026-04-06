class PhoneNotificationService {
  constructor() {
    this.isConfigured = false;
    this.testMode = true; // Enable test mode for development
    this.testPhoneNumber = '9913390910';
    this.apiKey = null;
    this.apiEndpoint = null;
  }

  // Initialize the phone notification service
  initialize(config = {}) {
    this.apiKey = config.apiKey || process.env.VITE_SMS_API_KEY;
    this.apiEndpoint = config.apiEndpoint || process.env.VITE_SMS_API_ENDPOINT;
    this.testPhoneNumber = config.testPhoneNumber || this.testPhoneNumber;
    this.testMode = config.testMode !== false; // Default to test mode
    
    this.isConfigured = !!(this.apiKey && this.apiEndpoint);
    
    // Log initialization status
    console.log('Phone Notification Service initialized:', {
      isConfigured: this.isConfigured,
      testMode: this.testMode,
      testPhoneNumber: this.testPhoneNumber
    });
  }

  // Send SMS notification
  async sendSMS(phoneNumber, message) {
    const targetNumber = this.testMode ? this.testPhoneNumber : phoneNumber;
    
    try {
      if (this.testMode) {
        // Test mode: Log the message and simulate success
        console.log(`[SMS TEST] To: ${targetNumber}, Message: "${message}"`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          messageId: `test_${Date.now()}`,
          timestamp: new Date().toISOString(),
          testMode: true,
          targetNumber
        };
      }

      if (!this.isConfigured) {
        throw new Error('SMS service not configured');
      }

      // Real SMS API call (using a generic SMS service structure)
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to: targetNumber,
          message: message,
          sender: 'CareBuddy'
        })
      });

      if (!response.ok) {
        throw new Error(`SMS API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
        testMode: false,
        targetNumber
      };

    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        targetNumber
      };
    }
  }

  // Send medication reminder via SMS
  async sendMedicationReminder(medication, phoneNumber = null) {
    const message = `CareBuddy Reminder: Time to take ${medication.name} (${medication.dosage}) for ${medication.patient}. Please take your medication now.`;
    
    const result = await this.sendSMS(phoneNumber, message);
    
    // Log the result for debugging
    console.log('Medication reminder SMS result:', result);
    
    return result;
  }

  // Send refill alert via SMS
  async sendRefillAlert(medication, phoneNumber = null) {
    const message = `CareBuddy Alert: ${medication.name} is running low. Current stock: ${medication.currentStock}. Please refill soon to avoid interruption.`;
    
    const result = await this.sendSMS(phoneNumber, message);
    
    console.log('Refill alert SMS result:', result);
    
    return result;
  }

  // Test the SMS service
  async testSMS(phoneNumber = null) {
    const message = `CareBuddy Test: This is a test notification to verify SMS service is working. Time: ${new Date().toLocaleString()}`;
    
    console.log('Testing SMS service...');
    const result = await this.sendSMS(phoneNumber, message);
    
    if (result.success) {
      console.log(`✅ SMS test successful! Message sent to ${result.targetNumber}`);
    } else {
      console.error(`❌ SMS test failed: ${result.error}`);
    }
    
    return result;
  }

  // Check service status
  getStatus() {
    return {
      isConfigured: this.isConfigured,
      testMode: this.testMode,
      testPhoneNumber: this.testPhoneNumber,
      hasApiKey: !!this.apiKey,
      hasEndpoint: !!this.apiEndpoint
    };
  }
}

export const phoneNotificationService = new PhoneNotificationService();
