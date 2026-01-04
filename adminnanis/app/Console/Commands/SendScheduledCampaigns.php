<?php

namespace App\Console\Commands;

use App\Models\Campaign;
use App\Jobs\SendCampaignJob;
use Illuminate\Console\Command;

class SendScheduledCampaigns extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'campaigns:send-scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send scheduled campaigns that are ready to be sent';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $campaigns = Campaign::readyToSend()->get();

        if ($campaigns->isEmpty()) {
            $this->info('No campaigns ready to send.');
            return;
        }

        foreach ($campaigns as $campaign) {
            SendCampaignJob::dispatch($campaign);
            $this->info("Dispatched job for campaign: {$campaign->name}");
        }
    }
}
