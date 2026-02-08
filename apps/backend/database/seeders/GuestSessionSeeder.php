<?php

namespace Database\Seeders;

use App\Models\GuestSession;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GuestSessionSeeder extends Seeder
{
    public function run()
    {
        $token = Str::random(64);

        GuestSession::create([
            'id' => Str::uuid(),
            'token' => $token,
            'guest_name' => 'Admin Test',
            'client_ip' => '127.0.0.1',
            'user_agent' => 'Seeder',
            'first_seen_at' => now(),
            'last_seen_at' => now(),
        ]);

        $this->command->newLine(2);
        $this->command->info('==================================================');
        $this->command->info('  🔑 TOKEN GENERADO PARA LA FIESTA:');
        $this->command->line("  <fg=cyan;options=bold>{$token}</>");
        $this->command->newLine();
        $this->command->info('  📱 QR Code URL:');
        $this->command->line("  <fg=green>https://demo.xenova.com.ar/party-snap?token={$token}</>");
        $this->command->info('==================================================');
        $this->command->newLine();
    }
}
