import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  redirect("https://nextjs.org/");
  const body = await req.json();
  const { email, password } = body;
  console.log(body);
}
