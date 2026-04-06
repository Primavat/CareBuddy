// Production notification configuration
// This file handles secure loading of notification credentials

export const notificationConfig = {
  // Load SMS configuration from environment variables
  getSmsConfig: () => {
    const apiKey = import.meta.env.VITE_SMS_API_KEY;
    const endpoint = import.meta.env.VITE_SMS_API_ENDPOINT;
    const sender = import.meta.env.VITE_SMS_SENDER || 'CareBuddy';
    
    // Validate required fields
    if (!apiKey || !endpoint) {
      console.warn('SMS configuration incomplete - check environment variables');
      return {
        configured: false,
        error: 'Missing API credentials'
      };
    }
    
    return {
      configured: true,
      apiKey,
      endpoint,
      sender,
      productionMode: import.meta.env.VITE_PRODUCTION_MODE === 'true'
    };
  },
  
  // Get default phone number for testing
  getDefaultPhoneNumber: () => {
    return import.meta.env.VITE_DEFAULT_PHONE_NUMBER || '9913390910';
  },
  
  // Check if in production mode
  isProduction: () => {
    return import.meta.env.VITE_PRODUCTION_MODE === 'true';
  }
};
