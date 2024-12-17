export type GameState = {
	from: string;
	to: string;
	onName: string;
	onId: string;
	onType: "subreddit" | "post" | "user";
	steps: number;
	lifelines: number;
	stepList: {
		onName: string;
		onId: string;
		onType: "subreddit" | "post" | "user";
	}[];
};
