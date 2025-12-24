import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password, remember } = await request.json();
    
    // Check credentials against .env
    const validUsername = process.env.ADMIN_USER;
    const validPassword = process.env.ADMIN_PASS;
    
    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      );
    }

    if (username === validUsername && password === validPassword) {
      // Create response with auth cookie
      const response = NextResponse.json({ success: true });

      // Set auth cookie; maxAge expected in seconds
      const oneDaySec = 24 * 60 * 60; // 1 day
      const rememberSec = 30 * 24 * 60 * 60; // 30 days
      const maxAge = remember ? rememberSec : oneDaySec;
      response.cookies.set('auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  // Fall back to parsing the Cookie header so this works across runtimes
  const cookieHeader = request.headers.get('cookie') || '';
  const isAuth = /(?:^|;\s*)auth=/.test(cookieHeader);
  return NextResponse.json({ authenticated: !!isAuth });
}
