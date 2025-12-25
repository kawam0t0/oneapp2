import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

function calculateWarrantyInfo(replacedAt: string) {
  const replacedDate = new Date(replacedAt)
  const today = new Date()
  const warrantyEndDate = new Date(replacedDate)
  warrantyEndDate.setMonth(warrantyEndDate.getMonth() + 6)

  const diffTime = warrantyEndDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    is_under_warranty: diffDays > 0,
    warranty_remaining_days: diffDays > 0 ? diffDays : 0,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")

    if (!storeId) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 })
    }

    let records
    if (storeId === "0") {
      // Admin: 全店舗の履歴を取得
      records = await query(
        `SELECT pr.*, s.store_name 
         FROM parts_replacements pr 
         LEFT JOIN stores s ON pr.store_id = s.id 
         ORDER BY pr.replaced_at DESC, pr.created_at DESC`,
      )
    } else {
      // 各店舗: 自店舗の履歴のみ取得
      records = await query(
        `SELECT pr.*, s.store_name 
         FROM parts_replacements pr 
         LEFT JOIN stores s ON pr.store_id = s.id 
         WHERE pr.store_id = ? 
         ORDER BY pr.replaced_at DESC, pr.created_at DESC`,
        [storeId],
      )
    }

    const recordsWithWarranty = records.map((record: any) => {
      const warrantyInfo = calculateWarrantyInfo(record.replaced_at)
      return {
        ...record,
        ...warrantyInfo,
      }
    })

    return NextResponse.json(recordsWithWarranty)
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Failed to fetch parts replacement records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, replacedAt, parts } = body

    if (!storeId || !replacedAt || !parts || !Array.isArray(parts) || parts.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const groupedParts = new Map<string, any>()

    for (const part of parts) {
      const { position, partCategory, partName, quantity, notes } = part

      if (!partCategory || !partName) {
        throw new Error("Part category and name are required")
      }

      // position + partCategory + partName の組み合わせでキーを作成
      const key = `${position || ""}|${partCategory}|${partName}`

      if (groupedParts.has(key)) {
        // 既存のグループに数量を加算し、備考を結合
        const existing = groupedParts.get(key)
        existing.quantity += quantity || 1
        if (notes && notes.trim()) {
          existing.notes = existing.notes ? `${existing.notes}, ${notes}` : notes
        }
      } else {
        // 新しいグループを作成
        groupedParts.set(key, {
          position: position || null,
          partCategory,
          partName,
          quantity: quantity || 1,
          notes: notes?.trim() || null,
        })
      }
    }

    // グループ化された部品をINSERT
    const insertPromises = Array.from(groupedParts.values()).map((part) => {
      return query(
        `INSERT INTO parts_replacements (store_id, position, part_category, part_name, quantity, notes, replaced_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [storeId, part.position, part.partCategory, part.partName, part.quantity, part.notes, replacedAt],
      )
    })

    await Promise.all(insertPromises)

    return NextResponse.json({ success: true, count: groupedParts.size })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Failed to create parts replacement records" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 })
    }

    await query("DELETE FROM parts_replacements WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Failed to delete parts replacement record" }, { status: 500 })
  }
}
