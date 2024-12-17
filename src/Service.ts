import type { Context, RedditAPIClient, RedisClient } from "@devvit/public-api";
import { GameState } from "./types/GameState.js";

export class Service {
	readonly reddit: RedditAPIClient;
	readonly redis: RedisClient;
	readonly dimensions: { height: number; width: number };
	readonly userId: string | undefined;
	readonly postId: string;
	lastGame: number | undefined;

	constructor(context: Context) {
		this.reddit = context.reddit;
		this.redis = context.redis;
		this.dimensions = context.dimensions!;
		this.userId = context.userId;
		this.postId = context.postId!;
	}

	async getGame(): Promise<GameState | null> {
		const game = await this.redis.get(`game-${this.postId}`);
		if (!game) return null;
		const parsed: GameState = JSON.parse(game);
		parsed["stepList"] = await this.getProgress();
		return parsed;
	}

	async getProgress(): Promise<GameState["stepList"]> {
		const progress = await this.redis.get(
			`progress-${this.postId}-${this.userId}`
		);
		if (!progress) return Promise.resolve([]);
		return JSON.parse(progress);
	}

	async saveProgress(progress: GameState["stepList"]) {
		await this.redis.set(
			`progress-${this.postId}-${this.userId}`,
			JSON.stringify(progress)
		);
	}

	async createComment(postId: string, text: string) {
		this.reddit.submitComment({
			id: postId,
			text,
		});
	}

	async getPosts(subredditName: string) {
		this.reddit.getCommentsAndPostsByUser;
		return await this.reddit
			.getTopPosts({
				subredditName,
				timeframe: "day",
				limit: 4,
			})
			.all();
	}

	async getComments(postId: string) {
		return await this.reddit
			.getComments({
				postId,
				limit: 5,
				sort: "random",
			})
			.all();
	}

	async getCommentsAndPostsByUser(username: string) {
		return await this.reddit
			.getCommentsAndPostsByUser({
				username,
				limit: 5,
			})
			.all();
	}
}
