import { Devvit, StateSetter, useState } from "@devvit/public-api";
import { Service } from "../Service.js";
import { GameState } from "../types/GameState.js";
import { Settings } from "../types/Settings.js";
import { Color } from "../types/Theme.js";
import { TPost } from "../types/TPost.js";
import { getRandomSubreddits } from "../utils.js";
import { Deleted } from "./Deleted.js";
import { GameMenu } from "./GameMenu.js";
import { PostComments } from "./PostComments.js";
import { StyledButton } from "./StyledButton.js";
import { SubredditPosts } from "./SubredditPosts.js";
import { UserPostsAndComments } from "./UserPostsAndComments.js";
import { mainContainerPadding } from "../constants.js";

const CACHE_MAX_SIZE = 20;

export const Main = ({
	service,
	initGameState,
	colors,
	settings,
	setSettings,
	onGameWon,
	back,
}: {
	service: Service;
	initGameState: GameState;
	colors: Record<Color, string>;
	settings: Settings;
	setSettings: StateSetter<Settings>;
	onGameWon: (stepList: GameState["stepList"]) => void;
	back: () => void;
}): JSX.Element => {
	const [gameState, setGameState] = useState(initGameState);
	const [subredditPostsCache, setSubredditPostsCache] = useState<
		Record<string, TPost[]>
	>({});
	const [userPostsCache, setUserPostsCache] = useState<
		Record<string, TPost[]>
	>({});
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const nav = (onId: string, onName: string, onType: GameState["onType"]) => {
		if (onType === "subreddit" && onName === gameState.to) {
			return onGameWon(gameState.stepList);
		}
		let stepList: GameState["stepList"] = [];
		setGameState((prev) => {
			stepList = [
				...prev.stepList,
				{ onId: prev.onId, onName: prev.onName, onType: prev.onType },
			];
			return {
				...prev,
				onId,
				onName,
				onType,
				steps: prev.steps + 1,
				stepList,
			};
		});
		service.saveProgress(stepList);
	};

	const onLifelineUsed = () => {
		setGameState((prev) => ({
			...prev,
			lifelines: prev.lifelines - 1,
		}));
	};

	const backOneStep = () => {
		if (gameState.stepList.length < 2) return;
		const { onId, onName, onType } =
			gameState.stepList[gameState.stepList.length - 2];
		onLifelineUsed();
		nav(onId, onName, onType);
		setIsMenuOpen(false);
	};

	const goToRandomSubreddit = (isLifeline?: boolean) => {
		const subreddit = getRandomSubreddits(1, to)[0];
		if (isLifeline) onLifelineUsed();
		nav(subreddit, subreddit, "subreddit");
		setIsMenuOpen(false);
	};

	const getCacheStateSetter = <T extends Record<any, any>>(
		stateSetter: StateSetter<T>
	) => {
		stateSetter((prev) => {
			if (Object.keys(prev).length <= CACHE_MAX_SIZE) return prev;
			return Object.fromEntries(Object.entries(prev).slice(1)) as T;
		});
		return stateSetter;
	};

	const { onId, onName, onType, to, steps } = gameState;
	const component =
		onName.toLowerCase() === "[deleted]" ? (
			<Deleted
				goal={to}
				service={service}
				onSelect={(subreddit) => nav(subreddit, subreddit, "subreddit")}
				colors={colors}
			/>
		) : onType === "subreddit" ? (
			<SubredditPosts
				service={service}
				subreddit={onId}
				onPostClick={(postId) => nav(postId, onName, "post")}
				colors={colors}
				cache={subredditPostsCache}
				setCache={getCacheStateSetter(setSubredditPostsCache)}
				scheme={settings.scheme}
			/>
		) : onType === "post" ? (
			<PostComments
				service={service}
				postId={onId}
				onUserClick={(userId, userName) =>
					nav(userId, userName, "user")
				}
				onRandomSubredditClick={goToRandomSubreddit}
				colors={colors}
				scheme={settings.scheme}
			/>
		) : (
			<UserPostsAndComments
				service={service}
				userId={onId}
				userName={onName}
				onClick={(subreddit) => nav(subreddit, subreddit, "subreddit")}
				colors={colors}
				cache={userPostsCache}
				setCache={getCacheStateSetter(setUserPostsCache)}
				scheme={settings.scheme}
			/>
		);

	const reset = () => {
		back();
		setGameState(initGameState);
		service.saveProgress([]);
	};

	return (
		<zstack height="100%" width="100%" alignment="center middle">
			<vstack
				width="100%"
				height="100%"
				alignment="top center"
				padding={mainContainerPadding}
			>
				<hstack width="100%" gap="small" alignment="middle">
					<text
						grow
						alignment="start middle"
						color={colors.onSurface}
					>
						Currently on: {onType === "user" ? "u/" : "r/"}
						{onName}
					</text>
					<text
						grow
						alignment="center middle"
						color={colors.onSurface}
					>
						Steps taken: {steps}
					</text>
					<text grow alignment="end middle" color={colors.onSurface}>
						Goal: r/{to}
					</text>
					<StyledButton
						label="☰"
						width="30px"
						height="30px"
						colors={colors}
						onPress={() => setIsMenuOpen(true)}
					/>
				</hstack>
				<spacer size="xsmall" />
				<hstack
					height="1px"
					width="100%"
					backgroundColor={colors.onSurface}
				></hstack>
				<spacer size="medium" />
				{component}
			</vstack>
			{isMenuOpen && (
				<GameMenu
					giveUp={reset}
					colors={colors}
					settings={settings}
					setSettings={setSettings}
					close={() => setIsMenuOpen(false)}
					lifelinesLeft={gameState.lifelines}
					goBackOneStep={backOneStep}
					goToRandomSubreddit={() => goToRandomSubreddit(true)}
				/>
			)}
		</zstack>
	);
};
