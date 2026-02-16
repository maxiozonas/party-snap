<?php

namespace Database\Seeders;

use App\Models\PartyToken;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PartyTokenSeeder extends Seeder
{
    public function run(): void
    {
        $token = env('PARTYSNAP_QR_TOKEN') ?: Str::random(64);

        PartyToken::updateOrCreate(
            ['token' => $token],
            [
                'id' => Str::uuid(),
                'event_name' => 'PartySnap Event - Los 50 de Joseta',
                'expires_at' => null,
                'is_active' => true,
            ]
        );

        $this->command->newLine(2);
        $this->command->info('==================================================');
        $this->command->info('  🎉 TOKEN MAESTRO PARA QR:');
        $this->command->line("  <fg=cyan;options=bold>{$token}</>");
        $this->command->newLine();
        $this->command->info('  📱 URL para QR Code:');
        $this->command->line("  <fg=green>http://localhost:3000/?token={$token}</>");
        $this->command->newLine();
        $this->command->info('  👥 Evento: PartySnap Event - Los 50 de Joseta');
        $this->command->info('  🔒 Tipo: ' . (env('PARTYSNAP_QR_TOKEN') ? 'Personalizado (.env)' : 'Aleatorio'));
        $this->command->info('  ⏰ Expira: Nunca (evento permanente)');
        $this->command->info('==================================================');
        $this->command->newLine();
    }
}
