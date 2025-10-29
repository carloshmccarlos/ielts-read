import type React from "react";

export default function MaintenanceNotice() {
	return (
		<div
			className={
				"h-screen flex flex-col items-center justify-center font-bold text-2xl"
			}
		>
			<div className=" bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 ">
				<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32">
					<div className="flex">
						<div className="flex-shrink-0">
							{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
							<svg
								className="h-5 w-5 text-yellow-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<p className="text-sm text-yellow-700">
								<strong>Notice:</strong> We're currently experiencing some
								technical issues. The project will be back to normal on{" "}
								<strong>November 1st, 2024</strong>. Thank you for your
								patience!
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
