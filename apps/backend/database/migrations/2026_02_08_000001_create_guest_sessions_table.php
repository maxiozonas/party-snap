<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('guest_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('token', 64)->unique();
            $table->string('guest_name', 100);
            $table->string('client_ip', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('first_seen_at');
            $table->timestamp('last_seen_at')->nullable();
            $table->unsignedInteger('photos_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable();

            $table->index('token');
            $table->index('is_active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('guest_sessions');
    }
};
