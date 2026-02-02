<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartySetting extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'event_date',
    ];

    protected $casts = [
        'event_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the current party settings (singleton pattern).
     */
    public static function getCurrent()
    {
        return static::firstOrCreate(
            ['id' => 1],
            [
                'title' => '🎉 PartySnap',
                'subtitle' => 'Comparte tus mejores momentos',
            ]
        );
    }

    /**
     * Update the current settings.
     */
    public static function updateCurrent(array $data): self
    {
        $settings = static::getCurrent();
        $settings->update($data);
        return $settings->fresh();
    }
}
