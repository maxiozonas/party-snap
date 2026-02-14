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
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->string('cloudinary_public_id');
            $table->text('secure_url');
            $table->string('guest_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->integer('size_kb')->nullable();
            $table->boolean('is_approved')->default(true);
            $table->string('client_ip')->nullable();
            $table->timestamps();

            $table->index('created_at');
            $table->index('is_approved');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
