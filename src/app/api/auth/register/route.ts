import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/service/userService";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await createUser(body);

  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ id: result.id }, { status: 201 });
}
