import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendorMaterialClasses } from "@/shared/schema";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const materialClasses = await db.select().from(vendorMaterialClasses);
    return NextResponse.json(materialClasses);
  } catch (error) {
    console.error("Error fetching material classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch material classes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { vendorId, materialClass } = body;

    const newMaterialClass = await db
      .insert(vendorMaterialClasses)
      .values({
        vendorId: parseInt(vendorId),
        materialClass,
      })
      .returning();

    return NextResponse.json(newMaterialClass[0]);
  } catch (error) {
    console.error("Error creating material class:", error);
    return NextResponse.json(
      { error: "Failed to create material class" },
      { status: 500 }
    );
  }
} 