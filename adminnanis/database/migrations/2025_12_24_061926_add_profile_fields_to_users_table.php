<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('job_title')->nullable()->after('name');
            $table->string('company')->nullable()->after('job_title');
            $table->string('avatar')->nullable()->after('email');
            $table->string('phone', 20)->nullable()->after('email');
            $table->text('bio')->nullable()->after('email_verified_at');
            $table->boolean('is_verified')->default(false)->after('email_verified_at');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['job_title', 'company', 'avatar', 'phone', 'bio', 'is_verified']);
            $table->dropSoftDeletes();
        });
    }
};
