import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionSignature } from '../../../../lib/authServer';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session_token')?.value;
    const isAuthenticated = verifySessionSignature(token);

    return NextResponse.json({
      authenticated: isAuthenticated,
    });
  } catch {
    return NextResponse.json({
      authenticated: false,
    });
  }
}
