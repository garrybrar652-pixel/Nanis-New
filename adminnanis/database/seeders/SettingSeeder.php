<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'app_name',
                'value' => 'Unified Inbox',
                'type' => 'string',
                'description' => 'Application name displayed in the interface',
                'group' => 'general',
                'is_public' => true,
            ],
            [
                'key' => 'app_version',
                'value' => '1.0.0',
                'type' => 'string',
                'description' => 'Current application version',
                'group' => 'general',
                'is_public' => true,
            ],
            [
                'key' => 'maintenance_mode',
                'value' => '0',
                'type' => 'boolean',
                'description' => 'Enable maintenance mode',
                'group' => 'system',
                'is_public' => false,
            ],
            [
                'key' => 'max_upload_size',
                'value' => '10',
                'type' => 'integer',
                'description' => 'Maximum file upload size in MB',
                'group' => 'system',
                'is_public' => false,
            ],
            [
                'key' => 'email_config',
                'value' => '{"host":"smtp.example.com","port":587,"encryption":"tls"}',
                'type' => 'json',
                'description' => 'Email configuration settings',
                'group' => 'email',
                'is_public' => false,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}