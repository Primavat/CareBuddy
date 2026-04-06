// Test script for phone notifications
// Run this in the browser console to test the notification system

async function testPhoneNotifications() {
  console.log('🧪 Testing CareBuddy Phone Notification System...');
  
  try {
    // Import the notification service
    const { phoneNotificationService } = await import('./src/utils/phoneNotifications.js');
    const { medicationReminderSystem } = await import('./src/utils/medicationReminders.js');
    
    // Initialize services
    phoneNotificationService.initialize({
      testMode: true,
      testPhoneNumber: '9913390910'
    });
    
    await medicationReminderSystem.initialize();
    
    console.log('✅ Services initialized successfully');
    
    // Test 1: Direct SMS test
    console.log('📱 Test 1: Direct SMS test...');
    const smsResult = await phoneNotificationService.testSMS('9913390910');
    console.log('SMS Test Result:', smsResult);
    
    // Test 2: Medication reminder test
    console.log('💊 Test 2: Medication reminder test...');
    const testMedication = {
      id: 'test-' + Date.now(),
      name: 'Paracetamol',
      dosage: '500mg',
      patient: 'Test Patient',
      time: '12:00 PM'
    };
    
    const reminderResult = await medicationReminderSystem.testNotifications('9913390910');
    console.log('Reminder Test Result:', reminderResult);
    
    // Test 3: Check service status
    console.log('🔍 Test 3: Service status check...');
    const phoneStatus = phoneNotificationService.getStatus();
    console.log('Phone Service Status:', phoneStatus);
    
    console.log('🎉 All tests completed!');
    
    return {
      smsTest: smsResult,
      reminderTest: reminderResult,
      serviceStatus: phoneStatus
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { error: error.message };
  }
}

// Auto-run test
testPhoneNotifications();

// Also make it available globally
window.testPhoneNotifications = testPhoneNotifications;
