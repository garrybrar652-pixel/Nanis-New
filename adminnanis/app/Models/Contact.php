<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'group_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'company',
        'country',
        'city',
        'state',
        'zip_code',
        'is_subscribed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_subscribed' => 'boolean',
    ];

    /**
     * Get the user that owns the contact.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the group that the contact belongs to.
     */
    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get the full name of the contact.
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Boot method to handle model events.
     */
    protected static function booted()
    {
        // Update group contact count when a contact is created
        static::created(function ($contact) {
            if ($contact->group_id) {
                $contact->group->updateContactCount();
            }
        });

        // Update group contact count when a contact is updated
        static::updated(function ($contact) {
            if ($contact->isDirty('group_id')) {
                // Update old group count
                if ($contact->getOriginal('group_id')) {
                    $oldGroup = Group::find($contact->getOriginal('group_id'));
                    if ($oldGroup) {
                        $oldGroup->updateContactCount();
                    }
                }
                
                // Update new group count
                if ($contact->group_id) {
                    $contact->group->updateContactCount();
                }
            }
        });

        // Update group contact count when a contact is deleted
        static::deleted(function ($contact) {
            if ($contact->group_id) {
                $group = Group::find($contact->group_id);
                if ($group) {
                    $group->updateContactCount();
                }
            }
        });
    }
}
