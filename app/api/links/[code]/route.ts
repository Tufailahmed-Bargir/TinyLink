 
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
 
// rout to delete the link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
//   @ts-ignore
): Promise<NextResponse> { // Add explicit return type Promise<NextResponse>
  const { code } =await  params;
  console.log('code is', code);

    try{
    await prisma.link.delete({
    where:{
        code
    }
  })

  return NextResponse.json({
    msg:"link deleted success!",
     
  }, {status:200})
}catch(e){
    return NextResponse.json({
        msg:"error found!",
        // @ts-expect-error some error
        error:e.message
    })
}
  
  }

// get rout to get the link stat
  export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
//   @ts-ignore
): Promise<NextResponse> { // Add explicit return type Promise<NextResponse>
  const { code } =await  params;
  console.log('code is', code);

    try{
   const linkStat =  await prisma.link.findUnique({
    where:{
        code
    }, select: {
        code: true,
        targetUrl: true,
        totalClicks: true,  
        updatedAt:true,
        createdAt: true,
      },
  }

)

if (!linkStat) {
      return NextResponse.json({ error: `Link with code '${code}' not found.` }, { status: 404 });
    }

   
    return NextResponse.json({ 
      data: linkStat 
    }, { status: 200 });

 
}catch(e){
    return NextResponse.json({
        msg:"error found!",
        // @ts-expect-error some error
        error:e.message
    })
}
  
  }
