"use client";

import ArticleDialog from "@/components/ArticleDialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, SmilePlus, Star } from "lucide-react";

interface ArticleActionButtonsProps {
	userId?: string;
	isMarked: boolean;
	isMastered: boolean;
	readTimes: number;
	isLoading: boolean;
	isLoadingStats: boolean;
	markNotice: boolean;
	masterNotice: boolean;
	finishNotice: boolean;
	handleToggleMark: () => void;
	handleToggleMaster: () => void;
	handleIncreaseFinishTime: () => void;
}

function ArticleActionButtons({
	userId,
	isMarked,
	isMastered,
	readTimes,
	isLoading,
	isLoadingStats,
	markNotice,
	masterNotice,
	finishNotice,
	handleToggleMark,
	handleToggleMaster,
	handleIncreaseFinishTime,
}: ArticleActionButtonsProps) {
	return (
		<div className="flex flex-col gap-2 py-16 items-end">
			<div className="flex flex-row gap-2 items-center">
				{!markNotice && userId ? (
					<ArticleDialog triggerText="mark" onClick={handleToggleMark}>
						<Button
							variant="outline"
							className="cursor-pointer flex items-center gap-2"
							disabled={isLoading || isLoadingStats}
						>
							<Star
								className={`w-4 h-4 ${isMarked ? "fill-yellow-400" : ""}`}
							/>
							{isMarked ? "Marked" : "Mark"}
						</Button>
					</ArticleDialog>
				) : (
					<Button
						variant="outline"
						className="cursor-pointer flex items-center gap-2"
						onClick={handleToggleMark}
						disabled={isLoading || isLoadingStats}
					>
						<Star
							className={`w-4 h-4 ${isMarked ? "fill-yellow-400" : ""}`}
						/>
						{isMarked ? "Marked" : "Mark"}
					</Button>
				)}

				{!finishNotice && userId ? (
					<ArticleDialog
						triggerText="finish"
						onClick={handleIncreaseFinishTime}
					>
						<Button
							variant="outline"
							className="cursor-pointer flex items-center gap-2"
							disabled={isLoading || isLoadingStats}
						>
							<SmilePlus className="w-4 h-4" />
							Finished {readTimes} times
						</Button>
					</ArticleDialog>
				) : (
					<Button
						variant="outline"
						className="cursor-pointer flex items-center gap-2"
						onClick={handleIncreaseFinishTime}
						disabled={isLoading || isLoadingStats}
					>
						<SmilePlus className="w-4 h-4" />
						Finished {readTimes} times
					</Button>
				)}
			</div>

			{!masterNotice && userId ? (
				<ArticleDialog triggerText="master" onClick={handleToggleMaster}>
					<Button
						variant="outline"
						className="cursor-pointer flex items-center gap-2"
						disabled={isLoading || isLoadingStats}
					>
						<GraduationCap
							className={`w-4 h-4 ${isMastered ? "fill-green-400" : ""}`}
						/>
						{isMastered ? "Mastered" : "Master"}
					</Button>
				</ArticleDialog>
			) : (
				<Button
					variant="outline"
					className="cursor-pointer flex items-center gap-2"
					onClick={handleToggleMaster}
					disabled={isLoading || isLoadingStats}
				>
					<GraduationCap
						className={`w-4 h-4 ${isMastered ? "fill-green-400" : ""}`}
					/>
					{isMastered ? "Mastered" : "Master"}
				</Button>
			)}
		</div>
	);
}

export default ArticleActionButtons;
