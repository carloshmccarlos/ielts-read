"use client";

import LoginButton from "@/components/LoginButton";
import RegisterButton from "@/components/RegisterButton";
import MenuIcon from "@/components/nav/MenuIcon";
import NavLinks from "@/components/nav/NavLinks";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useCurrentUser } from "@/hooks/useSession";
import type { Category } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
	categories: Category[];
	type: "col" | "admin";
}

function Menu({ categories, type }: Props) {
	// const inputRef = useRef<HTMLInputElement>(null);
	const { user, isLoggedIn } = useCurrentUser();
	const [isOpen, setIsOpen] = useState(false);

	const handleLinkClick = () => {
		setIsOpen(false);
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger className={"text-start"}>
				<div
					className={`hover:cursor-pointer ${type === "admin" && "hover:bg-slate-700"} hover:bg-gray-300 pr-1`}
				>
					<MenuIcon />
				</div>
			</SheetTrigger>
			<SheetContent
				side={"left"}
				className={`${type === "admin" && "bg-slate-950 border-slate-950"}  w-3/4 xl:w-1/4  lg:w-1/3 md:w-1/2`}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<SheetHeader>
					<SheetTitle
						className={`text-2xl font-bold text-center ${type === "admin" && "text-white"}`}
					>
						MENU
					</SheetTitle>
				</SheetHeader>

				{/*<div className="w-full flex items-center px-4 relative bg-gray-100 py-4 group">
					<Input
						ref={inputRef}
						type="text"
						placeholder="Search..."
						className="bg-white rounded-none border-2 border-black w-full
               hover:border-3 hover:border-gray-700
               focus:border-3
               group-hover:border-3 group-hover:border-gray-700"
						autoFocus={false}
					/>
					<Button
						type="button"
						className="absolute top-4 right-4 cursor-pointer
                group-hover:bg-gray-700 hover:bg-gray-700
               rounded-none border-transparent"
					>
						Search
					</Button>
				</div>*/}

				{/* login and register function, hidden for now, realised later*/}
				{!isLoggedIn && (
					<div className={"flex justify-center items-center gap-2 md:gap-4"}>
						<RegisterButton />
						<LoginButton />
					</div>
				)}

				<NavLinks
					categories={categories}
					type={type}
					className={"flex flex-col py-2 px-4 "}
					onLinkClick={handleLinkClick}
				/>
			</SheetContent>
		</Sheet>
	);
}

export default Menu;
