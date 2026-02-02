<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('party_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('🎉 PartySnap');
            $table->string('subtitle', 1000)->default('Comparte tus mejores momentos');
            $table->date('event_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('party_settings');
    }
};
