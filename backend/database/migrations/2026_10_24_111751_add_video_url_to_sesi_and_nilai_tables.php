<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sesi_belajar', function (Blueprint $table) {
            if (!Schema::hasColumn('sesi_belajar', 'video_url')) {
                $table->string('video_url', 500)->nullable()->after('catatan_umum');
            }
        });

        Schema::table('nilai_sesi', function (Blueprint $table) {
            if (!Schema::hasColumn('nilai_sesi', 'video_url')) {
                $table->string('video_url', 500)->nullable()->after('catatan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sesi_belajar', function (Blueprint $table) {
            if (Schema::hasColumn('sesi_belajar', 'video_url')) {
                $table->dropColumn('video_url');
            }
        });

        Schema::table('nilai_sesi', function (Blueprint $table) {
            if (Schema::hasColumn('nilai_sesi', 'video_url')) {
                $table->dropColumn('video_url');
            }
        });
    }
};
