"use server";

import { redirect } from "next/navigation";
import { endSession, hashPassword, startSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface AuthState { error?: string }

export async function login(_: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const admin = form.get("admin") === "1";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) return { error: "Wrong email or password." };
  if (admin && user.role !== "ADMIN") return { error: "This account is not an admin." };

  await startSession(user.id);
  redirect(admin ? "/admin" : "/account");
}

export async function signup(_: AuthState, form: FormData): Promise<AuthState> {
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const phone = String(form.get("phone") ?? "").trim() || null;
  const password = String(form.get("password") ?? "");

  if (name.length < 2) return { error: "Enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  // A guest who checked out before has a row with no password — let them claim it.
  if (existing?.passwordHash) return { error: "An account with this email already exists. Log in instead." };

  const user = existing
    ? await prisma.user.update({ where: { id: existing.id }, data: { name, phone, passwordHash: hashPassword(password) } })
    : await prisma.user.create({ data: { name, email, phone, passwordHash: hashPassword(password) } });

  await startSession(user.id);
  redirect("/account");
}

export async function logout() {
  await endSession();
  redirect("/");
}
