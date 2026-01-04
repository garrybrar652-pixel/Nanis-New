# 📅 Scheduled Campaign Setup Guide

## ✅ What's Done

1. ✅ **Command Created**: `campaigns:process-scheduled` - Checks every minute for campaigns ready to send
2. ✅ **Laravel Scheduler Configured**: Registered in `routes/console.php`
3. ✅ **Frontend Updated**: Can now schedule campaigns with date/time picker
4. ✅ **Queue Worker Running**: Processing email sending jobs
5. ✅ **SMTP Configured**: Gmail SMTP ready to send emails

## 🔧 Next Step: Windows Task Scheduler Setup

To automatically run scheduled campaigns, you need to set up Windows Task Scheduler to run the Laravel scheduler every minute.

### Option 1: Quick PowerShell Command (Recommended)

Run this command in PowerShell **as Administrator**:

```powershell
$action = New-ScheduledTaskAction -Execute 'C:\php\php.exe' -Argument 'artisan schedule:run' -WorkingDirectory 'C:\lovepreet\Nanis New\adminnanis'
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration ([TimeSpan]::MaxValue)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName "Laravel Scheduler - Nanis" -Action $action -Trigger $trigger -Settings $settings -Description "Runs Laravel scheduler every minute for Nanis campaign system"
```

**Note**: Update `C:\php\php.exe` to your actual PHP path. Find it with: `Get-Command php`

### Option 2: Manual Setup (Task Scheduler GUI)

1. **Open Task Scheduler**
   - Press `Win + R`
   - Type `taskschd.msc`
   - Press Enter

2. **Create Task**
   - Click "Create Basic Task" (right sidebar)
   - Name: `Laravel Scheduler - Nanis`
   - Description: `Runs Laravel scheduler for campaign system`
   - Click "Next"

3. **Trigger**
   - Select "Daily"
   - Start: Today at 12:00 AM
   - Click "Next"

4. **Action**
   - Select "Start a program"
   - Click "Next"
   - Program/script: `C:\php\php.exe` (your PHP path)
   - Add arguments: `artisan schedule:run`
   - Start in: `C:\lovepreet\Nanis New\adminnanis`
   - Click "Next", then "Finish"

5. **Configure Repetition**
   - Right-click your new task → "Properties"
   - Go to "Triggers" tab
   - Double-click the trigger
   - Check "Repeat task every" → Select "1 minute"
   - Duration: "Indefinitely"
   - Click "OK"

6. **Additional Settings**
   - Go to "Conditions" tab
   - **Uncheck** "Start only if on AC power"
   - Click "OK"

## 🧪 Testing Scheduled Campaigns

### Test 1: Create a Scheduled Campaign

1. **Frontend**: Go to http://localhost:5173/campaigns/create
2. **Fill Details**:
   - Name: "Scheduled Test Campaign"
   - Subject: "Scheduled Email Test"
   - Content: Add some test content
   - Recipients: Select "Test Campaign Group"
   
3. **Set Schedule**:
   - Choose "Schedule for later"
   - Set date: Today
   - Set time: 2 minutes from now
   - Click "Save & Continue"

4. **Verify**:
   - Check `adminnanis` database → `campaigns` table
   - Status should be "scheduled"
   - `scheduled_at` should match your time

5. **Wait & Check**:
   - After the scheduled time passes (wait 2-3 minutes)
   - Run manually: `php artisan campaigns:process-scheduled`
   - Check your email (dhillonlovepreet147@gmail.com)
   - Campaign status should change to "sending" then "published"

### Test 2: Send Immediately

1. **Frontend**: Go to http://localhost:5173/campaigns/test
2. **Fill form and click "Create & Send Test Campaign"**
3. **Check email immediately** (no waiting needed)

## 📊 Monitoring

### Check Queue Jobs
```powershell
cd "c:\lovepreet\Nanis New\adminnanis"
php artisan queue:work database --tries=3 --timeout=90
```
Keep this running in a separate terminal!

### Check Scheduled Campaigns
```powershell
php artisan campaigns:process-scheduled
```

### View Laravel Logs
```powershell
Get-Content "C:\lovepreet\Nanis New\adminnanis\storage\logs\laravel.log" -Tail 50
```

## 🚀 How It Works

1. **User schedules campaign** → Saved with status "scheduled" and `scheduled_at` timestamp
2. **Windows Task Scheduler** → Runs `php artisan schedule:run` every minute
3. **Laravel Scheduler** → Triggers `campaigns:process-scheduled` command
4. **Process Command** → Finds campaigns where `scheduled_at <= now()` and status is "scheduled"
5. **Dispatch Job** → Changes status to "sending" and queues `SendCampaignJob`
6. **Queue Worker** → Processes job and sends emails to all contacts in selected groups
7. **Complete** → Campaign status changed to "published"

## 📧 Email Delivery Flow

```
Campaign Created (scheduled)
    ↓
Windows Task Scheduler (every 1 min)
    ↓
campaigns:process-scheduled command
    ↓
Status: scheduled → sending
    ↓
SendCampaignJob dispatched to queue
    ↓
Queue Worker picks up job
    ↓
Fetches contacts from selected groups
    ↓
Sends emails (100 per batch, 1 sec delay)
    ↓
Status: sending → published
    ↓
Email delivered! ✉️
```

## ✅ Checklist

- [ ] Queue worker running (`php artisan queue:work database --tries=3 --timeout=90`)
- [ ] Windows Task Scheduler configured (runs every 1 minute)
- [ ] Test contacts created (Group ID: 7)
- [ ] Frontend .env configured (`VITE_API_BASE_URL`)
- [ ] Backend .env has SMTP credentials
- [ ] Test scheduled campaign created
- [ ] Received test email

## 🆘 Troubleshooting

**Campaign not sending at scheduled time?**
- Check if Task Scheduler task is enabled
- Verify Task Scheduler is running: `Get-Service schedule | Select-Object Status`
- Check logs: `storage/logs/laravel.log`

**Emails not arriving?**
- Verify queue worker is running
- Check SMTP credentials in `.env`
- Look for errors in Laravel logs
- Test with: `php artisan campaigns:process-scheduled` manually

**"No scheduled campaigns to process"?**
- Check campaign status in database (should be "scheduled")
- Verify `scheduled_at` is in the past
- Confirm `scheduled_at` timezone matches server timezone
