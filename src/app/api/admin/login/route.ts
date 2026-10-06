import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Server-side environment password with default fallback
    const serverPassword = process.env.ADMIN_PASSWORD || 'Noticias2016!';

    if (password === serverPassword) {
      return NextResponse.json({
        success: true,
        token: 'authenticated_editor_in_chief',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Contraseña incorrecta.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error del servidor al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
