import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quote from "@/models/Quote";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const file = formData.get("file") as File | null;
    const body = Object.fromEntries(formData);

    await connectDB();

    let layoutImageUrl = "";
    
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: "quote_layouts", 
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(buffer);
      });

      layoutImageUrl = uploadResult.secure_url;
    }

    const uniqueId = `QT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newQuote = await Quote.create({
      orderId: uniqueId,
      productName: body.productName,
      productImage: body.productImage,
      name: body.name,
      email: body.email,
      mobile: body.mobile,
      companyName: body.companyName,
      businessType: body.businessType,
      hotelStarRating: body.hotelStarRating,
      kitchenSize: body.kitchenSize,
      seatingCapacity: body.seatingCapacity,
      openingDate: body.openingDate,
      dailyProduction: body.dailyProduction,
      message: body.message,
      layoutImage: layoutImageUrl,
    });

    return NextResponse.json(
      { message: "Quote submitted successfully", orderId: uniqueId },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Quote Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}