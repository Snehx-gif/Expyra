import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const alert = await db.alert.findUnique({
      where: {
        id: id,
      },
    });

    if (!alert) {
      return new NextResponse("Alert not found", { status: 404 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error("[ALERT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id:string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const values = await req.json();
    const alert = await db.alert.update({
      where: {
        id: id,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error("[ALERT_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const alert = await db.alert.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error("[ALERT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}