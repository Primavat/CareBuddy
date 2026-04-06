// Production test script for phone notifications
// This script validates the live notification system

async function testLiveNotificationSystem() {
  console.log('🚀 Testing CareBuddy LIVE Notification System...');
  
  try {
    // Import services
    const { phoneNotificationService } = await import('./src/utils/phoneNotifications.js');
    const { medicationReminderSystem } = await import('./src/utils/medicationReminders.js');
    const { notificationConfig } = await import('./src/config/notifications.js');
    
    // Check configuration
    const smsConfig = notificationConfig.getSmsConfig();
    console.log('📋 SMS Configuration Status:', {
      configured: smsConfig.configured,
      productionMode: smsConfig.productionMode,
      hasApiKey: !!smsConfig.apiKey,
      hasEndpoint: !!smsConfig.endpoint,
      sender: smsConfig.sender
    });
    
    if (!smsConfig.configured) {
      console.error('❌ SMS not configured - check environment variables');
      return { success: false, error: 'Configuration missing' };
    }
    
    // Initialize in production mode
    phoneNotificationService.initialize({
      productionMode: true,
      testPhoneNumber: '9913390910'
    });
    
    await medicationReminderSystem.initialize();
    
    console.log('✅ Services initialized in PRODUCTION MODE');
    
    // Test 1: Check service status
    console.log('🔍 Test 1: Service status check...');
    const status = phoneNotificationService.getStatus();
    console.log('Service Status:', status);
    
    if (!status.productionMode) {
      console.error('❌ Not in production mode');
      return { success: false, error: 'Not in production mode' };
    }
    
    // Test 2: Send live SMS to 9913390910
    console.log('📱 Test 2: Sending LIVE SMS to 9913390910...');
    const testMedication = {
      id: 'live-test-' + Date.now(),
      name: 'Live Test Medication',
      dosage: '500mg',
      patient: 'Live Test Patient',
      time: new Date().toLocaleTimeString()
    };
    
    const smsResult = await phoneNotificationService.sendMedicationReminder(testMedication, '9913390910');
    console.log('📧 LIVE SMS Result:', smsResult);
    
    if (smsResult.success && !smsResult.testMode) {
      console.log('🎉 SUCCESS: Real SMS sent to 9913390910!');
      console.log(`📨 Message ID: ${smsResult.messageId}`);
      console.log(`⏰ Timestamp: ${smsResult.timestamp}`);
      
      return {
        success: true,
        messageId: smsResult.messageId,
        phoneNumber: '9913390910',
        timestamp: smsResult.timestamp,
        testMode: false
      };
    } else {
      console.error('❌ FAILED: SMS not sent in live mode');
      return { success: false, error: smsResult.error || 'Unknown error' };
    }
    
  } catch (error) {
    console.error('❌ Live test failed:', error);
    return { success: false, error: error.message };
  }
}

// Auto-run test
testLiveNotificationSystem();

// Make available globally
window.testLiveNotifications = testLiveNotificationSystem;
