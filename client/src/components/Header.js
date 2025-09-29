"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-secondary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <h1 className="text-xl font-bold">Case App</h1>
        <nav className="space-x-4">
          <Link href="/cases" className="hover:text-gray-300 transition">
            Cases
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
