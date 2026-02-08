<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GuestSession extends Model
{
    protected $fillable = [
        'id',
        'token',
        'guest_name',
        'client_ip',
        'user_agent',
        'first_seen_at',
        'last_seen_at',
        'photos_count',
        'is_active',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'photos_count' => 'integer',
        'first_seen_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public $timestamps = false;

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class, 'guest_session_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeValidToken(Builder $query, string $token): Builder
    {
        return $query->where('token', $token)
                    ->where('is_active', true)
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                    });
    }

    public function incrementPhotosCount(): void
    {
        $this->increment('photos_count');
    }
}
