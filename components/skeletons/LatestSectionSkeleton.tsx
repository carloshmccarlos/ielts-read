import React from "react";

const LatestSectionSkeleton = () => {
	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<div className="h-12 bg-gray-200 rounded-md dark:bg-gray-700 w-1/3 mb-6 animate-pulse" />

			{/* Hero Section */}
			<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-12">
				{/* Latest Big Card */}
				<div className="lg:col-span-4 h-[400px] bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse" />

				{/* Horizontal Cards */}
				<div className="lg:col-span-2 grid grid-cols-1 grid-rows-2 gap-4 sm:gap-6">
					<div className="h-[188px] bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse" />
					<div className="h-[188px] bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse" />
				</div>
			</div>

			{/* Vertical Card Section */}
			<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mb-12">
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

export default LatestSectionSkeleton;
