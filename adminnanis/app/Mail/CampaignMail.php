<?php

namespace App\Mail;

use App\Models\Campaign;
use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CampaignMail extends Mailable
{
    use Queueable, SerializesModels;

    public $campaign;
    public $contact;

    /**
     * Create a new message instance.
     */
    public function __construct(Campaign $campaign, Contact $contact)
    {
        $this->campaign = $campaign;
        $this->contact = $contact;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->campaign->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.campaign',
            with: [
                'campaign' => $this->campaign,
                'contact' => $this->contact,
                'content' => $this->buildContent(),
            ],
        );
    }

    private function buildContent()
    {
        $content = $this->campaign->content;

        // Add tracking pixel for opens
        $pixel = '<img src="' . route('campaigns.track.open', ['campaign' => $this->campaign->id, 'contact' => $this->contact->id]) . '" width="1" height="1" style="display:none;" />';

        return $content . $pixel;
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
