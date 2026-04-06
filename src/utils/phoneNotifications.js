class PhoneNotificationService {
  constructor() {
    this.isConfigured = false;
    this.testMode = false; // Default to production mode
    this.testPhoneNumber = '9913390910';
    this.apiKey = null;
    this.apiEndpoint = null;
    this.productionMode = false;
  }

  // Initialize phone notification service
  initialize(config = {}) {
    // Load from environment variables first, then allow overrides
    this.apiKey = config.apiKey || import.meta.env.VITE_SMS_API_KEY;
    this.apiEndpoint = config.apiEndpoint || import.meta.env.VITE_SMS_API_ENDPOINT;
    this.testPhoneNumber = config.testPhoneNumber || import.meta.env.VITE_DEFAULT_PHONE_NUMBER || '9913390910';
    this.productionMode = config.productionMode !== undefined ? config.productionMode : 
                        (import.meta.env.VITE_PRODUCTION_MODE === 'true');
    
    // Enable test mode only if explicitly requested or not in production
    this.testMode = config.testMode !== undefined ? config.testMode : !this.productionMode;
    
    this.isConfigured = !!(this.apiKey && this.apiEndpoint);
    
    // Log initialization status (without exposing sensitive data)
    console.log('Phone Notification Service initialized:', {
      isConfigured: this.isConfigured,
      testMode: this.testMode,
      productionMode: this.productionMode,
      testPhoneNumber: this.testPhoneNumber,
      hasApiKey: !!this.apiKey,
      hasEndpoint: !!this.apiEndpoint,
      apiKeyLength: this.apiKey ? this.apiKey.length : 0
    });
  }

  // Send SMS notification
  async sendSMS(phoneNumber, message) {
    const targetNumber = this.testMode ? this.testPhoneNumber : phoneNumber;
    
    try {
      if (this.testMode) {
        // Test mode: Log message and simulate success
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
        throw new Error('SMS service not configured - missing API credentials');
      }

      console.log(`[SMS LIVE] Sending to ${targetNumber}: ${message.substring(0, 50)}...`);
      
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
      console.log(`[SMS SUCCESS] Message sent successfully to ${targetNumber}`);
      
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
      productionMode: this.productionMode,
      testPhoneNumber: this.testPhoneNumber,
      hasApiKey: !!this.apiKey,
      hasEndpoint: !!this.apiEndpoint,
      apiKeyLength: this.apiKey ? this.apiKey.length : 0
    };
  }

  // Switch to production mode
  enableProductionMode() {
    this.testMode = false;
    this.productionMode = true;
    console.log('🚀 Phone Notification Service switched to PRODUCTION MODE');
  }

  // Switch to test mode
  enableTestMode() {
    this.testMode = true;
    this.productionMode = false;
    console.log('🧪 Phone Notification Service switched to TEST MODE');
  }
}

export const phoneNotificationService = new PhoneNotificationService();
