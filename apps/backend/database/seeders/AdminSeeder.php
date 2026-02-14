<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create default admin
        Admin::create([
            'name' => 'Administrador PartySnap',
            'email' => 'admin@party-snap.com',
            'password' => Hash::make('party2024!'),
        ]);

        $this->command->newLine(2);
        $this->command->info('==================================================');
        $this->command->info('  👤 ADMIN CREADO EXITOSAMENTE');
        $this->command->newLine();
        $this->command->info('  Email: admin@party-snap.com');
        $this->command->info('  Password: party2024!');
        $this->command->newLine();
        $this->command->info('  IMPORTANTE: Cambia la contraseña después del');
        $this->command->info('  primer login desde el panel de administración.');
        $this->command->info('==================================================');
        $this->command->newLine();
    }
}
