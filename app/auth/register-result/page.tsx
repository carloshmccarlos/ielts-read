"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function RegisterResultPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	return error ? (
		<Link
			href={"/auth/register"}
			className="text-red-600 lg:text-2xl  text-lg text-center font-semibold flex mt-24 items-center justify-center"
		>
			The token is expired. Click this to register again.
		</Link>
	) : (
		<Link
			href={"/"}
			className="text-lg text-center text-green-600 lg:text-2xl font-semibold flex mt-24   items-center justify-center"
		>
			Your account has been created, Click this to main page.
		</Link>
	);
}
