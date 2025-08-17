import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// Add performance headers
	response.headers.set("X-DNS-Prefetch-Control", "on");
	response.headers.set("X-Preload", "on");

	// Enable compression
	if (request.headers.get("accept-encoding")?.includes("gzip")) {
		response.headers.set("Content-Encoding", "gzip");
	}

	// Add resource hints for critical resources
	const url = request.nextUrl.pathname;
	
	if (url === "/" || url.startsWith("/article/") || url.startsWith("/category/")) {
		// Preload critical fonts and styles
		response.headers.set(
			"Link",
			'</fonts/inter.woff2>; rel=preload; as=font; type="font/woff2"; crossorigin, ' +
			'</_next/static/css/app.css>; rel=preload; as=style'
		);
	}

	// Add early hints for article pages
	if (url.startsWith("/article/")) {
		// Note: Removed /api/article/related prefetch as it requires articleId or categoryName parameters
		// The prefetch will be handled by the component when it has the necessary context
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
