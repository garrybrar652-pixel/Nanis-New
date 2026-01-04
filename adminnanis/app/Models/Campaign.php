<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'emoji',
        'category',
        'status',
        'subject',
        'preview',
        'content',
        'scheduled_at',
        'sent_at',
        'total_recipients',
        'sent_count',
        'opened_count',
        'clicked_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'total_recipients' => 'integer',
        'sent_count' => 'integer',
        'opened_count' => 'integer',
        'clicked_count' => 'integer',
    ];

    /**
     * Campaign categories
     */
    const CATEGORY_EMAIL = 'email';
    const CATEGORY_WEBSITE = 'website';
    const CATEGORY_SOCIAL_MEDIA = 'social_media';
    const CATEGORY_SMS = 'sms';
    const CATEGORY_RSS = 'rss';
    const CATEGORY_AB_TESTING = 'ab_testing';

    /**
     * Campaign statuses
     */
    const STATUS_DRAFT = 'draft';
    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_SENDING = 'sending';
    const STATUS_PUBLISHED = 'published';
    const STATUS_SUSPENDED = 'suspended';

    /**
     * Get the user that owns the campaign.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the groups associated with the campaign.
     */
    public function groups()
    {
        return $this->belongsToMany(Group::class);
    }

    /**
     * Scope a query to only include campaigns of a given status.
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include campaigns of a given category.
     */
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to only include campaigns for a specific user.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include scheduled campaigns.
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED)
                     ->whereNotNull('scheduled_at')
                     ->where('scheduled_at', '>', now());
    }

    /**
     * Scope a query to only include campaigns ready to send.
     */
    public function scopeReadyToSend($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED)
                     ->whereNotNull('scheduled_at')
                     ->where('scheduled_at', '<=', now());
    }

    /**
     * Calculate open rate percentage.
     */
    public function getOpenRateAttribute()
    {
        if ($this->sent_count === 0) {
            return 0;
        }
        return round(($this->opened_count / $this->sent_count) * 100, 2);
    }

    /**
     * Calculate click rate percentage.
     */
    public function getClickRateAttribute()
    {
        if ($this->sent_count === 0) {
            return 0;
        }
        return round(($this->clicked_count / $this->sent_count) * 100, 2);
    }

    /**
     * Check if campaign can be edited.
     */
    public function canEdit()
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_SUSPENDED]);
    }

    /**
     * Check if campaign can be deleted.
     */
    public function canDelete()
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /**
     * Check if campaign can be scheduled.
     */
    public function canSchedule()
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_SUSPENDED]);
    }

    /**
     * Check if campaign can be sent immediately.
     */
    public function canSendNow()
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_SCHEDULED, self::STATUS_SUSPENDED]);
    }

    /**
     * Check if campaign can be suspended.
     */
    public function canSuspend()
    {
        return in_array($this->status, [self::STATUS_SCHEDULED, self::STATUS_SENDING]);
    }
}
