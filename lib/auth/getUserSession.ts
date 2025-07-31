import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function getUserSession(header: Headers) {
	"use cache"; // Cache the result of this function
	return auth.api.getSession({
		headers: header,
	});
}
