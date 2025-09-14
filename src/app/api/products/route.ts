
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        batches: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category, batchId, manufacturingDate, expiryDate, initialQuantity, image } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        image,
        batches: {
          create: {
            batchId,
            manufacturingDate: new Date(manufacturingDate),
            expiryDate: new Date(expiryDate),
            initialQuantity,
            currentQuantity: initialQuantity,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 },
    );
  }
}
