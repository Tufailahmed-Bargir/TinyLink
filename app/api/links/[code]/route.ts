 
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
 

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
        error:e.message
    })
}
  
  }
