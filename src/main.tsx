import { Context, Devvit, JobContext } from "@devvit/public-api";
import { LoadingState } from "./components/LoadingState.js";
import { Router } from "./Router.js";
import { getRandomGame } from "./utils.js";

Devvit.configure({
	redditAPI: true,
	redis: true,
	media: true,
});

Devvit.addCustomPostType({
	name: "RedditConnectionsGame",
	height: "tall",
	render: Router,
});

async function generateGame(context: Context | JobContext) {
	const { reddit, redis } = context;
	const community = await reddit.getCurrentSubreddit();

	const ts = Math.floor((Date.now() / 1000) * 60 * 60);
	const now = new Date(ts);
	let lastGameNum = 0;

	const lastPosts = await reddit
		.getNewPosts({
			subredditName: community.name,
			limit: 1,
		})
		.all();

	if (lastPosts.length) {
		await lastPosts[0].unsticky();
		if (/#\d+ /.test(lastPosts[0].title)) {
			lastGameNum = parseInt(
				lastPosts[0].title.split("#")[1].split(" ")[0]
			);
		}
	}

	const post = await reddit.submitPost({
		title: `Game #${lastGameNum + 1} ${now
			.toUTCString()
			.slice(5, 11)} ${now.getHours()}:00`,
		subredditName: community.name,
		preview: <LoadingState scheme="light" />,
	});

	await post.sticky();

	await redis.set(`game-${post.id}`, JSON.stringify(getRandomGame()));
}

Devvit.addSchedulerJob({
	name: "generate-game",
	onRun: async (_, context) => {
		await generateGame(context);
	},
});

Devvit.addMenuItem({
	label: "Generate a game now",
	location: "subreddit",
	forUserType: "moderator",
	onPress: async (_, context) => {
		await generateGame(context);
	},
});

Devvit.addMenuItem({
	label: "Run post generator schedule",
	location: "subreddit",
	forUserType: "moderator",
	onPress: async (_, context) => {
		const jobId = await context.scheduler.runJob({
			name: "generate-game",
			cron: "0 * * * *", // every 1h
		});
		await context.redis.set("generate-game:jobId", jobId);
	},
});

Devvit.addMenuItem({
	label: "Cancel post generator schedule",
	location: "subreddit",
	forUserType: "moderator",
	onPress: async (_, context) => {
		const jobId = await context.redis.get("generate-game:jobId");
		if (!jobId) return context.ui.showToast("No job scheduled.");
		await context.scheduler.cancelJob(jobId);
	},
});

export default Devvit;
