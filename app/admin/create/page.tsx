import { ArticleForm } from "@/components/ArticleForm";
import { getRoleByUserId } from "@/lib/actions/articles-with-user";
import { getUserSession } from "@/lib/auth/getUserSession";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateArticlePage() {
	const session = await getUserSession(await headers());
	const user = session?.user;

	if (!user?.id) {
		redirect("/auth/login");
	}

	// Check if user is admin
	const userRole = await getRoleByUserId(user.id);
	if (userRole?.role !== "ADMIN") {
		redirect("/");
	}

	return (
		<div className="w-full min-h-screen mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<div className="bg-white shadow-lg overflow-hidden rounded-lg">
				<div className="bg-slate-950 text-white py-8 px-6 sm:px-10">
					<div className="max-w-7xl mx-auto">
						<h1 className="text-3xl font-bold text-white">
							Create New Article
						</h1>
						<p className="mt-2 text-gray-300">
							Share your thoughts and ideas with the world
						</p>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-10 py-8">
					<ArticleForm />
				</div>
			</div>
		</div>
	);
}
