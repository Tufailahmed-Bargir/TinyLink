// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// type Params = { code: string };

// // GET /:code - Redirect (302 or 404)
// export async function GET(
//   request: NextRequest,
//   // Ensure correct access to params
//   { params }: { params: Params | Promise<Params> }
// ): Promise<NextResponse> {
  
//   let code: string;
//   try {
//     const { code: resolvedCode } = await params;
//     code = resolvedCode;
//   } catch (error) {
//     return new NextResponse('Bad Request', { status: 400 });
//   }

//   // 2. Perform Lookup and Update in a Transaction
//   try {
//     const link = await prisma.$transaction(async (tx) => {
      
//       const existingLink = await tx.link.findUnique({
//         where: { code: code },
//       });

//       // Handle deletion check: If link is not found, return 404 [cite: 29]
//       if (!existingLink) {
//         return null; 
//       }

//       // Increment total-click count and update last clicked time 
//       await tx.link.update({
//         where: { code: code },
//         data: {
//           totalClicks: { increment: 1 },
//           lastClickedAt: new Date(),
//         },
//       });

//       return existingLink; 
//     });

//     // 3. Handle Not Found (404)
//     if (!link) {
//       return new NextResponse('Not Found', { status: 404 }); // Required status for non-existent code 
//     }

//     // 4. Perform HTTP 302 Redirect
//     // Visiting /{code} performs an HTTP 302 redirect to the original URL [cite: 25]
//     return NextResponse.redirect(link.targetUrl, 302);

//   } catch (error) {
//     console.error('Redirect/Transaction error:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }




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