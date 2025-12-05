import { NextResponse } from 'next/server';

 
export async function GET() {
  const response = {
    ok: true,
    version: "1.0",
    database: "up"  
  };
  
  return NextResponse.json(response, { status: 200 }); 
}