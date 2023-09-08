"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Receipt } from "lucide-react";

import UserNav from "./UserNav";

export default function SiteHeader() {
  const { user } = useAuth();

  return (
    <>
      {!user ? (
        <div className="fixed left-0 right-0 z-40 flex h-14 w-full items-center justify-between gap-4 border-b bg-background px-6 py-4 md:px-12">
          <Link
            href="/"
            className="flex cursor-pointer items-center justify-center"
          >
            <Receipt className="mr-2 h-9 w-9 text-primary" />
            <h1 className="text-2xl">Redeen</h1>
          </Link>
          {/* <UserNav email={user.email} /> */}
        </div>
      ) : null}
    </>
  );
}
