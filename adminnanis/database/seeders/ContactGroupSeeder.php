<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user or create one for testing
        $user = User::first();
        
        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Create sample groups
        $groups = [
            [
                'name' => 'Dubai Communities',
                'description' => 'Contacts from Dubai area',
            ],
            [
                'name' => 'SG&A Communities',
                'description' => 'Sales, General and Administrative contacts',
            ],
            [
                'name' => 'New year 2025 registered',
                'description' => 'Contacts registered in 2025',
            ],
            [
                'name' => 'European people',
                'description' => 'Contacts from European countries',
            ],
            [
                'name' => 'Indonesian people',
                'description' => 'Contacts from Indonesia',
            ],
        ];

        foreach ($groups as $groupData) {
            $group = Group::create([
                'user_id' => $user->id,
                'name' => $groupData['name'],
                'description' => $groupData['description'],
            ]);

            // Create 5-10 sample contacts for each group
            $contactCount = rand(5, 10);
            for ($i = 0; $i < $contactCount; $i++) {
                Contact::create([
                    'user_id' => $user->id,
                    'group_id' => $group->id,
                    'first_name' => fake()->firstName(),
                    'last_name' => fake()->lastName(),
                    'email' => fake()->unique()->safeEmail(),
                    'phone' => fake()->phoneNumber(),
                    'company' => fake()->company(),
                    'country' => fake()->country(),
                    'city' => fake()->city(),
                    'state' => fake()->state(),
                    'zip_code' => fake()->postcode(),
                    'is_subscribed' => fake()->boolean(80), // 80% subscribed
                ]);
            }

            // Update group contact count
            $group->updateContactCount();
        }

        // Create some contacts without groups
        for ($i = 0; $i < 15; $i++) {
            Contact::create([
                'user_id' => $user->id,
                'group_id' => null,
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'email' => fake()->unique()->safeEmail(),
                'phone' => fake()->phoneNumber(),
                'company' => fake()->company(),
                'country' => fake()->country(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'zip_code' => fake()->postcode(),
                'is_subscribed' => fake()->boolean(80),
            ]);
        }
    }
}
