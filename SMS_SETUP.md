# SMS Provider Setup Guide

## 🚀 Quick Setup (5 minutes)

### Option 1: Twilio (Recommended for testing)
1. **Sign up**: https://www.twilio.com/try-twilio
2. **Get credentials**: From Console → Settings → API Keys
3. **Update .env**:
   ```bash
   VITE_SMS_API_KEY=your_twilio_api_key
   VITE_SMS_API_ENDPOINT=https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json
   ```

### Option 2: AWS SNS
1. **Create IAM user** with SNS permissions
2. **Get access keys** from AWS Console
3. **Update .env**:
   ```bash
   VITE_SMS_API_KEY=your_aws_access_key
   VITE_SMS_API_ENDPOINT=https://sns.us-east-1.amazonaws.com/
   ```

### Option 3: Any REST SMS Provider
1. **Get API key** from your provider
2. **Get endpoint URL** for sending SMS
3. **Update .env** with your credentials

## 🔧 What You Need to Replace

**In your `.env` file:**
- `your_sms_api_key_here` → Your actual API key
- `https://api.your-sms-provider.com/send` → Your provider's endpoint

## ✅ Test After Setup

1. Restart your application (npm run dev)
2. Click "🚀 Send LIVE SMS" button
3. Check console for `[SMS SUCCESS]` message
4. Verify SMS received on 9913390910

## 🆘 If You Don't Have SMS Provider

Use a test service like:
- **Twilio Trial** (Free for testing)
- **MessageBird** (Free tier available)
- **Textlocal** (Free credits for testing)

The system will work with any REST API-based SMS service!
