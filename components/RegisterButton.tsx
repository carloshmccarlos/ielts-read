import { Button } from "@/components/ui/button";
import Link from "next/link";

function RegisterButton() {
	const buttonBaseStyles = "text-lg font-bold rounded-none cursor-pointer";
	return (
		<Button
			size="lg"
			className={`${buttonBaseStyles} border-black  bg-black text-white hover:text-black hover:bg-gray-100 hover:border-2`}
		>
			<Link href="/auth/register">Register</Link>
		</Button>
	);
}

export default RegisterButton;
