"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Header() {
  const { user } = useCurrentUser();

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-1 shadow-xs mb-6">
      <div className="relative w-full max-w-md"></div>
      <div className="flex items-center gap-3">
        <p className="font-semibold text-gray-700 text-sm">{user?.email}</p>
        <div className="bg-gray-50 border border-gray-200 text-gray-800 px-2.5 py-1 rounded-full flex items-center justify-center">
          <i className="bi bi-person-fill text-lg" />
        </div>
      </div>
    </header>
  );
}
