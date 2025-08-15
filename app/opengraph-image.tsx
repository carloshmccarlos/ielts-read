import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "IELTS Vocabulary Memorization Through Reading - Master IELTS Words";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 48,
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					color: "white",
					fontFamily: "system-ui",
				}}
			>
				<div
					style={{
						fontSize: 64,
						fontWeight: "bold",
						marginBottom: 20,
						textAlign: "center",
					}}
				>
					IELTS Vocabulary Memorization
				</div>
				<div
					style={{
						fontSize: 36,
						textAlign: "center",
						opacity: 0.9,
						maxWidth: 800,
					}}
				>
					Through Contextual Reading Practice
				</div>
				<div
					style={{
						fontSize: 28,
						marginTop: 30,
						opacity: 0.8,
					}}
				>
					Learn & Retain IELTS Words Naturally
				</div>
			</div>
		),
		{
			...size,
		},
	);
}
