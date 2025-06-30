import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import * as React from "react";

export default function Spinner() {
	return (
		<div className="absolute top-1/2 left-1/2 opacity-80 -translate-x-1/2 -translate-y-1/2">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary">
				{""}
			</div>
		</div>
		/*	<Stack
			className={
				"absolute top-1/2 left-1/2 opacity-80 -translate-x-1/2 -translate-y-1/2"
			}
			spacing={2}
			direction="row"
			alignItems="center"
		>
			<CircularProgress color={"inherit"} size="30px" />
			<CircularProgress color={"inherit"} size={40} />
			<CircularProgress color={"inherit"} size="3rem" />
		</Stack>*/
	);
}
