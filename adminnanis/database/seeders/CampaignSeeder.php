<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user to assign campaigns to
        $user = User::first();

        if (!$user) {
            $this->command->error('No users found! Please create a user first.');
            return;
        }

        $this->command->info('Seeding campaigns for user: ' . $user->email);

        // Draft campaigns
        $draftCampaigns = [
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚀',
                'category' => 'email',
                'status' => 'draft',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => null,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '📁',
                'category' => 'website',
                'status' => 'draft',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => null,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚧',
                'category' => 'social_media',
                'status' => 'draft',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => null,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚀',
                'category' => 'email',
                'status' => 'draft',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => null,
            ],
        ];

        // Scheduled campaigns
        $scheduledCampaigns = [
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚀',
                'category' => 'email',
                'status' => 'scheduled',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => now()->addDays(3),
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚧',
                'category' => 'social_media',
                'status' => 'scheduled',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => now()->addDays(5),
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '📁',
                'category' => 'website',
                'status' => 'scheduled',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => now()->addDays(7),
            ],
        ];

        // Sending campaigns
        $sendingCampaigns = [
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '📁',
                'category' => 'website',
                'status' => 'sending',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'sent_at' => now(),
                'total_recipients' => 1000,
                'sent_count' => 450,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚀',
                'category' => 'email',
                'status' => 'sending',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'sent_at' => now(),
                'total_recipients' => 800,
                'sent_count' => 320,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚧',
                'category' => 'social_media',
                'status' => 'sending',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'sent_at' => now(),
                'total_recipients' => 600,
                'sent_count' => 250,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚧',
                'category' => 'sms',
                'status' => 'sending',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'sent_at' => now(),
                'total_recipients' => 500,
                'sent_count' => 200,
            ],
        ];

        // Published campaigns
        $publishedCampaigns = [
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚧',
                'category' => 'social_media',
                'status' => 'published',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'sent_at' => now()->subDays(2),
                'total_recipients' => 1500,
                'sent_count' => 1500,
                'opened_count' => 750,
                'clicked_count' => 150,
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚧',
                'category' => 'website',
                'status' => 'published',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'sent_at' => now()->subDays(5),
                'total_recipients' => 2000,
                'sent_count' => 2000,
                'opened_count' => 1200,
                'clicked_count' => 400,
            ],
        ];

        // Suspended campaigns
        $suspendedCampaigns = [
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚧',
                'category' => 'social_media',
                'status' => 'suspended',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => now()->addDays(1),
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '🚀',
                'category' => 'email',
                'status' => 'suspended',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => now()->addDays(2),
            ],
            [
                'user_id' => $user->id,
                'name' => 'Element of Design Test',
                'emoji' => '📁',
                'category' => 'website',
                'status' => 'suspended',
                'subject' => '🥳 Want More Offers?',
                'preview' => 'Hi (First Name) Hope you are doing well, We would like to share our ideas.',
                'content' => null,
                'scheduled_at' => now()->addDays(4),
            ],
        ];

        // Insert all campaigns
        $allCampaigns = array_merge(
            $draftCampaigns,
            $scheduledCampaigns,
            $sendingCampaigns,
            $publishedCampaigns,
            $suspendedCampaigns
        );

        foreach ($allCampaigns as $campaign) {
            Campaign::create($campaign);
        }

        $this->command->info('Successfully seeded ' . count($allCampaigns) . ' campaigns!');
    }
}
