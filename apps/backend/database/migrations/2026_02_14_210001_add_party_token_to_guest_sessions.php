<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('guest_sessions', function (Blueprint $table) {
            $table->uuid('party_token_id')->nullable()->after('id');
            $table->foreign('party_token_id')
                ->references('id')
                ->on('party_tokens')
                ->onDelete('CASCADE');

            $table->index('party_token_id');
        });
    }

    public function down(): void
    {
        Schema::table('guest_sessions', function (Blueprint $table) {
            $table->dropForeign(['party_token_id']);
            $table->dropColumn('party_token_id');
        });
    }
};
