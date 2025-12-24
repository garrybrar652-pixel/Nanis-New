<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Campaign;
use App\Models\User;

$user = User::first();

if (!$user) {
    echo "No user found!\n";
    exit(1);
}

// Campaign 1
Campaign::create([
    'user_id' => $user->id,
    'name' => 'Summer Sale Campaign',
    'emoji' => '☀️',
    'category' => 'email',
    'status' => 'draft',
    'subject' => '🎉 Exclusive Summer Deals Inside!',
    'preview' => 'Get ready for amazing discounts this summer season! Limited time offers.',
]);

echo "Created campaign: Summer Sale Campaign\n";

// Campaign 2
Campaign::create([
    'user_id' => $user->id,
    'name' => 'Newsletter Weekly Update',
    'emoji' => '📬',
    'category' => 'email',
    'status' => 'scheduled',
    'subject' => '📰 Your Weekly Newsletter',
    'preview' => 'Stay updated with the latest news, tips, and insights from our team.',
    'scheduled_at' => now()->addDays(1),
]);

echo "Created campaign: Newsletter Weekly Update\n";
echo "\nSuccessfully created 2 new campaigns!\n";
