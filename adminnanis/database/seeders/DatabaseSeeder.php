<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;



class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
        ]);

        // Create roles for the 'admin' guard
        $admin_role = Role::create(['name' => 'admin', 'guard_name' => 'admin']);
        $user_role = Role::create(['name' => 'user', 'guard_name' => 'admin']);

        $admin->assignRole($admin_role);
        $user->assignRole($user_role);

        // Seed settings
        $this->call([
            SettingSeeder::class,
        ]);
    }
}
