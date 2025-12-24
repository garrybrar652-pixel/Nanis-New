<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles for the 'admin' guard if they don't exist
        if (!Role::where('name', 'admin')->where('guard_name', 'admin')->exists()) {
            Role::create(['name' => 'admin', 'guard_name' => 'admin']);
        }

        if (!Role::where('name', 'user')->where('guard_name', 'admin')->exists()) {
            Role::create(['name' => 'user', 'guard_name' => 'admin']);
        }

        // Create roles for the 'web' guard if they don't exist
        if (!Role::where('name', 'user')->where('guard_name', 'web')->exists()) {
            Role::create(['name' => 'user', 'guard_name' => 'web']);
        }
    }
}