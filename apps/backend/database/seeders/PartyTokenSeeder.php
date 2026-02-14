<?php

namespace Database\Seeders;

use App\Models\PartyToken;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PartyTokenSeeder extends Seeder
{
    public function run(): void
    {
        $token = Str::random(64);

        PartyToken::create([
            'id' => Str::uuid(),
            'token' => $token,
            'event_name' => 'PartySnap Event',
            'expires_at' => now()->addDays(3),
            'is_active' => true,
        ]);

        $this->command->newLine(2);
        $this->command->info('==================================================');
        $this->command->info('  🎉 TOKEN MAESTRO PARA QR:');
        $this->command->line("  <fg=cyan;options=bold>{$token}</>");
        $this->command->newLine();
        $this->command->info('  📱 URL para QR Code:');
        $this->command->line("  <fg=green>http://localhost:5173/?token={$token}</>");
        $this->command->info('==================================================');
        $this->command->newLine();
    }
}
