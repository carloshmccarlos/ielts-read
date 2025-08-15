"use client";

import LoginButton from "@/components/LoginButton";
import Menu from "@/components/nav/Menu";
import ProfileDropdown from "@/components/nav/ProfileDropdown";
import { useCurrentUser } from "@/hooks/useSession";
import { getRoleByUserId } from "@/lib/actions/articles-with-user";
import type { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RegisterButton from "../RegisterButton";

interface Props {
	categories: Category[];
}

function NavBar({ categories }: Props) {
	const { user } = useCurrentUser();

	if (!categories) {
		return null;
	}

	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();

	const type = pathname.startsWith("/admin") ? "admin" : "col";

	// Use TanStack Query to fetch user role
	const { data: roleData } = useQuery({
		queryKey: ["userRole", user?.id],
		queryFn: async () => {
			if (!user?.id) return null;
			return await getRoleByUserId(user.id);
		},
		enabled: !!user?.id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	const role = roleData?.role || "USER";

	useEffect(() => {
		const handleScroll = () => {
			const offset = window.scrollY;
			if (offset > 50) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			<nav
				className={`${pathname.startsWith("/admin") ? "bg-slate-950 text-white border-0" : "bg-white text-black border-b"} py-4  sticky top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}
			>
				<div className="mx-auto flex items-center px-4 relative">
					<div className="absolute left-0 sm:left-4">
						{pathname.startsWith("/auth") ? (
							""
						) : (
							<Menu categories={categories} type={type} />
						)}
					</div>
					<div className="w-full flex justify-center">
						<Link
							href={"/"}
							className={`font-serif font-bold text-center transition-all duration-300 ${
								scrolled
									? "text-3xl md:text-4xl lg:text-5xl"
									: "text-4xl md:text-5xl lg:text-6xl"
							}`}
						>
							I READ
						</Link>
					</div>

					{user?.id ? (
						<div className=" lg:flex items-center gap-2 md:gap-4 absolute right-0 sm:right-4">
							<ProfileDropdown role={role} />
						</div>
					) : (
						<div className="hidden lg:flex items-center gap-2 md:gap-4 absolute right-0 sm:right-4">
							<RegisterButton />
							<LoginButton />
						</div>
					)}
				</div>
			</nav>

			{/*<div className="bg-white">
				<NavLinks
					categories={categories}
					type={"row"}
					className={
						"hidden border-b  md:flex items-center justify-center gap-4"
					}
				/>
			</div>*/}
		</>
	);
}

export default NavBar;
