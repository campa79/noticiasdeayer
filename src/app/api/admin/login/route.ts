import { NextResponse } from 'next/server';
import { verifyAdminPassword, createSessionSignature } from '../../../../lib/authServer';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Contraseña requerida.' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta.' },
        { status: 401 }
      );
    }

    // Generate signed HMAC session token
    const token = createSessionSignature();

    const response = NextResponse.json({
      success: true,
      message: 'Autenticación exitosa',
    });

    // Set HttpOnly, SameSite cookie
    response.cookies.set('admin_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error del servidor al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
