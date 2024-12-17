import { SUBREDDITS } from "./constants.js";
import { GameState } from "./types/GameState.js";

export function getRandomGame(): GameState {
	const from = SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)];
	let to = SUBREDDITS.filter((s) => s !== from)[
		Math.floor(Math.random() * SUBREDDITS.length)
	];
	return {
		from,
		to,
		onName: from,
		onId: from,
		onType: "subreddit",
		steps: 0,
		lifelines: 3,
		stepList: [],
	};
}

export function getRandomSubreddits(
	count: number,
	excluding: string
): string[] {
	let filtered = SUBREDDITS.filter((s) => s !== excluding);
	let res = [];
	for (let i = 0; i < count; i++) {
		const index = Math.floor(Math.random() * filtered.length);
		const item = filtered[index];
		res.push(item);
		filtered = filtered.filter((s) => s !== item);
	}
	return res;
}
