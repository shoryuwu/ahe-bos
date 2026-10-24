<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Perbaikan 3 isu pada skema database AHE-BOS:
     *
     * 1. Sinkronisasi kolom users.nama agar tidak NULL.
     *    Kolom `nama` dipertahankan karena aktif dipakai di AuthController,
     *    AkunController, GuruController, dll dengan pola $user->nama ?? $user->name.
     *
     * 2. Tambahkan FK constraint sesi_belajar.periode_id -> periode_akademik.id
     *    yang sebelumnya hanya berupa kolom string biasa tanpa constraint.
     *
     * 3. Tambahkan FK constraint pendaftaran.siswa_id -> siswa.id
     *    yang sebelumnya juga string nullable tanpa constraint.
     */
    public function up(): void
    {
        // ─── Perbaikan 1: Sinkronisasi users.nama ────────────────────────
        DB::statement("UPDATE users SET nama = name WHERE nama IS NULL OR nama = ''");

        // ─── Perbaikan 2: FK sesi_belajar.periode_id ─────────────────────
        // Bersihkan orphan periode_id sebelum menambah constraint
        DB::statement("
            UPDATE sesi_belajar
            SET periode_id = NULL
            WHERE periode_id IS NOT NULL
              AND periode_id NOT IN (SELECT id FROM periode_akademik)
        ");

        Schema::table('sesi_belajar', function (Blueprint $table) {
            $table->foreign('periode_id')
                  ->references('id')
                  ->on('periode_akademik')
                  ->onDelete('set null');
        });

        // ─── Perbaikan 3: FK pendaftaran.siswa_id ────────────────────────
        // Bersihkan orphan siswa_id sebelum menambah constraint
        DB::statement("
            UPDATE pendaftaran
            SET siswa_id = NULL
            WHERE siswa_id IS NOT NULL
              AND siswa_id NOT IN (SELECT id FROM siswa)
        ");

        Schema::table('pendaftaran', function (Blueprint $table) {
            $table->foreign('siswa_id')
                  ->references('id')
                  ->on('siswa')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran', function (Blueprint $table) {
            $table->dropForeign(['siswa_id']);
        });

        Schema::table('sesi_belajar', function (Blueprint $table) {
            $table->dropForeign(['periode_id']);
        });
    }
};
