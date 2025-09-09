
// This file is no longer needed as RevenueCat handles the checkout session.
// You can safely delete it. We are keeping it here to avoid breaking changes,
// but it is not used in the application flow anymore.
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Use RevenueCat SDK for purchases.' },
    { status: 410 }
  );
}
