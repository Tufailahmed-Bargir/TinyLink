import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

 
 export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
//   @ts-ignore
): Promise<NextResponse> { // Add explicit return type Promise<NextResponse>
    try{
  const { code } = await  params;
  console.log('code is', code);

  const findOriginalLink = await prisma.link.findUnique({
    where:{
        code
    }
  })

  if(!findOriginalLink){
   return new NextResponse('Link Not Found', { status: 404 });
  }

  await prisma.link.update({
    where:{code:code},
    data:{
    
          totalClicks: { increment: 1 },
          lastClicked: new Date(),
         
    }
  })

  return NextResponse.redirect(findOriginalLink.targetUrl, 302)
}catch(e){
    return NextResponse.json({
        msg:"error found!",
        // @ts-expect-error some type issue
        error:e.message
    })
}
}