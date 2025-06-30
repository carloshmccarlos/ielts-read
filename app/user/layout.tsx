import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { BookMarked, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Check if user is authenticated
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		return redirect("/auth/login");
	}

	return (
		<div className="container mx-auto py-6">
			<div className="grid grid-cols-1 md:grid-cols-11 gap-4">
				{/* Sidebar Navigation */}
				<aside className="md:col-span-2 lg:col-span-1">
					<nav className="space-y-2 sticky top-24">
						<Link href="/user/collection">
							<Button
								variant="ghost"
								className="w-full justify-start items-center cursor-pointer text-lg"
							>
								<BookMarked className=" h-4 w-4" />
								Collection
							</Button>
						</Link>
						<Link href="/user/profile">
							<Button
								variant="ghost"
								className="w-full justify-start items-center cursor-pointer text-lg"
							>
								<User className=" h-4 w-4" />
								Profile
							</Button>
						</Link>
					</nav>
				</aside>

				{/* Main Content */}
				<main className="md:col-span-9 lg:col-span-10">{children}</main>
			</div>
		</div>
	);
}
