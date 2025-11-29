"use client";

import React from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function ErrorPage ({ statusCode = 404, message, detail }) {
  const defaultMessage =
    statusCode === 404
      ? "Oops! The page you are looking for does not exist."
      : "Something went wrong. Please try again later.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <TriangleAlert className="mx-auto mb-6 h-16 w-16 text-red-500"/>
        <h1 className="text-6xl font-bold text-white">{statusCode}</h1>
        <p className="mt-4 text-sm text-white">{message || defaultMessage}</p>
        <p className="mt-4 text-l text-red-500">{'<< '+detail+' >>' || ""}</p>
        <Link
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

