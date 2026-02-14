<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    protected $fillable = [
        'cloudinary_public_id',
        'secure_url',
        'guest_name',
        'mime_type',
        'size_kb',
        'is_approved',
        'client_ip',
        'guest_session_id',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'size_kb' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('is_approved', true);
    }

    public function scopeRecent(Builder $query): Builder
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeWithSession(Builder $query): Builder
    {
        return $query->whereNotNull('guest_session_id');
    }

    public function guestSession(): BelongsTo
    {
        return $this->belongsTo(GuestSession::class, 'guest_session_id');
    }
}
