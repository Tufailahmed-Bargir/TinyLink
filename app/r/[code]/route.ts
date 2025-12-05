import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
//   @ts-ignore
): Promise<NextResponse> { // Add explicit return type Promise<NextResponse>
  const { code } =await  params;
  console.log('code is', code);

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    // Find link
    const link = await prisma.link.findUnique({ where: { code } });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Atomically increment clicks and update lastClicked
    await prisma.link.update({
      where: { code },
      data: {
        totalClicks: { increment: 1 },
        lastClicked: new Date(),
      },
    });

    // Redirect to the target URL (307 preserves method, 302 is standard temporary redirect)
    return NextResponse.redirect(link.targetUrl, 307);
  } catch (err) {
    console.error("Redirect error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
