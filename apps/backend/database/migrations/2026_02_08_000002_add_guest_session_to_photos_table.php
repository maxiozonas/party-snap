<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('photos', function (Blueprint $table) {
            $table->uuid('guest_session_id')->nullable()->after('client_ip');
            $table->foreign('guest_session_id')->references('id')->on('guest_sessions')->onDelete('SET NULL');
        });
    }

    public function down()
    {
        Schema::table('photos', function (Blueprint $table) {
            $table->dropForeign(['guest_session_id']);
            $table->dropColumn('guest_session_id');
        });
    }
};
