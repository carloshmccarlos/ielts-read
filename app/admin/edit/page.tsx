import { ArticleTable } from "@/components/admin/ArticleTable";
import { auth } from "@/lib/auth/auth";
import { getUserSession } from "@/lib/auth/getUserSession";
import { getRoleByUserId } from "@/lib/data/user";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ManageArticlesPage() {
	const session = await getUserSession(await headers());

	if (!session?.user?.id) {
		redirect("/auth/login");
	}

	// Check if user is admin
	const userRole = await getRoleByUserId(session.user.id);
	if (userRole?.role !== "ADMIN") {
		redirect("/");
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Manage Articles</h1>
					<p className="text-muted-foreground mt-1">
						Edit or delete existing articles
					</p>
				</div>
			</div>

			<ArticleTable />
		</div>
	);
}
