import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

function BackToTop() {
	return (
		<div
			onKeyDown={scrollToTop}
			onClick={scrollToTop}
			className="group flex gap-2 items-center hover:cursor-pointer"
		>
			<span
				className="text-xl font-bold bg-[length:0%_2px] bg-gradient-to-r from-pink-700 to-violet-700
					bg-no-repeat bg-left-bottom transition-all duration-700 group-hover:bg-[length:100%_2px]
					group-hover:bg-[position:left_bottom] "
			>
				Back to the top
			</span>
			<div
				className="bg-white text-black border-none  p-2 rounded-full transition-colors duration-500
					group-hover:bg-yellow-500 group-hover:text-black"
			>
				<ArrowUp size={32} />
			</div>
		</div>
	);
}

export default BackToTop;
