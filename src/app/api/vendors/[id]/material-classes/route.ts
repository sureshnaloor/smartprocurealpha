import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendorMaterialClasses } from "@/shared/schema";
import { eq, and } from "drizzle-orm";
import { verifyAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const materialClasses = await db
      .select()
      .from(vendorMaterialClasses)
      .where(eq(vendorMaterialClasses.vendorId, parseInt(params.id)));

    return NextResponse.json(materialClasses);
  } catch (error) {
    console.error("Error fetching vendor material classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch material classes" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const materialClass = searchParams.get("materialClass");

    if (!materialClass) {
      return NextResponse.json(
        { error: "Material class parameter is required" },
        { status: 400 }
      );
    }

    const deletedMaterialClass = await db
      .delete(vendorMaterialClasses)
      .where(
        and(
          eq(vendorMaterialClasses.vendorId, parseInt(params.id)),
          eq(vendorMaterialClasses.materialClass, materialClass)
        )
      )
      .returning();

    if (deletedMaterialClass.length === 0) {
      return NextResponse.json(
        { error: "Material class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Material class deleted successfully" });
  } catch (error) {
    console.error("Error deleting material class:", error);
    return NextResponse.json(
      { error: "Failed to delete material class" },
      { status: 500 }
    );
  }
} 