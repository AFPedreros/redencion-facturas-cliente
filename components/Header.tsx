"use client";

import { Receipt } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import UserNav from "./UserNav";

export default function Header() {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <div className="absolute left-0 right-0 flex items-center justify-between w-full gap-4 px-6 py-4 border-b border-black h-14 md:px-12">
          <div className="flex items-center justify-center">
            <Receipt className="mr-2 h-9 w-9 text-primary" />
            <h1 className="text-2xl">Redeen</h1>
          </div>
          {/* <UserNav email={user.email} /> */}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
