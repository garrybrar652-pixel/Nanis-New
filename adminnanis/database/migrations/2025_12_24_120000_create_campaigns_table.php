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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('emoji', 10)->default('📧');
            $table->enum('category', [
                'email',
                'website',
                'social_media',
                'sms',
                'rss',
                'ab_testing'
            ])->default('email');
            $table->enum('status', [
                'draft',
                'scheduled',
                'sending',
                'published',
                'suspended'
            ])->default('draft');
            $table->string('subject', 500)->nullable();
            $table->text('preview')->nullable();
            $table->longText('content')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            
            // Statistics
            $table->integer('total_recipients')->default(0);
            $table->integer('sent_count')->default(0);
            $table->integer('opened_count')->default(0);
            $table->integer('clicked_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index(['user_id', 'status']);
            $table->index('category');
            $table->index('scheduled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
