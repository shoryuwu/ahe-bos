import { NextResponse } from "next/server";
import { readDB, writeDB, now, logActivity } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const guru = db.guru.find((g) => g.id === id);

    if (!guru) {
      return NextResponse.json(
        { success: false, error: "Data guru tidak ditemukan." },
        { status: 404 }
      );
    }

    const classes = db.kelas.filter((k) => k.guru_id === id);
    const user = db.users.find((u) => u.id === guru.user_id);

    return NextResponse.json({
      success: true,
      data: {
        ...guru,
        user: user
          ? {
              id: user.id,
              email: user.email,
              is_active: user.is_active,
              last_login_at: user.last_login_at,
            }
          : null,
        kelas: classes,
      },
    });
  } catch (error) {
    console.error("Get detail guru error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data rincian guru." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDB();

    const idx = db.guru.findIndex((g) => g.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Data guru tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = db.guru[idx];
    db.guru[idx] = {
      ...current,
      nama: body.nama !== undefined ? body.nama : current.nama,
      no_wa: body.no_wa !== undefined ? body.no_wa : current.no_wa,
      spesialisasi: Array.isArray(body.spesialisasi) ? body.spesialisasi : current.spesialisasi,
      is_active: body.is_active !== undefined ? body.is_active : current.is_active,
      updated_at: now(),
    };

    // If active state changed, sync with user account
    if (body.is_active !== undefined && current.user_id) {
      const uIdx = db.users.findIndex((u) => u.id === current.user_id);
      if (uIdx !== -1) {
        db.users[uIdx].is_active = body.is_active;
        db.users[uIdx].updated_at = now();
      }
    }

    logActivity(db, "system", "Edit Guru", `Memperbarui profil tutor ${db.guru[idx].nama}`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: db.guru[idx],
      message: "Data guru berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update guru error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data guru." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();

    const guru = db.guru.find((g) => g.id === id);
    if (!guru) {
      return NextResponse.json(
        { success: false, error: "Data guru tidak ditemukan." },
        { status: 404 }
      );
    }

    // CASCADE SAFETY RULE: Check if guru still holds active classes
    const activeClasses = db.kelas.filter(
      (k) => k.guru_id === id && k.status === "aktif"
    );

    if (activeClasses.length > 0) {
      const classNames = activeClasses.map((k) => k.nama).join(", ");
      return NextResponse.json(
        {
          success: false,
          error: `Guru tidak dapat dinonaktifkan/dihapus karena masih memegang ${activeClasses.length} kelas aktif (${classNames}). Silakan alihkan kelas ke tutor lain terlebih dahulu.`,
        },
        { status: 400 }
      );
    }

    // Soft delete
    guru.is_active = false;
    guru.updated_at = now();

    if (guru.user_id) {
      const user = db.users.find((u) => u.id === guru.user_id);
      if (user) {
        user.is_active = false;
        user.updated_at = now();
      }
    }

    logActivity(db, "system", "Nonaktifkan Guru", `Menonaktifkan guru ${guru.nama}`);
    writeDB(db);

    return NextResponse.json({
      success: true,
      data: null,
      message: "Guru dan akun tutor berhasil dinonaktifkan.",
    });
  } catch (error) {
    console.error("Delete guru error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menonaktifkan guru." },
      { status: 500 }
    );
  }
}
