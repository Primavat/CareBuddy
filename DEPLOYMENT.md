# CareBuddy Live SMS Notification Deployment Guide

## 🚀 Production Setup

### 1. Environment Configuration

Create a `.env` file in the project root with your live SMS credentials:

```bash
# SMS Service Configuration (REQUIRED)
VITE_SMS_API_KEY=your_live_production_api_key_here
VITE_SMS_API_ENDPOINT=https://api.your-sms-provider.com/v1/send
VITE_SMS_SENDER=CareBuddy

# Production Mode (REQUIRED)
VITE_PRODUCTION_MODE=true

# Optional: Default phone number for testing
VITE_DEFAULT_PHONE_NUMBER=9913390910
```

### 2. SMS Provider Setup

The system supports any REST API-based SMS provider. Configure your provider's endpoint:

**Example for Twilio:**
```bash
VITE_SMS_API_KEY=your_twilio_api_key
VITE_SMS_API_ENDPOINT=https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json
```

**Example for AWS SNS:**
```bash
VITE_SMS_API_KEY=your_aws_credentials
VITE_SMS_API_ENDPOINT=https://sns.us-east-1.amazonaws.com/
```

### 3. Security Notes

- ✅ Credentials are loaded from environment variables (secure)
- ✅ No hardcoded secrets in source code
- ✅ API keys are never logged in production
- ✅ Test mode available for development

### 4. Testing Live System

#### Option A: Using the App Interface
1. Open CareBuddy application
2. Navigate to Medications section
3. Click "🚀 Send LIVE SMS" button
4. Check phone 9913390910 for SMS

#### Option B: Using Browser Console
```javascript
// Load and run live test
import('./test-live-notifications.js')
```

### 5. Validation Checklist

- [ ] Environment variables configured
- [ ] SMS provider credentials valid
- [ ] Production mode enabled (`VITE_PRODUCTION_MODE=true`)
- [ ] Test SMS received on phone
- [ ] Console shows `[SMS SUCCESS]` messages
- [ ] No API key exposure in logs

### 6. Rollback Plan

If issues occur, switch back to test mode:

```javascript
// In browser console
import('./src/utils/phoneNotifications.js').then(m => {
  m.phoneNotificationService.enableTestMode();
});
```

Or set environment variable:
```bash
VITE_PRODUCTION_MODE=false
```

## 📱 Expected Live Behavior

### Successful SMS Delivery
```
🚀 Testing LIVE SMS notification to 9913390910...
[SMS LIVE] Sending to 9913390910: CareBuddy Reminder: Time to take...
[SMS SUCCESS] Message sent successfully to 9913390910
🎉 SUCCESS: Real SMS notification delivered to 9913390910
```

### Error Handling
- Missing credentials: "SMS service not configured - missing API credentials"
- API failures: Detailed error messages in console
- Network issues: Timeout and retry logic

## 🔧 Troubleshooting

### Common Issues

1. **SMS not sending**
   - Check `VITE_SMS_API_KEY` is correct
   - Verify `VITE_SMS_API_ENDPOINT` is accessible
   - Ensure `VITE_PRODUCTION_MODE=true`

2. **Test mode still active**
   - Restart application after setting environment variables
   - Clear browser cache/localStorage

3. **API authentication errors**
   - Verify API key format with provider
   - Check endpoint URL is correct

## 📊 Monitoring

Monitor these console logs:
- `[SMS LIVE]` - Real SMS being sent
- `[SMS SUCCESS]` - Successful delivery
- `[SMS TEST]` - Test mode active

## 🎯 Production Confirmation

When live system is working:
- ✅ Button shows "🚀 Send LIVE SMS" (red color)
- ✅ Console logs show `[SMS LIVE]` messages
- ✅ Real SMS received on phone 9913390910
- ✅ Message ID returned from API
- ✅ No test mode indicators in logs
