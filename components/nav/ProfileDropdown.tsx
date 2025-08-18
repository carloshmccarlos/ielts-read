"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useSession";
import { authClient } from "@/lib/auth/auth-client";
import { BookMarked, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProfileDropdown() {
	const { user, isLoading } = useCurrentUser();
	const [isSigningOut, setIsSigningOut] = useState(false);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-black hover:text-white">
				{isLoading ? (
					<div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
				) : (
					<User className="h-8 w-8 font-bold" />
				)}

			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild className={"cursor-pointer text-[16px]"}>
					<Link href="/user/collection">
						<BookMarked className="h-4 w-4 inline" />
						Collection
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild className={"cursor-pointer text-[16px]"}>
					<Link href="/user/profile">
						<User className="h-4 w-4 inline" />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />

				{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
				{(user as any)?.role === "ADMIN" && (
					<DropdownMenuItem asChild className={"cursor-pointer text-[16px]"}>
						<Link href="/admin">
							<User className="h-4 w-4 inline" />
							Dashboard
						</Link>
					</DropdownMenuItem>
				)}

				<DropdownMenuItem
					className={"cursor-pointer text-[16px]"}
					onClick={async () => {
						if (!isSigningOut) {
							setIsSigningOut(true);
							try {
								await authClient.signOut();
							} catch (error) {
								console.error("Sign out failed:", error);
							} finally {
								setIsSigningOut(false);
							}
						}
					}}
				>
					<LogOut className="h-4 w-4 inline" />
					{isSigningOut ? "Signing out..." : "Sign out"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
