"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  Calendar as CalendarIcon,
  TrendingUp,
  Search,
  Plus,
  Filter,
  CheckCircle,
  FileCheck,
  Award,
  AlertCircle,
  ChevronRight,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarCheck,
  FolderOpen,
  ClipboardList,
  FileText,
  Settings,
  Printer,
  Trash2,
  Edit,
  Save,
  MessageSquare,
  MessageCircle,
  Shield,
  Key,
  Eye,
  EyeOff,
  Star,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTab } from "@/components/admin/tabs/DashboardTab";
import { PendaftaranTab } from "@/components/admin/tabs/PendaftaranTab";
import { SiswaTab } from "@/components/admin/tabs/SiswaTab";
import { OrangtuaTab } from "@/components/admin/tabs/OrangtuaTab";
import { GuruTab } from "@/components/admin/tabs/GuruTab";
import { KelasTab } from "@/components/admin/tabs/KelasTab";
import { MonitoringTab } from "@/components/admin/tabs/MonitoringTab";
import { KenaikanLevelTab } from "@/components/admin/tabs/KenaikanLevelTab";
import { LaporanTab } from "@/components/admin/tabs/LaporanTab";
import { PengaturanTab } from "@/components/admin/tabs/PengaturanTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync activeTab with URL search params (?tab=...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Stats Data
  const [stats, setStats] = useState<any>(null);

  // Sub-data collections
  const [pendaftaranList, setPendaftaranList] = useState<any[]>([]);
  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [orangtuaList, setOrangtuaList] = useState<any[]>([]);
  const [guruList, setGuruList] = useState<any[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [sesiList, setSesiList] = useState<any[]>([]);
  const [asesmenList, setAsesmenList] = useState<any[]>([]);
  const [waitingList, setWaitingList] = useState<any[]>([]);
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [faqList, setFaqList] = useState<any[]>([]);
  const [testimoniList, setTestimoniList] = useState<any[]>([]);
  const [galeriList, setGaleriList] = useState<any[]>([]);
  const [logList, setLogList] = useState<any[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterSesiKelas, setFilterSesiKelas] = useState("all");

  // Pengaturan Subtab
  const [pengaturanSubtab, setPengaturanSubtab] = useState<"profil" | "akun" | "galeri" | "faq" | "testimoni" | "log">("profil");
  const [newGaleriForm, setNewGaleriForm] = useState({
    image_url: "",
    caption: "",
    kategori: "Belajar",
  });
  const [selectedGaleriFile, setSelectedGaleriFile] = useState<File | null>(null);
  const [akunList, setAkunList] = useState<any[]>([]);
  const [filterAkunRole, setFilterAkunRole] = useState("all");
  const [filterAkunStatus, setFilterAkunStatus] = useState("all");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "tutor",
  });
  const [resetUserPasswordResult, setResetUserPasswordResult] = useState<any | null>(null);

  // Modals & Forms
  const [acceptModalReg, setAcceptModalReg] = useState<any | null>(null);
  const [selectedClassIdForAccept, setSelectedClassIdForAccept] = useState("");
  const [acceptResult, setAcceptResult] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Waiting list credential result modal
  const [wlAcceptResult, setWlAcceptResult] = useState<{
    nama_anak: string;
    nama_ortu: string;
    no_wa_ortu: string;
    kelas_nama: string;
    akun: { email: string; password: string } | null;
  } | null>(null);

  // Status Change Student Modal
  const [statusModalStudent, setStatusModalStudent] = useState<any | null>(null);
  const [newStudentStatus, setNewStudentStatus] = useState("aktif");
  const [alasanKeluar, setAlasanKeluar] = useState("");

  // Substitute Tutor Modal
  const [substituteModalSesi, setSubstituteModalSesi] = useState<any | null>(null);
  const [selectedPenggantiId, setSelectedPenggantiId] = useState("");

  // Cancel Sesi Modal
  const [cancelModalSesi, setCancelModalSesi] = useState<any | null>(null);
  const [alasanBatalSesi, setAlasanBatalSesi] = useState("");

  // New Student Modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    nama: "",
    tempat_lahir: "Balikpapan",
    tanggal_lahir: "",
    jenis_kelamin: "L",
    kelas_id: "",
    nama_ortu: "",
    no_wa_ortu: "",
    email_ortu: "",
    alamat_ortu: "",
    hubungan_ortu: "ibu",
  });

  // New Teacher Modal
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacherForm, setNewTeacherForm] = useState({
    nama: "",
    email: "",
    password: "",
    no_wa: "",
    spesialisasi: "Metode Fonik AHE, Level Dasar",
  });

  // New FAQ Form
  const [newFaqForm, setNewFaqForm] = useState({ pertanyaan: "", jawaban: "" });

  // New Testimoni Form
  const [newTestiForm, setNewTestiForm] = useState({
    nama_ortu: "",
    nama_anak: "",
    usia_anak: "5 tahun",
    ulasan: "",
    rating: 5,
  });

  // Program list
  const [programList, setProgramList] = useState<any[]>([]);

  // Edit Teacher Modal
  const [editTeacherModal, setEditTeacherModal] = useState<any | null>(null);
  const [editTeacherForm, setEditTeacherForm] = useState({
    nama: "",
    no_wa: "",
    spesialisasi: [] as string[],
    is_active: true,
  });

  // Edit Parent Modal & Reset Password
  const [editParentModal, setEditParentModal] = useState<any | null>(null);
  const [editParentForm, setEditParentForm] = useState({
    nama: "",
    no_wa: "",
    email: "",
    alamat: "",
    hubungan: "ibu",
  });
  const [resetPasswordResult, setResetPasswordResult] = useState<{
    email: string;
    password_baru: string;
    nama: string;
    no_wa: string;
  } | null>(null);

  // Class Management Modals
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [addClassForm, setAddClassForm] = useState({
    nama: "",
    program_id: "prg-001",
    guru_id: "",
    jadwal_hari: ["Senin", "Rabu", "Jumat"],
    jam_mulai: "08:30",
    jam_selesai: "09:30",
    kapasitas: 6,
  });

  const [editClassModal, setEditClassModal] = useState<any | null>(null);
  const [editClassForm, setEditClassForm] = useState({
    nama: "",
    program_id: "",
    guru_id: "",
    jadwal_hari: [] as string[],
    jam_mulai: "",
    jam_selesai: "",
    kapasitas: 6,
    status: "aktif",
  });

  const [classStudentsModal, setClassStudentsModal] = useState<{
    kelas: any;
    students: any[];
    loading: boolean;
  } | null>(null);

  // Student Detail & Edit Modals
  const [studentDetailModal, setStudentDetailModal] = useState<{
    student: any;
    loading: boolean;
  } | null>(null);

  // Session Detail Modal (Monitoring KBM)
  const [sessionDetailModal, setSessionDetailModal] = useState<{
    sesi: any;
    loading: boolean;
  } | null>(null);

  const [editStudentModal, setEditStudentModal] = useState<any | null>(null);
  const [editStudentForm, setEditStudentForm] = useState({
    nama: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "L",
    level_saat_ini: "pra-membaca",
    kelas_id: "",
  });

  // Waiting List & Transfer Class States
  const [pendaftaranSubtab, setPendaftaranSubtab] = useState<"berkas" | "waiting-list">("berkas");
  const [assignWaitingListModal, setAssignWaitingListModal] = useState<any | null>(null);
  const [selectedClassForWlAssign, setSelectedClassForWlAssign] = useState("");

  const [transferClassModal, setTransferClassModal] = useState<any | null>(null);
  const [transferClassForm, setTransferClassForm] = useState({
    ke_kelas_id: "",
    alasan: "Penyesuaian jadwal orang tua",
    catatan: "",
  });

  // Action messages
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  function notify(type: "success" | "error", text: string) {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  }

  // Load Admin Data
  async function loadAdminData() {
    setLoading(true);
    try {
      const [stRes, regRes, sisRes, ortRes, gurRes, kelRes, sesRes, asmRes, waitRes, setRes, faqRes, tesRes, galRes, logRes, prgRes, aknRes] =
        await Promise.all([
          fetch("/api/dashboard/admin/stats").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/pendaftaran").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/siswa").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/orangtua").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/guru").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/kelas").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/sesi").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/asesmen").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/waiting-list").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/pengaturan").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/faq?all=true").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/testimoni?all=true").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/galeri").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/log-aktivitas").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/program").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/akun").then((r) => r.json()).catch(() => ({ success: false })),
        ]);

      if (stRes.success) setStats(stRes.data);
      if (regRes.success) {
        const list = Array.isArray(regRes.data)
          ? regRes.data
          : (regRes.data?.items || []);
        setPendaftaranList(list);
      }
      if (sisRes.success) setSiswaList(sisRes.data.items || []);
      if (ortRes.success) setOrangtuaList(ortRes.data || []);
      if (gurRes.success) setGuruList(gurRes.data || []);
      if (kelRes.success) setKelasList(kelRes.data || []);
      if (sesRes.success) setSesiList(sesRes.data || []);
      if (asmRes.success) setAsesmenList(asmRes.data || []);
      if (waitRes.success) setWaitingList(waitRes.data || []);
      if (setRes.success) setSettingsMap(setRes.data || {});
      if (faqRes.success) setFaqList(faqRes.data || []);
      if (tesRes.success) setTestimoniList(tesRes.data || []);
      if (galRes.success) setGaleriList(galRes.data || []);
      if (logRes.success) setLogList(logRes.data || []);
      if (prgRes.success) setProgramList(prgRes.data || []);
      if (aknRes.success) setAkunList(aknRes.data || []);
    } catch {
      notify("error", "Gagal menghubungkan ke data server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handle Approve Registration
  async function handleApproveRegistration(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptModalReg) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/pendaftaran/${acceptModalReg.id}/terima`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelas_id: selectedClassIdForAccept || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAcceptResult(json.data);
        notify("success", "Pendaftaran berhasil diterima!");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menyetujui pendaftaran.");
      }
    } catch {
      notify("error", "Terjadi kesalahan sistem saat memproses approval.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Reject Registration
  async function handleRejectRegistration(id: string) {
    const alasan = prompt("Masukkan alasan penolakan pendaftaran:");
    if (!alasan) return;

    try {
      const res = await fetch(`/api/pendaftaran/${id}/tolak`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alasan_tolak: alasan }),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", "Pendaftaran ditolak.");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memproses penolakan.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    }
  }

  // Handle Postpone Registration
  async function handlePostponeRegistration(id: string) {
    const catatan = prompt("Catatan penundaan / jadwal tunggu:");
    if (!catatan) return;

    try {
      const res = await fetch(`/api/pendaftaran/${id}/tunda`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catatan_admin: catatan }),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", "Pendaftaran ditunda.");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memproses penundaan.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    }
  }

  // Handle Create Student Manual
  async function handleCreateStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!newStudentForm.nama || !newStudentForm.tanggal_lahir) {
      notify("error", "Nama dan tanggal lahir siswa wajib diisi.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/siswa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudentForm),
      });

      const json = await res.json();
      if (json.success) {
        notify("success", `Siswa ${json.data.nama} berhasil ditambahkan!`);
        setShowAddStudentModal(false);
        setNewStudentForm({
          nama: "",
          tempat_lahir: "Balikpapan",
          tanggal_lahir: "",
          jenis_kelamin: "L",
          kelas_id: "",
          nama_ortu: "",
          no_wa_ortu: "",
          email_ortu: "",
          alamat_ortu: "",
          hubungan_ortu: "ibu",
        });
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menambah siswa.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Update Student Status (Aktif / Nonaktif / Lulus)
  async function handleUpdateStudentStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!statusModalStudent) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/siswa/${statusModalStudent.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStudentStatus,
          alasan_keluar: newStudentStatus === "nonaktif" ? alasanKeluar : undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        notify("success", `Status siswa diperbarui menjadi ${newStudentStatus}`);
        setStatusModalStudent(null);
        setAlasanKeluar("");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memperbarui status siswa.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Create Teacher
  async function handleCreateTeacher(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeacherForm.nama || !newTeacherForm.email || !newTeacherForm.password) {
      notify("error", "Nama, email, dan password wajib diisi.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/guru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacherForm),
      });

      const json = await res.json();
      if (json.success) {
        notify("success", `Tutor ${json.data.nama} berhasil didaftarkan!`);
        setShowAddTeacherModal(false);
        setNewTeacherForm({
          nama: "",
          email: "",
          password: "",
          no_wa: "",
          spesialisasi: "Metode Fonik AHE, Level Dasar",
        });
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal mendaftarkan guru.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Delete Teacher (Cascade Safety Rule)
  async function handleDeleteTeacher(id: string, nama: string) {
    if (!confirm(`Apakah Anda yakin ingin menonaktifkan/menghapus akun tutor ${nama}?`)) return;

    try {
      const res = await fetch(`/api/guru/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        notify("success", `Tutor ${nama} berhasil dihapus.`);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menghapus tutor.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    }
  }

  // Handle Edit Teacher
  function openEditTeacher(teacher: any) {
    setEditTeacherModal(teacher);
    setEditTeacherForm({
      nama: teacher.nama || "",
      no_wa: teacher.no_wa || "",
      spesialisasi: Array.isArray(teacher.spesialisasi)
        ? teacher.spesialisasi
        : typeof teacher.spesialisasi === "string"
        ? teacher.spesialisasi.split(",").map((s: string) => s.trim())
        : ["level-1", "level-2"],
      is_active: teacher.is_active !== undefined ? teacher.is_active : true,
    });
  }

  async function handleSaveEditTeacher(e: React.FormEvent) {
    e.preventDefault();
    if (!editTeacherModal) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/guru/${editTeacherModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTeacherForm),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Data tutor ${editTeacherForm.nama} berhasil diperbarui.`);
        setEditTeacherModal(null);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memperbarui data tutor.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Edit Parent
  function openEditParent(parent: any) {
    setEditParentModal(parent);
    setEditParentForm({
      nama: parent.nama || "",
      no_wa: parent.no_wa || "",
      email: parent.email || "",
      alamat: parent.alamat || "",
      hubungan: parent.hubungan || "ibu",
    });
  }

  async function handleSaveEditParent(e: React.FormEvent) {
    e.preventDefault();
    if (!editParentModal) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/orangtua/${editParentModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editParentForm),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Data orang tua ${editParentForm.nama} berhasil diperbarui.`);
        setEditParentModal(null);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memperbarui data orang tua.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Reset Parent Password
  async function handleResetParentPassword(parent: any) {
    if (!confirm(`Reset kata sandi akun login untuk ${parent.nama}? Password baru acak akan dibuatkan.`)) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/orangtua/${parent.id}/reset-password`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setResetPasswordResult(json.data);
        notify("success", `Kata sandi akun ${parent.nama} berhasil direset!`);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal mereset kata sandi.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Create Class
  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    if (!addClassForm.nama || !addClassForm.guru_id) {
      notify("error", "Nama kelas dan tutor pengajar wajib dipilih.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/kelas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addClassForm),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Kelas ${addClassForm.nama} berhasil dibuat!`);
        setShowAddClassModal(false);
        setAddClassForm({
          nama: "",
          program_id: programList[0]?.id || "prg-001",
          guru_id: guruList[0]?.id || "",
          jadwal_hari: ["Senin", "Rabu", "Jumat"],
          jam_mulai: "08:30",
          jam_selesai: "09:30",
          kapasitas: 6,
        });
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal membuat kelas baru.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Edit Class
  function openEditClass(kelas: any) {
    setEditClassModal(kelas);
    setEditClassForm({
      nama: kelas.nama || "",
      program_id: kelas.program_id || "",
      guru_id: kelas.guru_id || "",
      jadwal_hari: Array.isArray(kelas.jadwal_hari) ? kelas.jadwal_hari : ["Senin", "Rabu", "Jumat"],
      jam_mulai: kelas.jam_mulai || "08:30",
      jam_selesai: kelas.jam_selesai || "09:30",
      kapasitas: kelas.kapasitas || 6,
      status: kelas.status || "aktif",
    });
  }

  async function handleSaveEditClass(e: React.FormEvent) {
    e.preventDefault();
    if (!editClassModal) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/kelas/${editClassModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editClassForm),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Data kelas ${editClassForm.nama} berhasil diperbarui.`);
        setEditClassModal(null);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memperbarui data kelas.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Delete / Deactivate Class
  async function handleDeleteClass(id: string, nama: string) {
    if (!confirm(`Yakin ingin menonaktifkan rombel kelas ${nama}?`)) return;
    try {
      const res = await fetch(`/api/kelas/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        notify("success", `Kelas ${nama} berhasil dinonaktifkan.`);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menonaktifkan kelas.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    }
  }

  // Handle View Class Students
  async function handleViewClassStudents(kelas: any) {
    setClassStudentsModal({ kelas, students: [], loading: true });
    try {
      const res = await fetch(`/api/kelas/${kelas.id}/siswa`);
      const json = await res.json();
      if (json.success) {
        setClassStudentsModal({ kelas, students: json.data || [], loading: false });
      } else {
        notify("error", "Gagal memuat daftar siswa di kelas ini.");
        setClassStudentsModal(null);
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
      setClassStudentsModal(null);
    }
  }

  // Handle View Student Detail
  async function handleViewStudentDetail(id: string) {
    setClassStudentsModal(null);
    setStudentDetailModal({ student: null, loading: true });
    try {
      const res = await fetch(`/api/siswa/${id}`);
      const json = await res.json();
      if (json.success) {
        setStudentDetailModal({ student: json.data, loading: false });
      } else {
        notify("error", json.error || "Gagal memuat rincian data siswa.");
        setStudentDetailModal(null);
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
      setStudentDetailModal(null);
    }
  }

  // Handle View Session Detail (Monitoring KBM)
  async function handleViewSessionDetail(id: string) {
    setSessionDetailModal({ sesi: null, loading: true });
    try {
      const res = await fetch(`/api/sesi/${id}`);
      const json = await res.json();
      if (json.success) {
        setSessionDetailModal({ sesi: json.data, loading: false });
      } else {
        notify("error", json.error || "Gagal memuat rincian sesi belajar.");
        setSessionDetailModal(null);
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
      setSessionDetailModal(null);
    }
  }

  // Handle Edit Student
  function openEditStudent(siswa: any) {
    setEditStudentModal(siswa);
    setEditStudentForm({
      nama: siswa.nama || "",
      tempat_lahir: siswa.tempat_lahir || "Balikpapan",
      tanggal_lahir: siswa.tanggal_lahir || "",
      jenis_kelamin: siswa.jenis_kelamin || "L",
      level_saat_ini: siswa.level_saat_ini || "pra-membaca",
      kelas_id: siswa.kelas_id || "",
    });
  }

  async function handleSaveEditStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!editStudentModal) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/siswa/${editStudentModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editStudentForm),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Data siswa ${editStudentForm.nama} berhasil diperbarui.`);
        setEditStudentModal(null);
        if (studentDetailModal && studentDetailModal.student?.id === editStudentModal.id) {
          handleViewStudentDetail(editStudentModal.id);
        }
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memperbarui data siswa.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Waiting List
  async function handleAssignWaitingList(e: React.FormEvent) {
    e.preventDefault();
    if (!assignWaitingListModal || !selectedClassForWlAssign) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/waiting-list/${assignWaitingListModal.id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kelas_id: selectedClassForWlAssign }),
      });
      const json = await res.json();
      if (json.success) {
        setAssignWaitingListModal(null);
        setSelectedClassForWlAssign("");

        // Show credential modal same as normal acceptance
        setWlAcceptResult({
          nama_anak: json.data.nama_anak || "-",
          nama_ortu: json.data.nama_ortu || "-",
          no_wa_ortu: json.data.no_wa_ortu || "",
          kelas_nama: json.data.kelas?.nama || "",
          akun: json.data.akun_orangtua || null,
        });

        loadAdminData();
      } else {
        notify("error", json.error || "Gagal mengalokasikan antrean.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDeleteWaitingList(id: string) {
    if (!confirm("Hapus antrean waiting list ini?")) return;
    try {
      const res = await fetch(`/api/waiting-list/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        notify("success", "Antrean berhasil dihapus dari waiting list.");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menghapus antrean.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    }
  }

  async function handleAddToWaitingList(pendaftaran: any) {
    const relevantClasses = kelasList.filter((k) => k.status === "aktif");
    const hasSeats = relevantClasses.some((k) => (k.siswa_count || 0) < k.kapasitas);

    if (hasSeats) {
      if (
        !confirm(
          `Perhatian: Masih ada rombel kelas yang memiliki kuota tersedia. Apakah Anda yakin tetap ingin memasukkan ${pendaftaran.nama_anak} ke antrean Waiting List?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`Rombel kelas saat ini telah penuh. Masukkan ${pendaftaran.nama_anak} ke antrean Waiting List?`)) {
        return;
      }
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/waiting-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pendaftaran_id: pendaftaran.id,
          program_id: pendaftaran.program_diminati || "prg-001",
          preferensi_jadwal: pendaftaran.preferensi_jadwal || "fleksibel",
          catatan: "Menunggu pembukaan kuota kelas baru",
        }),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Pendaftaran ${pendaftaran.nama_anak} berhasil dimasukkan ke waiting list.`);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memasukkan ke waiting list.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Transfer Class (Pindah Jadwal)
  function openTransferClass(siswa: any) {
    setTransferClassModal(siswa);
    const available = kelasList.filter(
      (k) => k.id !== siswa.kelas_id && (k.siswa_count || 0) < k.kapasitas
    );
    setTransferClassForm({
      ke_kelas_id: available[0]?.id || "",
      alasan: "Penyesuaian jadwal orang tua",
      catatan: "",
    });
  }

  async function handleSaveTransferClass(e: React.FormEvent) {
    e.preventDefault();
    if (!transferClassModal || !transferClassForm.ke_kelas_id) {
      notify("error", "Silakan pilih kelas tujuan pemindahan.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/pindah-kelas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siswa_id: transferClassModal.id,
          ke_kelas_id: transferClassForm.ke_kelas_id,
          alasan: transferClassForm.alasan,
          catatan: transferClassForm.catatan,
        }),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", json.message || "Siswa berhasil dipindahkan ke kelas baru!");
        setTransferClassModal(null);
        if (studentDetailModal && studentDetailModal.student?.id === transferClassModal.id) {
          handleViewStudentDetail(transferClassModal.id);
        }
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memproses pemindahan kelas.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle User Account Management
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!addUserForm.nama || !addUserForm.email || !addUserForm.password) {
      notify("error", "Semua kolom wajib diisi.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/akun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addUserForm),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Akun ${addUserForm.nama} (${addUserForm.role}) berhasil dibuat!`);
        setShowAddUserModal(false);
        setAddUserForm({
          nama: "",
          email: "",
          password: "",
          role: "tutor",
        });
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal membuat akun baru.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleToggleUserActive(user: any) {
    const actionText = user.is_active ? "menonaktifkan" : "mengaktifkan kembali";
    if (!confirm(`Yakin ingin ${actionText} akun ${user.nama}?`)) return;
    try {
      const res = await fetch(`/api/akun/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Status akun ${user.nama} berhasil diperbarui.`);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal memperbarui status akun.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    }
  }

  async function handleUnlockUser(user: any) {
    if (!confirm(`Buka kunci akun (unlock) untuk ${user.nama}?`)) return;
    try {
      const res = await fetch(`/api/akun/${user.id}/unlock`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Akun ${user.nama} berhasil dibuka kuncinya!`);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal membuka kunci akun.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    }
  }

  async function handleResetUserPassword(user: any) {
    if (!confirm(`Reset kata sandi akun login untuk ${user.nama}? Password baru acak akan dibuatkan.`)) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/akun/${user.id}/reset-password`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        setResetUserPasswordResult(json.data);
        notify("success", `Kata sandi akun ${user.nama} berhasil direset!`);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal mereset kata sandi.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Approve Assessment Level
  async function handleApproveAssessment(id: string) {
    if (!confirm("Setujui kenaikan jenjang membaca siswa ini? Badge dan riwayat level baru akan otomatis diterbitkan.")) return;

    try {
      const res = await fetch(`/api/asesmen/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (json.success) {
        notify("success", "Kenaikan level berhasil disetujui!");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menyetujui kenaikan level.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    }
  }

  // Handle Assign Substitute Tutor
  async function handleAssignSubstitute(e: React.FormEvent) {
    e.preventDefault();
    if (!substituteModalSesi || !selectedPenggantiId) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/sesi/${substituteModalSesi.id}/pengganti`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guru_pengganti_id: selectedPenggantiId }),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", "Guru pengganti berhasil ditugaskan.");
        setSubstituteModalSesi(null);
        setSelectedPenggantiId("");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menugaskan guru pengganti.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Cancel Session
  async function handleCancelSession(e: React.FormEvent) {
    e.preventDefault();
    if (!cancelModalSesi || !alasanBatalSesi) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/sesi/${cancelModalSesi.id}/batalkan`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alasan_batal: alasanBatalSesi }),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", "Sesi belajar berhasil dibatalkan.");
        setCancelModalSesi(null);
        setAlasanBatalSesi("");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal membatalkan sesi.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Save Settings
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch("/api/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsMap),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", "Pengaturan bimbel berhasil disimpan!");
      } else {
        notify("error", json.error || "Gagal menyimpan pengaturan.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Create FAQ
  async function handleCreateFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!newFaqForm.pertanyaan || !newFaqForm.jawaban) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFaqForm),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", "FAQ baru berhasil ditambahkan!");
        setNewFaqForm({ pertanyaan: "", jawaban: "" });
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menambah FAQ.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Delete FAQ
  async function handleDeleteFaq(id: string) {
    if (!confirm("Hapus item FAQ ini?")) return;
    try {
      const res = await fetch(`/api/faq/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        notify("success", "FAQ berhasil dihapus.");
        loadAdminData();
      }
    } catch {
      notify("error", "Gagal menghapus FAQ.");
    }
  }

  // Handle Create Testimoni
  async function handleCreateTestimoni(e: React.FormEvent) {
    e.preventDefault();
    if (!newTestiForm.nama_ortu || !newTestiForm.ulasan) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/testimoni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestiForm),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", "Testimoni berhasil disimpan!");
        setNewTestiForm({
          nama_ortu: "",
          nama_anak: "",
          usia_anak: "5 tahun",
          ulasan: "",
          rating: 5,
        });
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menyimpan testimoni.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Toggle Testimoni Tampil
  async function handleToggleTestimoni(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/testimoni/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_tampil: !current }),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", `Status tampil diperbarui.`);
        loadAdminData();
      }
    } catch {
      notify("error", "Gagal memperbarui testimoni.");
    }
  }

  // Handle Delete Testimoni
  async function handleDeleteTestimoni(id: string) {
    if (!confirm("Hapus testimoni ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/testimoni/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        notify("success", "Testimoni berhasil dihapus.");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menghapus testimoni.");
      }
    } catch {
      notify("error", "Terjadi kesalahan jaringan.");
    }
  }

  // Handle Create Galeri
  async function handleCreateGaleri(e: React.FormEvent) {
    e.preventDefault();
    setIsProcessing(true);
    try {
      let finalImageUrl = newGaleriForm.image_url;

      // Jika user memilih file dari perangkat
      if (selectedGaleriFile) {
        const formData = new FormData();
        formData.append("file", selectedGaleriFile);
        const upRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const upJson = await upRes.json();
        if (!upJson.success) {
          notify("error", upJson.error || "Gagal mengunggah foto dari perangkat.");
          setIsProcessing(false);
          return;
        }
        finalImageUrl = upJson.url;
      }

      if (!finalImageUrl) {
        notify("error", "Pilih file foto dari perangkat atau isi URL gambar.");
        setIsProcessing(false);
        return;
      }

      const res = await fetch("/api/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGaleriForm,
          image_url: finalImageUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        notify("success", "Foto berhasil ditambahkan ke galeri!");
        setNewGaleriForm({
          image_url: "",
          caption: "",
          kategori: "Belajar",
        });
        setSelectedGaleriFile(null);
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menyimpan foto galeri.");
      }
    } catch {
      notify("error", "Terjadi kesalahan server saat menyimpan galeri.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Delete Galeri
  async function handleDeleteGaleri(id: string) {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    try {
      const res = await fetch(`/api/galeri/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        notify("success", "Foto berhasil dihapus dari galeri.");
        loadAdminData();
      } else {
        notify("error", json.error || "Gagal menghapus foto galeri.");
      }
    } catch {
      notify("error", "Terjadi kesalahan jaringan.");
    }
  }

  // Filtered lists
  const filteredStudents = siswaList.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.orangtua?.nama && s.orangtua.nama.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchLevel = filterLevel === "all" || s.level_saat_ini === filterLevel;
    return matchSearch && matchLevel;
  });

  const filteredOrangtua = orangtuaList.filter((o) => {
    return (
      o.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.no_wa.includes(searchQuery) ||
      (o.anak && o.anak.some((a: any) => a.nama.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  const filteredSesi = sesiList.filter((s) => {
    if (filterSesiKelas === "all") return true;
    return s.kelas_id === filterSesiKelas;
  });

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        pendingPendaftaranCount={
          stats?.kpi?.pendaftaranMenunggu ||
          pendaftaranList.filter((p) => p.status === "menunggu").length
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title={
            activeTab === "dashboard"
              ? "Ringkasan Operasional Bimbel"
              : activeTab === "pendaftaran"
              ? "Verifikasi Pendaftaran & Waiting List"
              : activeTab === "siswa"
              ? "Kelola Data Siswa & Perkembangan"
              : activeTab === "orangtua"
              ? "Kelola Data Wali Murid & Akun"
              : activeTab === "guru"
              ? "Kelola Tutor & Guru Pengajar"
              : activeTab === "kelas"
              ? "Alokasi Program & Kelas Belajar"
              : activeTab === "monitoring"
              ? "Monitoring KBM & Presensi Sesi"
              : activeTab === "kenaikan-level"
              ? "Asesmen & Kenaikan Jenjang Membaca"
              : activeTab === "laporan"
              ? "Laporan Hasil Belajar & Sertifikat"
              : "Pengaturan Profil & CMS Website"
          }
          subtitle="Panel Administrasi Resmi AHE Karang Joang"
          userName="Administrator"
          userRole="admin"
          showSidebarToggle={true}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Feedback Alert Toast */}
        {feedback && (
          <div className="px-6 pt-4">
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <span>{feedback.text}</span>
              <button
                onClick={() => setFeedback(null)}
                className="text-xs font-bold underline cursor-pointer ml-4"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-medium">Memuat data administrasi AHE...</p>
            </div>
          ) : (
            <>
              {/* ============================================================== */}
              {/* TAB 1: DASHBOARD OVERVIEW                                      */}
              {/* ============================================================== */}
              {activeTab === "dashboard" && stats && (
                <DashboardTab
                  stats={stats}
                  pendaftaranList={pendaftaranList}
                  kelasList={kelasList}
                  asesmenList={asesmenList}
                  siswaList={siswaList}
                  logList={logList}
                  onTabChange={handleTabChange}
                  onNavigateToLog={() => {
                    setPengaturanSubtab("log");
                    handleTabChange("pengaturan");
                  }}
                />
              )}

              {/* ============================================================== */}
              {/* TAB 2: PENDAFTARAN (PPDB)                                      */}
              {/* ============================================================== */}
              {activeTab === "pendaftaran" && (
                <PendaftaranTab
                  pendaftaranList={pendaftaranList}
                  waitingList={waitingList}
                  kelasList={kelasList}
                  pendaftaranSubtab={pendaftaranSubtab}
                  setPendaftaranSubtab={setPendaftaranSubtab}
                  onOpenAcceptModal={(p) => {
                    setAcceptModalReg(p);
                    setSelectedClassIdForAccept(kelasList[0]?.id || "");
                  }}
                  onAddToWaitingList={handleAddToWaitingList}
                  onRejectRegistration={handleRejectRegistration}
                  onOpenAssignWaitingListModal={(w) => {
                    setAssignWaitingListModal(w);
                    setSelectedClassForWlAssign(kelasList[0]?.id || "");
                  }}
                  onDeleteWaitingList={handleDeleteWaitingList}
                />
              )}

              {/* ============================================================== */}
              {/* TAB 3: DATA SISWA                                              */}
              {/* ============================================================== */}
              {activeTab === "siswa" && (
                <SiswaTab
                  filteredStudents={filteredStudents}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterLevel={filterLevel}
                  setFilterLevel={setFilterLevel}
                  onOpenAddStudentModal={() => setShowAddStudentModal(true)}
                  onViewStudentDetail={handleViewStudentDetail}
                  onOpenEditStudent={openEditStudent}
                  onOpenStatusModal={(s) => {
                    setStatusModalStudent(s);
                    setNewStudentStatus(s.status);
                  }}
                />
              )}

              {/* ============================================================== */}
              {/* TAB 4: DATA ORANG TUA (WALI MURID)                             */}
              {/* ============================================================== */}
              {activeTab === "orangtua" && (
                <OrangtuaTab
                  filteredOrangtua={filteredOrangtua}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onOpenEditParent={openEditParent}
                />
              )}

              {/* ============================================================== */}
              {/* TAB 5: TUTOR & GURU                                            */}
              {/* ============================================================== */}
              {activeTab === "guru" && (
                <GuruTab
                  guruList={guruList}
                  onOpenAddTeacherModal={() => setShowAddTeacherModal(true)}
                  onOpenEditTeacher={openEditTeacher}
                  onDeleteTeacher={handleDeleteTeacher}
                />
              )}

              {/* ============================================================== */}
              {/* TAB 6: PROGRAM & KELAS                                         */}
              {/* ============================================================== */}
              {activeTab === "kelas" && (
                <KelasTab
                  kelasList={kelasList}
                  onOpenAddClassModal={() => {
                    setAddClassForm({
                      nama: "",
                      program_id: programList[0]?.id || "prg-001",
                      guru_id: guruList[0]?.id || "",
                      jadwal_hari: ["Senin", "Rabu", "Jumat"],
                      jam_mulai: "08:30",
                      jam_selesai: "09:30",
                      kapasitas: 6,
                    });
                    setShowAddClassModal(true);
                  }}
                  onViewClassStudents={handleViewClassStudents}
                  onOpenEditClass={openEditClass}
                  onDeleteClass={handleDeleteClass}
                />
              )}

              {/* ============================================================== */}
              {/* TAB 7: MONITORING KBM & ABSENSI                                */}
              {/* ============================================================== */}
              {activeTab === "monitoring" && (
                <MonitoringTab
                  filteredSesi={filteredSesi}
                  kelasList={kelasList}
                  filterSesiKelas={filterSesiKelas}
                  setFilterSesiKelas={setFilterSesiKelas}
                  onViewSessionDetail={handleViewSessionDetail}
                  onOpenSubstituteModal={(s) => {
                    setSubstituteModalSesi(s);
                    setSelectedPenggantiId(guruList[0]?.id || "");
                  }}
                  onOpenCancelModal={(s) => {
                    setCancelModalSesi(s);
                    setAlasanBatalSesi("");
                  }}
                />
              )}

              {/* ============================================================== */}
              {/* TAB 8: KENAIKAN LEVEL                                          */}
              {/* ============================================================== */}
              {activeTab === "kenaikan-level" && (
                <KenaikanLevelTab
                  asesmenList={asesmenList}
                  onApproveAssessment={handleApproveAssessment}
                />
              )}

              {/* ============================================================== */}
              {/* TAB 9: LAPORAN & CETAK DOKUMEN                                 */}
              {/* ============================================================== */}
              {activeTab === "laporan" && (
                <LaporanTab
                  filteredStudents={filteredStudents}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}

              {/* ============================================================== */}
              {/* TAB 10: PENGATURAN & CMS                                       */}
              {/* ============================================================== */}
              {activeTab === "pengaturan" && (
                <PengaturanTab
                  pengaturanSubtab={pengaturanSubtab}
                  setPengaturanSubtab={setPengaturanSubtab}
                  settingsMap={settingsMap}
                  setSettingsMap={setSettingsMap}
                  handleSaveSettings={handleSaveSettings}
                  isProcessing={isProcessing}
                  akunList={akunList}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterAkunRole={filterAkunRole}
                  setFilterAkunRole={setFilterAkunRole}
                  filterAkunStatus={filterAkunStatus}
                  setFilterAkunStatus={setFilterAkunStatus}
                  onOpenAddUserModal={() => {
                    setAddUserForm({
                      nama: "",
                      email: "",
                      password: "",
                      role: "tutor",
                    });
                    setShowAddUserModal(true);
                  }}
                  handleUnlockUser={handleUnlockUser}
                  handleResetUserPassword={handleResetUserPassword}
                  handleToggleUserActive={handleToggleUserActive}
                  galeriList={galeriList}
                  newGaleriForm={newGaleriForm}
                  setNewGaleriForm={setNewGaleriForm}
                  selectedGaleriFile={selectedGaleriFile}
                  setSelectedGaleriFile={setSelectedGaleriFile}
                  handleCreateGaleri={handleCreateGaleri}
                  handleDeleteGaleri={handleDeleteGaleri}
                  faqList={faqList}
                  newFaqForm={newFaqForm}
                  setNewFaqForm={setNewFaqForm}
                  handleCreateFaq={handleCreateFaq}
                  handleDeleteFaq={handleDeleteFaq}
                  testimoniList={testimoniList}
                  newTestiForm={newTestiForm}
                  setNewTestiForm={setNewTestiForm}
                  handleCreateTestimoni={handleCreateTestimoni}
                  handleToggleTestimoni={handleToggleTestimoni}
                  handleDeleteTestimoni={handleDeleteTestimoni}
                  logList={logList}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal: Terima Pendaftaran & Buat Akun */}
      {acceptModalReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {acceptResult ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Pendaftaran Resmi Diterima!
                </h3>
                <p className="text-xs text-slate-600">
                  Siswa telah aktif dan akun orang tua telah otomatis dibuat. Kredensial dapat
                  diberikan kepada wali murid:
                </p>

                {acceptResult.akun_dibuat && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs font-mono space-y-1">
                    <div>
                      <strong>Email / Username:</strong> {acceptResult.akun_dibuat.email}
                    </div>
                    <div>
                      <strong>Password Awal:</strong> {acceptResult.akun_dibuat.password_default}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setAcceptModalReg(null);
                    setAcceptResult(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleApproveRegistration} className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Terima Pendaftaran Siswa
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih kelompok kelas untuk calon siswa:{" "}
                  <strong>{acceptModalReg.nama_anak}</strong>
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Kelas Belajar
                  </label>
                  <select
                    value={selectedClassIdForAccept}
                    onChange={(e) => setSelectedClassIdForAccept(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
                  >
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama} ({k.siswa_count}/{k.kapasitas} Siswa) • Tutor: {k.guru_nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAcceptModalReg(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                  >
                    {isProcessing ? "Memproses..." : "Konfirmasi Terima & Buat Akun"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Status Siswa (Aktif / Nonaktif / Lulus) */}
      {statusModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <form onSubmit={handleUpdateStudentStatus} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Ubah Status Siswa</h3>
              <p className="text-xs text-slate-500">
                Siswa: <strong>{statusModalStudent.nama}</strong>
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Baru
                </label>
                <select
                  value={newStudentStatus}
                  onChange={(e) => setNewStudentStatus(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="aktif">Aktif</option>
                  <option value="lulus">Lulus (Tamat Membaca)</option>
                  <option value="nonaktif">Nonaktif (Keluar)</option>
                </select>
              </div>

              {newStudentStatus === "nonaktif" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alasan Keluar
                  </label>
                  <textarea
                    rows={2}
                    value={alasanKeluar}
                    onChange={(e) => setAlasanKeluar(e.target.value)}
                    placeholder="Misal: Pindah domisili luar kota..."
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalStudent(null)}
                  className="px-3 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
                >
                  Simpan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Substitute Tutor */}
      {substituteModalSesi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <form onSubmit={handleAssignSubstitute} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Tugaskan Guru Pengganti</h3>
              <p className="text-xs text-slate-500">
                Sesi: <strong>{substituteModalSesi.kelas?.nama}</strong> (
                {substituteModalSesi.tanggal})
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Guru Pengganti
                </label>
                <select
                  value={selectedPenggantiId}
                  onChange={(e) => setSelectedPenggantiId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
                >
                  {guruList
                    .filter((g) => g.id !== substituteModalSesi.guru_id)
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nama}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubstituteModalSesi(null)}
                  className="px-3 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
                >
                  Tugaskan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cancel Sesi */}
      {cancelModalSesi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <form onSubmit={handleCancelSession} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Batalkan Sesi Belajar</h3>
              <p className="text-xs text-slate-500">
                Sesi: <strong>{cancelModalSesi.kelas?.nama}</strong> ({cancelModalSesi.tanggal})
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alasan Pembatalan Sesi
                </label>
                <textarea
                  rows={2}
                  required
                  value={alasanBatalSesi}
                  onChange={(e) => setAlasanBatalSesi(e.target.value)}
                  placeholder="Misal: Tanggal merah nasional / listrik padam..."
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalSesi(null)}
                  className="px-3 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  Batalkan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Siswa Baru Manual */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Tambah Siswa Baru</h3>
              <p className="text-xs text-slate-500">
                Pendaftaran siswa manual beserta akun login wali murid
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Anak</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.nama}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                    <input
                      type="text"
                      value={newStudentForm.tempat_lahir}
                      onChange={(e) =>
                        setNewStudentForm({ ...newStudentForm, tempat_lahir: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      required
                      value={newStudentForm.tanggal_lahir}
                      onChange={(e) =>
                        setNewStudentForm({ ...newStudentForm, tanggal_lahir: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alokasi Kelas</label>
                  <select
                    value={newStudentForm.kelas_id}
                    onChange={(e) =>
                      setNewStudentForm({ ...newStudentForm, kelas_id: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="">-- Tempatkan Nanti --</option>
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama} ({k.siswa_count}/{k.kapasitas} Siswa)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">Data Orang Tua / Wali</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Lengkap Wali
                      </label>
                      <input
                        type="text"
                        value={newStudentForm.nama_ortu}
                        onChange={(e) =>
                          setNewStudentForm({ ...newStudentForm, nama_ortu: e.target.value })
                        }
                        className="w-full border border-slate-200 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          No. WhatsApp
                        </label>
                        <input
                          type="text"
                          value={newStudentForm.no_wa_ortu}
                          onChange={(e) =>
                            setNewStudentForm({ ...newStudentForm, no_wa_ortu: e.target.value })
                          }
                          className="w-full border border-slate-200 rounded-xl px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Email Akun Portal
                        </label>
                        <input
                          type="email"
                          value={newStudentForm.email_ortu}
                          onChange={(e) =>
                            setNewStudentForm({ ...newStudentForm, email_ortu: e.target.value })
                          }
                          className="w-full border border-slate-200 rounded-xl px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm cursor-pointer"
                >
                  {isProcessing ? "Menyimpan..." : "Simpan Siswa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Guru Baru */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Daftarkan Tutor Baru</h3>
              <p className="text-xs text-slate-500">
                Membuat profil tutor pengajar dan akun login sistem
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Beserta Gelar
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeacherForm.nama}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Login Portal
                  </label>
                  <input
                    type="email"
                    required
                    value={newTeacherForm.email}
                    onChange={(e) =>
                      setNewTeacherForm({ ...newTeacherForm, email: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Password Login
                    </label>
                    <input
                      type="password"
                      required
                      value={newTeacherForm.password}
                      onChange={(e) =>
                        setNewTeacherForm({ ...newTeacherForm, password: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      value={newTeacherForm.no_wa}
                      onChange={(e) =>
                        setNewTeacherForm({ ...newTeacherForm, no_wa: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm cursor-pointer"
                >
                  {isProcessing ? "Menyimpan..." : "Daftarkan Tutor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Tutor */}
      {editTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <form onSubmit={handleSaveEditTeacher} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Profil Tutor</h3>
                <p className="text-xs text-slate-400">
                  Perbarui identitas, kontak, dan spesialisasi level mengajar
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar
                  </label>
                  <input
                    type="text"
                    required
                    value={editTeacherForm.nama}
                    onChange={(e) => setEditTeacherForm({ ...editTeacherForm, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={editTeacherForm.no_wa}
                    onChange={(e) => setEditTeacherForm({ ...editTeacherForm, no_wa: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Pengajar
                  </label>
                  <select
                    value={editTeacherForm.is_active ? "aktif" : "nonaktif"}
                    onChange={(e) =>
                      setEditTeacherForm({ ...editTeacherForm, is_active: e.target.value === "aktif" })
                    }
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="aktif">Aktif Mengajar</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditTeacherModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Orang Tua */}
      {editParentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <form onSubmit={handleSaveEditParent} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Data Orang Tua / Wali</h3>
                <p className="text-xs text-slate-400">
                  Perbarui kontak, email, dan alamat domisili wali murid
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editParentForm.nama}
                    onChange={(e) => setEditParentForm({ ...editParentForm, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Hubungan
                    </label>
                    <select
                      value={editParentForm.hubungan}
                      onChange={(e) => setEditParentForm({ ...editParentForm, hubungan: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                    >
                      <option value="ibu">Ibu</option>
                      <option value="ayah">Ayah</option>
                      <option value="wali">Wali</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      value={editParentForm.no_wa}
                      onChange={(e) => setEditParentForm({ ...editParentForm, no_wa: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Akun Portal
                  </label>
                  <input
                    type="email"
                    value={editParentForm.email}
                    onChange={(e) => setEditParentForm({ ...editParentForm, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Domisili
                  </label>
                  <textarea
                    rows={2}
                    value={editParentForm.alamat}
                    onChange={(e) => setEditParentForm({ ...editParentForm, alamat: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditParentModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Hasil Reset Password Akun Orang Tua */}
      {resetPasswordResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Kata Sandi Baru Dibuat!
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Akun login untuk wali murid <strong>{resetPasswordResult.nama}</strong> berhasil diperbarui.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 mb-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Email Login:</span>
                <span className="font-bold text-slate-800 break-all">{resetPasswordResult.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Password Baru:</span>
                <span className="font-bold text-purple-700 text-sm">{resetPasswordResult.password_baru}</span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`https://wa.me/${resetPasswordResult.no_wa.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Halo Bapak/Ibu ${resetPasswordResult.nama}, kata sandi akun portal AHE Anda telah direset.\n\nEmail: ${resetPasswordResult.email}\nPassword: ${resetPasswordResult.password_baru}\n\nSilakan login di http://localhost:3000/login`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Password via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setResetPasswordResult(null)}
                className="w-full py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tambah Kelas Baru */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Buka Rombel Kelas Baru</h3>
                <p className="text-xs text-slate-400">
                  Tentukan nama rombel, jenjang kurikulum, tutor pengampu, dan jadwal
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Rombel Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pagi D - Level 1 (Khusus Balita)"
                    value={addClassForm.nama}
                    onChange={(e) => setAddClassForm({ ...addClassForm, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Level Program *
                    </label>
                    <select
                      value={addClassForm.program_id}
                      onChange={(e) => setAddClassForm({ ...addClassForm, program_id: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                    >
                      {programList.length > 0 ? (
                        programList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nama}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="prg-001">Pra Membaca</option>
                          <option value="prg-002">Level 1</option>
                          <option value="prg-003">Level 2</option>
                          <option value="prg-004">Level 3</option>
                          <option value="prg-005">Level Lanjutan</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tutor Pengampu *
                    </label>
                    <select
                      required
                      value={addClassForm.guru_id}
                      onChange={(e) => setAddClassForm({ ...addClassForm, guru_id: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                    >
                      <option value="">Pilih Tutor...</option>
                      {guruList.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jam Mulai (WITA)
                    </label>
                    <input
                      type="text"
                      placeholder="08:30"
                      value={addClassForm.jam_mulai}
                      onChange={(e) => setAddClassForm({ ...addClassForm, jam_mulai: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jam Selesai (WITA)
                    </label>
                    <input
                      type="text"
                      placeholder="09:30"
                      value={addClassForm.jam_selesai}
                      onChange={(e) => setAddClassForm({ ...addClassForm, jam_selesai: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kapasitas Maksimal (Siswa)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={addClassForm.kapasitas}
                    onChange={(e) => setAddClassForm({ ...addClassForm, kapasitas: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Standar AHE: maksimal 6 siswa per kelompok privat.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? "Menyimpan..." : "Buat Kelas Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Kelas */}
      {editClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <form onSubmit={handleSaveEditClass} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Rombel Kelas</h3>
                <p className="text-xs text-slate-400">
                  Perbarui nama, pengajar, jadwal, atau kapasitas rombel
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Rombel Kelas
                  </label>
                  <input
                    type="text"
                    required
                    value={editClassForm.nama}
                    onChange={(e) => setEditClassForm({ ...editClassForm, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tutor Pengampu
                    </label>
                    <select
                      value={editClassForm.guru_id}
                      onChange={(e) => setEditClassForm({ ...editClassForm, guru_id: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                    >
                      {guruList.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Status Kelas
                    </label>
                    <select
                      value={editClassForm.status}
                      onChange={(e) => setEditClassForm({ ...editClassForm, status: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jam Mulai
                    </label>
                    <input
                      type="text"
                      value={editClassForm.jam_mulai}
                      onChange={(e) => setEditClassForm({ ...editClassForm, jam_mulai: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jam Selesai
                    </label>
                    <input
                      type="text"
                      value={editClassForm.jam_selesai}
                      onChange={(e) => setEditClassForm({ ...editClassForm, jam_selesai: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kapasitas Maksimal
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editClassForm.kapasitas}
                    onChange={(e) => setEditClassForm({ ...editClassForm, kapasitas: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditClassModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Daftar Siswa di Kelas */}
      {classStudentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  Daftar Siswa Terdaftar
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {classStudentsModal.kelas.nama}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setClassStudentsModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {classStudentsModal.loading ? (
              <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>Memuat data siswa...</span>
              </div>
            ) : classStudentsModal.students.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {classStudentsModal.students.map((s: any, idx: number) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{s.nama}</span>
                        <span className="text-[10px] text-slate-400">
                          {s.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"} • Jenjang: {s.level_saat_ini}
                        </span>
                      </div>
                    </div>
                    {s.orangtua && (
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          {s.orangtua.nama}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {s.orangtua.no_wa}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada siswa aktif yang dialokasikan di kelas ini.
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>
                Total: <strong>{classStudentsModal.students.length}</strong> / {classStudentsModal.kelas.kapasitas} Siswa
              </span>
              <button
                type="button"
                onClick={() => setClassStudentsModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detail Profil & Perkembangan Siswa */}
      {studentDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in">
            {studentDetailModal.loading ? (
              <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <span>Memuat data lengkap siswa...</span>
              </div>
            ) : studentDetailModal.student ? (
              <div className="space-y-6">
                {/* Header Profil */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 font-black text-xl flex items-center justify-center shadow-2xs">
                      {studentDetailModal.student.nama.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                          {studentDetailModal.student.nama}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            studentDetailModal.student.status === "aktif"
                              ? "bg-emerald-100 text-emerald-800"
                              : studentDetailModal.student.status === "lulus"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {studentDetailModal.student.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {studentDetailModal.student.tempat_lahir}, {studentDetailModal.student.tanggal_lahir} •{" "}
                        {studentDetailModal.student.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStudentDetailModal(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Info Rombel & Wali */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Alokasi Kelas & Pengajar
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">
                        {studentDetailModal.student.kelas?.nama || "Belum dialokasikan"}
                      </span>
                      <span className="text-slate-500 text-[11px] block">
                        Tutor: {studentDetailModal.student.guru?.nama || "-"}
                      </span>
                    </div>
                    {studentDetailModal.student.kelas && (
                      <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 font-mono">
                        Jadwal: {studentDetailModal.student.kelas.jadwal_hari?.join(", ")} ({studentDetailModal.student.kelas.jam_mulai} - {studentDetailModal.student.kelas.jam_selesai} WITA)
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                      Data Wali Murid
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">
                        {studentDetailModal.student.orangtua?.nama || "-"} ({studentDetailModal.student.orangtua?.hubungan || "Wali"})
                      </span>
                      <a
                        href={`https://wa.me/${studentDetailModal.student.orangtua?.no_wa?.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 mt-0.5 text-[11px]"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{studentDetailModal.student.orangtua?.no_wa || "-"}</span>
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate pt-1 border-t border-slate-200/60">
                      {studentDetailModal.student.orangtua?.alamat || "Alamat belum diisi"}
                    </p>
                  </div>
                </div>

                {/* 5 Indikator Kemampuan */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    5 Indikator Kemampuan Membaca (Metode AHE)
                  </h4>
                  {studentDetailModal.student.progress_indikator &&
                  studentDetailModal.student.progress_indikator.length > 0 ? (
                    (() => {
                      const latest =
                        studentDetailModal.student.progress_indikator[
                          studentDetailModal.student.progress_indikator.length - 1
                        ];
                      const indicators = [
                        { label: "1. Mengenal Huruf", val: latest.mengenal_huruf },
                        { label: "2. Membaca Suku Kata", val: latest.membaca_suku_kata },
                        { label: "3. Membaca Kata", val: latest.membaca_kata },
                        { label: "4. Membaca Kalimat", val: latest.membaca_kalimat },
                        { label: "5. Membaca Cerita", val: latest.membaca_cerita },
                      ];

                      return (
                        <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {indicators.map((ind) => (
                            <div key={ind.label} className="text-xs">
                              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                                <span>{ind.label}</span>
                                <span className="font-bold text-purple-700">{ind.val}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-2 bg-purple-600 rounded-full transition-all"
                                  style={{ width: `${ind.val}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      Belum ada catatan progres indikator untuk siswa ini.
                    </p>
                  )}
                </div>

                {/* Riwayat Sesi Terakhir */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    Riwayat Sesi Belajar Terakhir
                  </h4>
                  {studentDetailModal.student.riwayat_sesi &&
                  studentDetailModal.student.riwayat_sesi.length > 0 ? (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {studentDetailModal.student.riwayat_sesi.slice(-4).reverse().map((ses: any) => (
                        <div
                          key={ses.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{ses.materi || "Sesi Rutin"}</span>
                            <span className="text-[10px] text-slate-400">{ses.tanggal}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ses.status_hadir === "hadir"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {ses.status_hadir}
                            </span>
                            {ses.nilai !== null && (
                              <span className="font-extrabold text-purple-700 text-xs">
                                Skor: {ses.nilai}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Belum ada riwayat sesi belajar tercatat.</p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        openEditStudent(studentDetailModal.student);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Siswa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openTransferClass(studentDetailModal.student);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Pindah Kelas</span>
                    </button>
                    <Link
                      href={`/laporan/rapor/${studentDetailModal.student.id}`}
                      target="_blank"
                      className="px-4 py-2.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Buka Rapor</span>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStudentDetailModal(null)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal: Edit Siswa */}
      {editStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <form onSubmit={handleSaveEditStudent} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Data Siswa</h3>
                <p className="text-xs text-slate-400">
                  Perbarui identitas, jenjang level, atau alokasi rombel kelas
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Anak *
                  </label>
                  <input
                    type="text"
                    required
                    value={editStudentForm.nama}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      value={editStudentForm.tempat_lahir}
                      onChange={(e) =>
                        setEditStudentForm({ ...editStudentForm, tempat_lahir: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={editStudentForm.tanggal_lahir}
                      onChange={(e) =>
                        setEditStudentForm({ ...editStudentForm, tanggal_lahir: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={editStudentForm.jenis_kelamin}
                      onChange={(e) =>
                        setEditStudentForm({ ...editStudentForm, jenis_kelamin: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jenjang Kurikulum
                    </label>
                    <select
                      value={editStudentForm.level_saat_ini}
                      onChange={(e) =>
                        setEditStudentForm({ ...editStudentForm, level_saat_ini: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                    >
                      <option value="pra-membaca">Pra Membaca</option>
                      <option value="level-1">Level 1</option>
                      <option value="level-2">Level 2</option>
                      <option value="level-3">Level 3</option>
                      <option value="lanjutan">Lanjutan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alokasi Rombel Kelas
                  </label>
                  <select
                    value={editStudentForm.kelas_id}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, kelas_id: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="">Belum Memilih Kelas...</option>
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama} ({k.siswa_count}/{k.kapasitas} Siswa) • Tutor: {k.guru_nama || k.guru?.nama || "-"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditStudentModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Alokasikan Siswa dari Waiting List ke Kelas */}
      {assignWaitingListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <form onSubmit={handleAssignWaitingList} className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  Antrean #{assignWaitingListModal.urutan_antrian}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Alokasikan Siswa ke Rombel Kelas
                </h3>
                <p className="text-xs text-slate-400">
                  Calon Siswa: <strong>{assignWaitingListModal.pendaftaran?.nama_anak}</strong> ({assignWaitingListModal.program?.nama || "Level Program"})
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pilih Kelas yang Memiliki Kuota Tersedia *
                  </label>
                  <select
                    required
                    value={selectedClassForWlAssign}
                    onChange={(e) => setSelectedClassForWlAssign(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="">Pilih Rombel Kelas...</option>
                    {kelasList
                      .filter((k) => k.status === "aktif" && (k.siswa_count || 0) < k.kapasitas)
                      .map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.nama} (Sisa Kuota: {k.kapasitas - (k.siswa_count || 0)} kursi) • Tutor: {k.guru_nama || k.guru?.nama || "-"}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  Setelah dialokasikan, status antrean akan berubah menjadi <strong>ditempatkan</strong> dan siswa dapat langsung mengikuti sesi belajar sesuai jadwal rombel.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignWaitingListModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? "Memproses..." : "Konfirmasi Alokasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Pindah Rombel / Jadwal Kelas Siswa */}
      {transferClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <form onSubmit={handleSaveTransferClass} className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  Prosedur Resmi Pindah Kelas
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Pindah Jadwal / Rombel Siswa
                </h3>
                <p className="text-xs text-slate-500">
                  Siswa: <strong>{transferClassModal.nama}</strong> ({transferClassModal.level_saat_ini})
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Rombel Saat Ini:</span>
                  <span className="font-bold text-slate-900">{transferClassModal.kelas?.nama || "Belum ada kelas"}</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kelas Tujuan (Kuota Tersedia) *
                  </label>
                  <select
                    required
                    value={transferClassForm.ke_kelas_id}
                    onChange={(e) =>
                      setTransferClassForm({ ...transferClassForm, ke_kelas_id: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="">Pilih Kelas Tujuan...</option>
                    {kelasList
                      .filter(
                        (k) =>
                          k.status === "aktif" &&
                          k.id !== transferClassModal.kelas_id &&
                          (k.siswa_count || 0) < k.kapasitas
                      )
                      .map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.nama} ({k.siswa_count}/{k.kapasitas} Siswa) • Jadwal: {k.jadwal_hari?.join(", ")} ({k.jam_mulai} WITA)
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alasan Pemindahan *
                  </label>
                  <select
                    value={transferClassForm.alasan}
                    onChange={(e) =>
                      setTransferClassForm({ ...transferClassForm, alasan: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="Penyesuaian jadwal orang tua">Penyesuaian jadwal orang tua</option>
                    <option value="Permintaan ganti sesi pagi/siang">Permintaan ganti sesi pagi/siang</option>
                    <option value="Evaluasi adaptasi tutor & kelompok">Evaluasi adaptasi tutor & kelompok</option>
                    <option value="Alasan lainnya">Alasan lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Mulai berlaku efektif sesi hari Rabu depan..."
                    value={transferClassForm.catatan}
                    onChange={(e) =>
                      setTransferClassForm({ ...transferClassForm, catatan: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTransferClassModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? "Memproses..." : "Konfirmasi Pindah Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Akun Pengguna Baru */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Buat Akun Pengguna Baru</h3>
                <p className="text-xs text-slate-400">
                  Daftarkan akun login sistem untuk staf admin, pengajar, atau wali murid
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bu Ratna Dewi / Admin Operasional"
                    value={addUserForm.nama}
                    onChange={(e) => setAddUserForm({ ...addUserForm, nama: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Email (Username Login) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@ahe-karangjoang.id"
                    value={addUserForm.email}
                    onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Peran / Hak Akses *
                    </label>
                    <select
                      value={addUserForm.role}
                      onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white"
                    >
                      <option value="tutor">Tutor Pengajar</option>
                      <option value="admin">Administrator</option>
                      <option value="orangtua">Orang Tua Murid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Password Login Awal *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min. 6 karakter"
                      value={addUserForm.password}
                      onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? "Menyimpan..." : "Daftarkan Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Hasil Reset Password Akun Pengguna */}
      {resetUserPasswordResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 animate-in fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Kata Sandi Berhasil Direset!
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Akun <strong>{resetUserPasswordResult.nama}</strong> ({resetUserPasswordResult.role}) telah diperbarui.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 mb-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Email Login:</span>
                <span className="font-bold text-slate-800 break-all">{resetUserPasswordResult.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Password Baru:</span>
                <span className="font-bold text-purple-700 text-sm">{resetUserPasswordResult.password_baru}</span>
              </div>
            </div>

            <div className="space-y-2">
              {resetUserPasswordResult.no_wa && (
                <a
                  href={`https://wa.me/${resetUserPasswordResult.no_wa.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Halo ${resetUserPasswordResult.nama}, kata sandi akun portal AHE Anda telah direset oleh Administrator.\n\nEmail: ${resetUserPasswordResult.email}\nPassword: ${resetUserPasswordResult.password_baru}\n\nSilakan login di http://localhost:3000/login`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Password via WhatsApp</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setResetUserPasswordResult(null)}
                className="w-full py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Hasil Alokasi Waiting List - Kredensial Akun */}
      {wlAcceptResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Alokasi Waiting List Berhasil!
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              <strong>{wlAcceptResult.nama_anak}</strong> telah resmi terdaftar di kelas{" "}
              <strong>{wlAcceptResult.kelas_nama}</strong> dan dikeluarkan dari antrean waiting list.
            </p>

            {wlAcceptResult.akun ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 mb-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Kredensial Login Portal Orang Tua:
                </p>
                <div className="font-mono text-xs space-y-1">
                  <div>
                    <span className="text-slate-500">Email:</span>{" "}
                    <strong className="text-slate-900">{wlAcceptResult.akun.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Password:</span>{" "}
                    <strong className={`${wlAcceptResult.akun.password.startsWith("ahe-") ? "text-purple-700" : "text-slate-600"}`}>
                      {wlAcceptResult.akun.password}
                    </strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Sampaikan kredensial ini ke wali murid via WhatsApp. Orang tua wajib mengganti password setelah login pertama.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-left mb-4 text-xs text-amber-800">
                Orang tua (<strong>{wlAcceptResult.nama_ortu}</strong>) sudah memiliki akun portal. Kredensial tetap menggunakan password sebelumnya.
              </div>
            )}

            <div className="space-y-2">
              {wlAcceptResult.no_wa_ortu && wlAcceptResult.akun?.password.startsWith("ahe-") && (
                <a
                  href={`https://wa.me/${wlAcceptResult.no_wa_ortu.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Halo Bapak/Ibu ${wlAcceptResult.nama_ortu}, ananda ${wlAcceptResult.nama_anak} telah resmi dialokasikan ke kelas ${wlAcceptResult.kelas_nama} di AHE Karang Joang.\n\nAkun Portal Orang Tua:\nEmail: ${wlAcceptResult.akun.email}\nPassword: ${wlAcceptResult.akun.password}\n\nSilakan login di http://localhost:3000/login`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Kredensial via WhatsApp</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setWlAcceptResult(null)}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs cursor-pointer transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rincian Sesi Belajar & Presensi Peserta (Monitoring KBM) */}
      {sessionDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in">
            {sessionDetailModal.loading ? (
              <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <span>Memuat rincian sesi belajar...</span>
              </div>
            ) : sessionDetailModal.sesi ? (
              <div className="space-y-6">
                {/* Header Sesi */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 font-black text-lg flex items-center justify-center shadow-2xs">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                          {sessionDetailModal.sesi.kelas?.nama || "Sesi Belajar"}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                            sessionDetailModal.sesi.status_sesi === "selesai"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : sessionDetailModal.sesi.status_sesi === "dibatalkan"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {sessionDetailModal.sesi.status_sesi}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">
                        {sessionDetailModal.sesi.tanggal} • {sessionDetailModal.sesi.jam_mulai} - {sessionDetailModal.sesi.jam_selesai} WITA
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSessionDetailModal(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Sesi Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                      Tutor Pengajar
                    </span>
                    <span className="font-bold text-slate-900 block text-sm">
                      {sessionDetailModal.sesi.guru?.nama || "Tutor AHE"}
                    </span>
                    {sessionDetailModal.sesi.guru_pengganti && (
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block font-semibold border border-amber-200">
                        Pengganti: {sessionDetailModal.sesi.guru_pengganti.nama}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                      Materi Pembelajaran
                    </span>
                    <span className="font-bold text-slate-900 block text-sm">
                      {sessionDetailModal.sesi.materi || "Membaca Fonik AHE"}
                    </span>
                    <p className="text-[11px] text-slate-500 italic">
                      &ldquo;{sessionDetailModal.sesi.catatan_umum || "Tidak ada catatan umum"}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Daftar Siswa, Presensi & Evaluasi */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Presensi & Penilaian Peserta ({sessionDetailModal.sesi.peserta?.length || 0} Anak)
                    </h4>
                  </div>

                  {sessionDetailModal.sesi.peserta && sessionDetailModal.sesi.peserta.length > 0 ? (
                    <div className="space-y-2.5">
                      {sessionDetailModal.sesi.peserta.map((p: any, idx: number) => (
                        <div
                          key={p.siswa_id || idx}
                          className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                                {p.nama}
                              </span>
                              {p.catatan && (
                                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                                  Catatan: &ldquo;{p.catatan}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            <span
                              className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                p.status_absen === "hadir"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : p.status_absen === "izin"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : p.status_absen === "sakit"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {p.status_absen}
                            </span>

                            {p.nilai !== null && p.nilai !== undefined && (
                              <div className="text-right font-mono">
                                <span className="text-[10px] text-slate-400 block">Nilai</span>
                                <span className="font-black text-purple-700 text-sm">{p.nilai}</span>
                              </div>
                            )}

                            {p.mood && (
                              <div className="flex items-center gap-0.5 text-amber-500" title={`Mood: ${p.mood}/5`}>
                                {[...Array(p.mood)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                      Belum ada rincian presensi siswa untuk sesi ini.
                    </div>
                  )}
                </div>

                {/* Footer Modal */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setSessionDetailModal(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
