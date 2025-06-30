"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "未知错误";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-red-600">
            认证错误
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error}
          </p>
        </div>
        
        <div className="text-center">
          <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            返回登录
          </Link>
        </div>
      </div>
    </div>
  );
} 