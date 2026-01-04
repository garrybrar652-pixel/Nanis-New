<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestContactSeeder extends Seeder
{
    /**
     * Run the database seeds for testing email campaigns.
     */
    public function run(): void
    {
        // Get the first user
        $user = User::first();
        
        if (!$user) {
            echo "❌ No user found. Please create a user first.\n";
            return;
        }

        // Create Test Group
        $testGroup = Group::firstOrCreate(
            ['name' => 'Test Campaign Group', 'user_id' => $user->id],
            [
                'description' => 'Test group for email campaign testing',
                'contact_count' => 0,
            ]
        );

        // Test contacts - Add your email to receive test campaigns
        $testContacts = [
            [
                'first_name' => 'Test',
                'last_name' => 'User 1',
                'email' => 'dhillonlovepreet147@gmail.com', // Will receive test emails
                'company' => 'Test Company',
                'is_subscribed' => true,
            ],
            [
                'first_name' => 'Test',
                'last_name' => 'User 2',
                'email' => 'dhillonlovepreet147@gmail.com', // Same email for testing
                'company' => 'Demo Corp',
                'is_subscribed' => true,
            ],
        ];

        echo "\n🔄 Creating test contacts...\n";
        
        foreach ($testContacts as $contactData) {
            $contact = Contact::updateOrCreate(
                ['email' => $contactData['email'], 'user_id' => $user->id],
                array_merge($contactData, [
                    'user_id' => $user->id,
                    'group_id' => $testGroup->id,
                ])
            );
            
            echo "✅ Created: {$contact->first_name} {$contact->last_name} ({$contact->email})\n";
        }

        // Update group contact count
        $testGroup->updateContactCount();

        echo "\n✨ Test data created!\n";
        echo "📧 Group: '{$testGroup->name}' - ID: {$testGroup->id} ({$testGroup->contact_count} contacts)\n";
        echo "👤 User: {$user->name} (ID: {$user->id})\n\n";
        echo "📝 NOTE: Use Group ID {$testGroup->id} when creating campaigns\n\n";
    }
}
