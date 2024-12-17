import { Devvit, StateSetter, useState } from "@devvit/public-api";
import { Settings } from "../types/Settings.js";
import { Color } from "../types/Theme.js";
import { GameMenu } from "./GameMenu.js";
import { StyledButton } from "./StyledButton.js";
import { PostComment } from "./subcomponents/PostComment.js";
import { SubredditPost } from "./subcomponents/SubredditPost.js";

type TutorialProps = {
	back: () => void;
	colors: Record<Color, string>;
	settings: Settings;
	setSettings: StateSetter<Settings>;
};

const FINAL_STEP = 3;

export const Tutorial = ({
	back,
	colors,
	settings,
	setSettings,
}: TutorialProps) => {
	const [tutorialStep, setTutorialStep] = useState(1);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<zstack height="100%" width="100%" alignment="center middle">
			<vstack
				width="100%"
				height="100%"
				alignment="top center"
				padding="small"
			>
				<hstack width="100%" gap="small" alignment="middle">
					<text
						grow
						alignment="start middle"
						color={colors.onSurface}
					>
						{tutorialStep > 1
							? `Currently on: ${
									tutorialStep >= 4 ? "r/user" : "r/subreddit"
							  }`
							: ""}
					</text>
					<text
						grow
						alignment="center middle"
						color={colors.onSurface}
					>
						{tutorialStep > 2
							? `Steps taken: ${tutorialStep - 1}`
							: ""}
					</text>
					<text grow alignment="end middle" color={colors.onSurface}>
						Goal: r/goal_subreddit
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
				<vstack grow padding="small" width="100%">
					<hstack width="100%" gap="small">
						<vstack width="33%" alignment="center middle">
							{tutorialStep === 2 && (
								<>
									<text color={colors.onSurface}>↑</text>
									<text
										color={colors.onSurface}
										wrap
										alignment="center"
									>
										This is the subreddit/user you're
										currently on. When you're on a
										subreddit, you'll see the top 4 posts of
										the day. Click on the post to continue
									</text>
								</>
							)}
						</vstack>
						<vstack width="33%" alignment="center middle">
							{tutorialStep === 3 && (
								<>
									<text
										color={colors.onSurface}
										wrap
										alignment="center"
									>
										When you click on a post, you'll see 5
										random comments from that post. You can
										click on a user to see their posts and
										comments. Click on the user to continue
									</text>
								</>
							)}
							{tutorialStep === 4 && (
								<>
									<text
										color={colors.onSurface}
										wrap
										alignment="center"
									>
										On the user's posts and comments you can
										click on the subreddit to go to that
										subreddit and continue the game.
									</text>
									<spacer height="10px" />
									<StyledButton
										label={"Next"}
										colors={colors}
										onPress={() =>
											setTutorialStep(tutorialStep + 1)
										}
									/>
								</>
							)}
							{tutorialStep === 5 && (
								<>
									<text
										color={colors.onSurface}
										wrap
										alignment="center"
									>
										You win the game when you reach the goal
										subreddit in the top right corner.
									</text>
									<spacer height="10px" />
									<StyledButton
										label={"Next"}
										colors={colors}
										onPress={() =>
											setTutorialStep(tutorialStep + 1)
										}
									/>
								</>
							)}
							{tutorialStep === 6 && (
								<>
									<text
										color={colors.onSurface}
										wrap
										alignment="center"
										size="xxlarge"
									>
										Good luck and have fun!
									</text>
								</>
							)}
						</vstack>
						<vstack width="33%" alignment="center middle">
							{tutorialStep === 1 && (
								<>
									<text color={colors.onSurface}>↑</text>
									<text
										color={colors.onSurface}
										wrap
										alignment="center"
									>
										This is the goal subreddit you need to
										get to
									</text>
									<spacer height="10px" />
									<StyledButton
										label={"Next"}
										colors={colors}
										onPress={() =>
											setTutorialStep(tutorialStep + 1)
										}
									/>
								</>
							)}
						</vstack>
					</hstack>
					<hstack
						grow
						width="100%"
						gap="small"
						alignment="center middle"
					>
						{tutorialStep === 2 && (
							<SubredditPost
								post={{
									id: "",
									title: "Post title",
									body: "Post body",
									thumbnail: "",
									subreddit: "r/subreddit",
									byName: "user",
									byId: "",
								}}
								colors={colors}
								onClick={() =>
									setTutorialStep(tutorialStep + 1)
								}
							/>
						)}
						{tutorialStep === 3 && (
							<PostComment
								comment={{
									id: "",
									title: "This is a comment",
									body: "",
									thumbnail: "",
									subreddit: "r/subreddit",
									byName: "user",
									byId: "",
								}}
								colors={colors}
								onClick={() =>
									setTutorialStep(tutorialStep + 1)
								}
							/>
						)}
					</hstack>
					<hstack alignment="center middle">
						<StyledButton
							label="Home"
							colors={colors}
							onPress={back}
						/>
					</hstack>
				</vstack>
			</vstack>
			{isMenuOpen && (
				<GameMenu
					giveUp={() => {}}
					colors={colors}
					settings={settings}
					setSettings={setSettings}
					close={() => setIsMenuOpen(false)}
					lifelinesLeft={3}
					goBackOneStep={() => {}}
					goToRandomSubreddit={() => {}}
				/>
			)}
		</zstack>
	);
};
