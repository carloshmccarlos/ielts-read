import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

export default function SearchInput({ search }: { search: (query?: string) => void }) {
	const searchRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex items-center relative w-1/4 ">
			<Input ref={searchRef} placeholder="Search title..." />
			<Button
				className={"bg-slate-950 rounded-l-none absolute top-0 right-0"}
				type={"button"}
				onClick={() => search(searchRef.current?.value)}
			>
				Search
			</Button>
		</div>
	);
}
