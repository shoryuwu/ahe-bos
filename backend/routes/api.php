<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SiswaController;
use App\Http\Controllers\Api\GuruController;
use App\Http\Controllers\Api\OrangtuaController;
use App\Http\Controllers\Api\KelasController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\PendaftaranController;
use App\Http\Controllers\Api\SesiBelajarController;
use App\Http\Controllers\Api\AbsensiController;
use App\Http\Controllers\Api\ProgressIndikatorController;
use App\Http\Controllers\Api\KosakataController;
use App\Http\Controllers\Api\AsesmenController;
use App\Http\Controllers\Api\CatatanGuruController;
use App\Http\Controllers\Api\PencapaianController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ModulController;
use App\Http\Controllers\Api\WaitingListController;
use App\Http\Controllers\Api\PindahKelasController;
use App\Http\Controllers\Api\CmsController;
use App\Http\Controllers\Api\AkunController;
use App\Http\Controllers\Api\NotifikasiController;
use App\Http\Controllers\Api\LogAktivitasController;
use App\Http\Controllers\Api\UploadController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/auth/login', [AuthController::class, 'login']);

Route::post('/pendaftaran', [PendaftaranController::class, 'store']);
Route::get('/pendaftaran/cek/{noRegistrasi}', [PendaftaranController::class, 'cekStatus']);

Route::get('/galeri', [CmsController::class, 'getGaleri']);
Route::get('/testimoni', [CmsController::class, 'getTestimoni']);
Route::get('/faq', [CmsController::class, 'getFaq']);
Route::get('/program', [ProgramController::class, 'index']);
Route::get('/program/{id}', [ProgramController::class, 'show']);
Route::get('/pengaturan', [CmsController::class, 'getPengaturan']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth & Profile
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/auth/password', [AuthController::class, 'changePassword']);

    // File Upload
    Route::post('/upload', [UploadController::class, 'upload']);

    // Notifikasi
    Route::get('/notifikasi', [NotifikasiController::class, 'index']);
    Route::put('/notifikasi/{id}/read', [NotifikasiController::class, 'markAsRead']);
    Route::put('/notifikasi/read-all', [NotifikasiController::class, 'markAllAsRead']);

    // Siswa (Viewable by authenticated users)
    Route::get('/siswa', [SiswaController::class, 'index']);
    Route::get('/siswa/{id}', [SiswaController::class, 'show']);
    Route::get('/siswa/{id}/absensi', [SiswaController::class, 'getAbsensi']);
    Route::get('/siswa/{id}/nilai', [SiswaController::class, 'getNilai']);
    Route::get('/siswa/{id}/kosakata', [SiswaController::class, 'getKosakata']);
    Route::get('/siswa/{id}/progress', [SiswaController::class, 'getProgress']);
    Route::get('/siswa/{id}/catatan', [SiswaController::class, 'getCatatan']);
    Route::get('/siswa/{id}/pencapaian', [SiswaController::class, 'getPencapaian']);

    // Kelas & Sesi
    Route::get('/kelas', [KelasController::class, 'index']);
    Route::get('/kelas/{id}', [KelasController::class, 'show']);
    Route::get('/kelas/{id}/siswa', [KelasController::class, 'getSiswa']);
    Route::get('/sesi', [SesiBelajarController::class, 'index']);
    Route::get('/sesi/{id}', [SesiBelajarController::class, 'show']);

    // Absensi
    Route::get('/absensi/siswa/{id}', [AbsensiController::class, 'rekapSiswa']);
    Route::get('/absensi/kelas/{id}', [AbsensiController::class, 'rekapKelas']);

    // Progress Indikator & Kosakata
    Route::get('/progress-indikator/siswa/{id}', [ProgressIndikatorController::class, 'show']);
    Route::get('/kosakata/siswa/{id}', [KosakataController::class, 'indexSiswa']);

    // Asesmen
    Route::get('/asesmen', [AsesmenController::class, 'index']);

    // Parent Dashboard
    Route::get('/dashboard/parent/me', [DashboardController::class, 'parentMe']);

    // Tutor Features
    Route::get('/dashboard/tutor/jadwal', [DashboardController::class, 'tutorJadwal']);
    Route::post('/sesi', [SesiBelajarController::class, 'store']);
    Route::put('/sesi/{id}', [SesiBelajarController::class, 'update']);
    Route::put('/sesi/{id}/batalkan', [SesiBelajarController::class, 'batalkan']);
    Route::put('/sesi/{id}/pengganti', [SesiBelajarController::class, 'setPengganti']);
    Route::put('/progress-indikator/siswa/{id}', [ProgressIndikatorController::class, 'update']);
    Route::post('/kosakata', [KosakataController::class, 'store']);
    Route::put('/kosakata/{id}', [KosakataController::class, 'update']);
    Route::post('/asesmen', [AsesmenController::class, 'store']);
    Route::post('/catatan-guru', [CatatanGuruController::class, 'store']);
    Route::put('/catatan-guru/{id}', [CatatanGuruController::class, 'update']);
    Route::delete('/catatan-guru/{id}', [CatatanGuruController::class, 'destroy']);
    Route::post('/pencapaian', [PencapaianController::class, 'store']);

    // Modul Progress
    Route::get('/modul', [ModulController::class, 'index']);
    Route::get('/modul/{id}', [ModulController::class, 'show']);
    Route::get('/modul/siswa/{siswaId}', [ModulController::class, 'siswaProgress']);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes (Role: admin)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {
        // Dashboard Stats
        Route::get('/dashboard/admin/stats', [DashboardController::class, 'adminStats']);

        // Siswa Management
        Route::post('/siswa', [SiswaController::class, 'store']);
        Route::put('/siswa/{id}', [SiswaController::class, 'update']);
        Route::put('/siswa/{id}/status', [SiswaController::class, 'updateStatus']);

        // Guru Management
        Route::get('/guru', [GuruController::class, 'index']);
        Route::get('/guru/tersedia', [GuruController::class, 'getTersedia']);
        Route::get('/guru/{id}', [GuruController::class, 'show']);
        Route::post('/guru', [GuruController::class, 'store']);
        Route::put('/guru/{id}', [GuruController::class, 'update']);
        Route::delete('/guru/{id}', [GuruController::class, 'destroy']);

        // Orang Tua Management
        Route::get('/orangtua', [OrangtuaController::class, 'index']);
        Route::get('/orangtua/{id}', [OrangtuaController::class, 'show']);
        Route::put('/orangtua/{id}', [OrangtuaController::class, 'update']);
        Route::put('/orangtua/{id}/reset-password', [OrangtuaController::class, 'resetPassword']);

        // Kelas Management
        Route::post('/kelas', [KelasController::class, 'store']);
        Route::put('/kelas/{id}', [KelasController::class, 'update']);

        // Pendaftaran Management
        Route::get('/pendaftaran', [PendaftaranController::class, 'index']);
        Route::get('/pendaftaran/{id}', [PendaftaranController::class, 'show']);
        Route::put('/pendaftaran/{id}/terima', [PendaftaranController::class, 'terima']);
        Route::put('/pendaftaran/{id}/tolak', [PendaftaranController::class, 'tolak']);
        Route::put('/pendaftaran/{id}/tunda', [PendaftaranController::class, 'tunda']);

        // Asesmen Approval
        Route::put('/asesmen/{id}/approve', [AsesmenController::class, 'approve']);
        Route::put('/asesmen/{id}/reject', [AsesmenController::class, 'reject']);

        // Modul Management
        Route::post('/modul', [ModulController::class, 'store']);
        Route::put('/modul/{id}', [ModulController::class, 'update']);
        Route::delete('/modul/{id}', [ModulController::class, 'destroy']);

        // Waiting List & Pindah Kelas
        Route::get('/waiting-list', [WaitingListController::class, 'index']);
        Route::put('/waiting-list/{id}/assign', [WaitingListController::class, 'assign']);
        Route::delete('/waiting-list/{id}', [WaitingListController::class, 'destroy']);
        Route::post('/pindah-kelas', [PindahKelasController::class, 'store']);

        // CMS Management
        Route::post('/galeri', [CmsController::class, 'storeGaleri']);
        Route::delete('/galeri/{id}', [CmsController::class, 'destroyGaleri']);
        Route::post('/testimoni', [CmsController::class, 'storeTestimoni']);
        Route::put('/testimoni/{id}', [CmsController::class, 'updateTestimoni']);
        Route::delete('/testimoni/{id}', [CmsController::class, 'destroyTestimoni']);
        Route::post('/faq', [CmsController::class, 'storeFaq']);
        Route::put('/faq/{id}', [CmsController::class, 'updateFaq']);
        Route::delete('/faq/{id}', [CmsController::class, 'destroyFaq']);
        Route::put('/pengaturan', [CmsController::class, 'updatePengaturan']);

        // User Accounts & Audit Logs
        Route::get('/akun', [AkunController::class, 'index']);
        Route::post('/akun', [AkunController::class, 'store']);
        Route::put('/akun/{id}', [AkunController::class, 'update']);
        Route::put('/akun/{id}/reset-password', [AkunController::class, 'resetPassword']);
        Route::put('/akun/{id}/unlock', [AkunController::class, 'unlock']);
        Route::get('/log-aktivitas', [LogAktivitasController::class, 'index']);
    });
});
