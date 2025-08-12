import Link from "next/link";
import { getAdminStats } from "@/lib/actions/admin";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";

// Server component for admin stats
async function AdminStatsContent() {
	const { stats } = await getAdminStats();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat) => (
				<div
					key={stat.name}
					className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
				>
					<p className="text-sm font-medium text-gray-500">{stat.name}</p>
					<p className="text-3xl font-bold mt-2">{stat.value}</p>
				</div>
			))}
		</div>
	);
}

// Loading component for stats
function AdminStatsLoading() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-pulse"
				>
					<div className="h-4 bg-gray-200 rounded mb-2"></div>
					<div className="h-8 bg-gray-200 rounded"></div>
				</div>
			))}
		</div>
	);
}

export default function AdminDashboard() {
	return (
		<div className="space-y-6 max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<div>
				<h1 className="text-3xl font-bold">Admin Dashboard</h1>
				<p className="text-gray-500 mt-1">Overview of your site statistics</p>
			</div>

			{/* Stats Grid with Suspense */}
			<Suspense fallback={<AdminStatsLoading />}>
				<AdminStatsContent />
			</Suspense>

			{/* Recent Activity Section */}
			<div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-6">
				<h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Link
						href="/admin/create"
						className="bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
					>
						Create New Article
					</Link>

					<Link
						href="/admin/edit"
						className="bg-gray-600 text-white text-center py-3 px-4 rounded-md hover:bg-gray-700 transition-colors"
					>
						Manage Articles
					</Link>

					<Link
						href="/admin/users"
						className="bg-green-600 text-white text-center py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
					>
						Manage Users
					</Link>
				</div>
			</div>
		</div>
	);
}
