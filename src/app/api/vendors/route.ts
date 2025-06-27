import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors } from "@/shared/schema";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');

    let query = db.select().from(vendors);
    
    if (buyerId) {
      query = query.where(eq(vendors.buyerId, parseInt(buyerId)));
    }

    const allVendors = await query;
    return NextResponse.json(allVendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
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
    const {
      company_name,
      contact_name,
      email,
      phone,
      tier,
      location,
      material_class,
    } = body;

    const newVendor = await db
      .insert(vendors)
      .values({
        buyerId: user.id,
        companyName: company_name,
        contactName: contact_name,
        email,
        phone,
        tier,
        location,
      })
      .returning();

    return NextResponse.json(newVendor[0]);
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { error: "Failed to create vendor" },
      { status: 500 }
    );
  }
}
