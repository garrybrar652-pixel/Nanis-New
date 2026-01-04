<?php

namespace App\Jobs;

use App\Models\Campaign;
use App\Models\Contact;
use App\Mail\CampaignMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendCampaignJob implements ShouldQueue
{
    use Queueable;

    protected $campaign;

    /**
     * Create a new job instance.
     */
    public function __construct(Campaign $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->campaign->update(['status' => Campaign::STATUS_SENDING]);

        $contacts = $this->getContacts();

        $this->campaign->update(['total_recipients' => $contacts->count()]);

        $contacts->chunk(100)->each(function ($chunk) {
            foreach ($chunk as $contact) {
                Mail::to($contact->email)->send(new CampaignMail($this->campaign, $contact));
                $this->campaign->increment('sent_count');
            }
            sleep(1); // Delay to avoid rate limits
        });

        $this->campaign->update([
            'status' => Campaign::STATUS_PUBLISHED,
            'sent_at' => now(),
        ]);
    }

    private function getContacts()
    {
        return Contact::whereIn('group_id', $this->campaign->groups->pluck('id'))
                      ->where('is_subscribed', true)
                      ->get();
    }
}
