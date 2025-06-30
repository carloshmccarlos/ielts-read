import { Button } from "@/components/ui/button";
import Link from "next/link";

function LoginButton() {
	const buttonBaseStyles = "text-lg font-bold rounded-none cursor-pointer";
	return (
		<Button
			size="lg"
			variant="ghost"
			className={`${buttonBaseStyles} bg-white text-black hover:bg-black hover:text-white`}
		>
			<Link href="/auth/login">Login</Link>
		</Button>
	);
}

export default LoginButton;
