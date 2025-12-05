import { prisma } from '@/lib/prisma';
import { generateRandomCode, isValidCode, isValidUrl } from '@/lib/validate';
 
 
import { NextRequest, NextResponse } from 'next/server';
 
 
 

export async function POST(req: NextRequest, res: NextResponse) {
  try{
    const body = await req.json();
    const {targetUrl} = body;
    var {customCode} = body;
    console.log('data received is', targetUrl, customCode);
    
    if(!targetUrl){
        return NextResponse.json({
            msg:"provide the target-link"
        })
    }
    if(customCode===''){
        customCode = generateRandomCode()
    }
    // Validate targetUrl
    if (!isValidUrl(targetUrl)) {
      return NextResponse.json({ error: 'Invalid URL format' },{status:400});
    }

    let code = customCode;
    if (code) {
      // Validate custom code format
      if (!isValidCode(code)) {
         return NextResponse.json({ error: 'Custom code must be 6-8 alpha-numerical characters!' },{status:400});
      }
      // Check uniqueness
      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) {
        return NextResponse.json({ error: 'Custom code  already exists' },{status:409});
      }
    } else {
      // Generate random code until unique (retry up to 10 times to avoid infinite loop)
      for (let i = 0; i < 10; i++) {
        code = generateRandomCode(Math.floor(Math.random() * 3) + 6); // 6-8 length
        const existing = await prisma.link.findUnique({ where: { code } });
        if (!existing) break;
      }
      if (!code) {
        return NextResponse.json({ error: 'fail to generate the unique code!' },{status:500});
      }
    }

    const shortLink = 'https://tinylink.tufail.tech/'+code;
    console.log('the generated shhort code is', shortLink);
    
    // Create link
    const link = await prisma.link.create({
      data: {
        code,
        targetUrl,
        shortLink
      },
    });

  return NextResponse.json({ msg: 'link created success!', link },{status:200});
  } catch(e) {
    return NextResponse.json({
        msg:"some error",
        // @ts-expect-error some error
        error:e.message
    })
  }
}

export async function GET(){

    try {
       const allLinks = await prisma.link.findMany() 
       return NextResponse.json({
        msg:"these are all the links from db!",
        links:allLinks
       }, {status:200})
    } catch (error) {
        return NextResponse.json({
            msg:"error found",
            // @ts-expect-error some error
            error:error.message
        })
    }
}



