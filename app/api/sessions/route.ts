import { NextResponse } from "next/server";

export async function GET() {
  // Empty array as we reset all activity logs for the demo.
  return NextResponse.json({ sessions: [] });
}
