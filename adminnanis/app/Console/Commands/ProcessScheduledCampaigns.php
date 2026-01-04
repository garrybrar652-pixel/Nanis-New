<?php

namespace App\Console\Commands;

use App\Jobs\SendCampaignJob;
use App\Models\Campaign;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessScheduledCampaigns extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'campaigns:process-scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process and send scheduled campaigns that are due';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for scheduled campaigns...');

        // Find campaigns that are scheduled and due to be sent
        $campaigns = Campaign::where('status', Campaign::STATUS_SCHEDULED)
            ->where('scheduled_at', '<=', now())
            ->get();

        if ($campaigns->isEmpty()) {
            $this->info('No scheduled campaigns to process.');
            return 0;
        }

        $this->info("Found {$campaigns->count()} campaign(s) to process.");

        foreach ($campaigns as $campaign) {
            try {
                $this->info("Processing campaign: {$campaign->name} (ID: {$campaign->id})");
                
                // Update status to sending
                $campaign->update([
                    'status' => Campaign::STATUS_SENDING,
                    'sent_at' => now()
                ]);

                // Dispatch job to send campaign
                SendCampaignJob::dispatch($campaign);

                $this->info("✓ Campaign queued for sending: {$campaign->name}");
                Log::info("Scheduled campaign queued", ['campaign_id' => $campaign->id, 'name' => $campaign->name]);

            } catch (\Exception $e) {
                $this->error("✗ Failed to process campaign {$campaign->id}: {$e->getMessage()}");
                Log::error("Failed to process scheduled campaign", [
                    'campaign_id' => $campaign->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info('Scheduled campaigns processing complete.');
        return 0;
    }
}
