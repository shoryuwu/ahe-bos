import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export interface RaporPDFData {
  namaSiswa: string;
  nomorInduk?: string;
  level: string;
  bulan: string;
  namaGuru: string;
  nilaiRataRata: number;
  kehadiranPersen: number;
  catatanGuru: string;
  indikator: {
    mengenalHuruf: number;
    membacaSukuKata: number;
    membacaKata: number;
    membacaKalimat: number;
    membacaCerita: number;
  };
}

/**
 * Generate PDF Rapor Siswa dengan QR Code Validasi Digital
 */
export async function generateRaporPDF(data: RaporPDFData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Header Background
  doc.setFillColor(124, 58, 237); // Brand purple
  doc.rect(0, 0, 210, 38, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("BIMBINGAN BELAJAR AHE KARANG JOANG", 105, 16, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Laporan Perkembangan Belajar Membaca Siswa", 105, 26, { align: "center" });

  // Body content
  doc.setTextColor(30, 41, 59);

  // Student Info Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 45, 182, 35, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Nama Siswa:", 20, 54);
  doc.setFont("helvetica", "normal");
  doc.text(data.namaSiswa, 55, 54);

  doc.setFont("helvetica", "bold");
  doc.text("Level Saat Ini:", 20, 62);
  doc.setFont("helvetica", "normal");
  doc.text(data.level, 55, 62);

  doc.setFont("helvetica", "bold");
  doc.text("Periode / Bulan:", 20, 70);
  doc.setFont("helvetica", "normal");
  doc.text(data.bulan, 55, 70);

  doc.setFont("helvetica", "bold");
  doc.text("Tutor Pembimbing:", 110, 54);
  doc.setFont("helvetica", "normal");
  doc.text(data.namaGuru, 150, 54);

  doc.setFont("helvetica", "bold");
  doc.text("Tingkat Kehadiran:", 110, 62);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.kehadiranPersen}%`, 150, 62);

  doc.setFont("helvetica", "bold");
  doc.text("Nilai Rata-rata:", 110, 70);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.nilaiRataRata} / 100`, 150, 70);

  // Indikator Kemampuan Table Header
  doc.setFillColor(237, 233, 254);
  doc.rect(14, 88, 182, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(109, 40, 217);
  doc.text("Indikator Kemampuan Membaca (5 Pilar)", 20, 95);
  doc.text("Capaian (%)", 165, 95);

  // Indicators Row
  const items = [
    { label: "1. Mengenal Simbol & Bunyi Huruf (Fonik)", val: data.indikator.mengenalHuruf },
    { label: "2. Membaca & Menggabung Suku Kata", val: data.indikator.membacaSukuKata },
    { label: "3. Membaca Kata Utuh", val: data.indikator.membacaKata },
    { label: "4. Membaca Rangkaian Kalimat", val: data.indikator.membacaKalimat },
    { label: "5. Membaca & Menyimak Cerita Pendek", val: data.indikator.membacaCerita },
  ];

  let y = 106;
  doc.setTextColor(30, 41, 59);
  items.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.text(item.label, 20, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${item.val}%`, 175, y, { align: "right" });

    // Progress bar line
    doc.setDrawColor(226, 232, 240);
    doc.line(20, y + 3, 196, y + 3);

    y += 11;
  });

  // Catatan Guru Box
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(14, y + 5, 182, 30, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 83, 9);
  doc.text("Catatan & Evaluasi Perkembangan Tutor:", 20, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  const splitText = doc.splitTextToSize(data.catatanGuru || "Perkembangan membaca ananda sangat baik dan konsisten mengikuti tahapan belajar.", 170);
  doc.text(splitText, 20, y + 21);

  // Generate QR Code for Digital Verification
  const qrDataUrl = await QRCode.toDataURL(
    `https://ahe-karangjoang.id/verifikasi/rapor?siswa=${encodeURIComponent(data.namaSiswa)}&level=${encodeURIComponent(data.level)}`,
    { width: 100, margin: 1 }
  );

  // Footer & Signature
  const footerY = 225;
  doc.addImage(qrDataUrl, "PNG", 20, footerY - 5, 28, 28);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Pindai QR Code untuk", 20, footerY + 27);
  doc.text("verifikasi rapor digital", 20, footerY + 31);

  // Signatures
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text("Balikpapan, " + new Date().toLocaleDateString("id-ID", { dateStyle: "long" }), 145, footerY);
  doc.text("Tutor Pembimbing,", 145, footerY + 6);
  doc.setFont("helvetica", "bold");
  doc.text(data.namaGuru, 145, footerY + 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("AHE Karang Joang", 145, footerY + 33);

  return doc.output("blob");
}
