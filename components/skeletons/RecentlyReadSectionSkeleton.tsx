import React from "react";

const RecentlyReadSectionSkeleton = () => {
	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<div className="h-12 bg-gray-200 rounded-md dark:bg-gray-700 w-1/3 mb-6 animate-pulse" />

			<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="h-[300px] bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse"
					/>
				))}
			</div>
		</div>
	);
};

export default RecentlyReadSectionSkeleton;
