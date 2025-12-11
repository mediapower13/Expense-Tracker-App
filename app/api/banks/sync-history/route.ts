import { NextResponse } from "next/server"

export async function GET() {
  // Return sync history from the main sync route
  const syncModule = await import("../sync/route")
  return syncModule.GET()
}
