import ProfileContent from "@/components/user/ProfileContent";
import { getUserProfile } from "@/lib/actions/user";
import { Suspense } from "react";

// Server component for profile data
async function ProfileDataContent() {
	const profileData = await getUserProfile();
	return <ProfileContent profileData={profileData} />;
}

// Loading component
function ProfileLoading() {
	return (
		<div className="container mx-auto py-10 px-4 md:px-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="col-span-1 animate-pulse">
					<div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
						<div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4" />
						<div className="h-6 bg-gray-200 rounded mb-2" />
						<div className="h-4 bg-gray-200 rounded mb-4" />
						<div className="space-y-2">
							{Array.from({ length: 4 }).map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<div key={i} className="flex justify-between">
									<div className="h-4 bg-gray-200 rounded w-1/2" />
									<div className="h-4 bg-gray-200 rounded w-1/4" />
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="col-span-1 md:col-span-2 animate-pulse">
					<div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
						<div className="h-6 bg-gray-200 rounded mb-2" />
						<div className="h-4 bg-gray-200 rounded mb-6" />
						<div className="space-y-4">
							{Array.from({ length: 3 }).map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<div key={i}>
									<div className="h-4 bg-gray-200 rounded mb-2" />
									<div className="h-10 bg-gray-200 rounded" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function ProfilePage() {
	return (
		<div className="container mx-auto py-10 px-4 md:px-8">
			<h1 className="text-3xl font-bold mb-8">My Profile</h1>
			<Suspense fallback={<ProfileLoading />}>
				<ProfileDataContent />
			</Suspense>
		</div>
	);
}
