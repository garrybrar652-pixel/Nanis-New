<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
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
        'description',
        'contact_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'contact_count' => 'integer',
    ];

    /**
     * Get the user that owns the group.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all contacts belonging to this group.
     */
    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Update the contact count for this group.
     */
    public function updateContactCount()
    {
        $this->contact_count = $this->contacts()->count();
        $this->save();
    }
}
