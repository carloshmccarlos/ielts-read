import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
	triggerText: "master" | "mark" | "finish";
	children: React.ReactNode;
	onClick?: () => void;
}

export default function ArticleDialog({
	triggerText,
	children,
	onClick,
}: Props) {
	const description = {
		master: "Mastered articles will not show again until canceled.",
		mark: "Marked articles will show in the 'Marked' tab of the collection page.",
		finish:
			"Finished articles will show in the 'History' tab of the collection page.",
	};

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Notification</DialogTitle>
					<DialogDescription>{description[triggerText]}</DialogDescription>
					<DialogDescription className={"text-xs text-gray-500"}>
						(This will show only once.)
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" onClick={handleClick}>
							Got it
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
