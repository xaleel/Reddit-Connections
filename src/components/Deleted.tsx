import { Devvit } from "@devvit/public-api";
import { Service } from "../Service.js";
import { mainContainerPadding, PADDING_MAPPING } from "../constants.js";
import { Color } from "../types/Theme.js";
import { getRandomSubreddits } from "../utils.js";

export const Deleted = ({
	service,
	onSelect,
	goal,
	colors,
}: {
	service: Service;
	onSelect: (subreddit: string) => void;
	goal: string;
	colors: Record<Color, string>;
}) => {
	const {
		dimensions: { width },
	} = service;

	return (
		<vstack
			gap="medium"
			padding="small"
			grow
			width={`${width - 2 * PADDING_MAPPING[mainContainerPadding]}px`}
		>
			<text
				alignment="center middle"
				size="large"
				color={colors.onSurface}
			>
				Congratulations, you clicked on [deleted]. You can choose a
				random subreddit to continue:
			</text>
			<spacer height="20px" />
			{getRandomSubreddits(3, goal).map((subreddit) => (
				<vstack
					border="thin"
					cornerRadius="small"
					borderColor={colors.onSurface}
					grow
					onPress={() => onSelect(subreddit)}
					alignment="center middle"
				>
					<text
						alignment="center middle"
						color={colors.onSurface}
						size="medium"
						weight="bold"
					>
						r/???
					</text>
				</vstack>
			))}
		</vstack>
	);
};
