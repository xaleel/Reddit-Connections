import { Devvit } from "@devvit/public-api";
import { TPost } from "../../types/TPost.js";
import { Color } from "../../types/Theme.js";

type SubredditPostProps = {
	post: TPost;
	colors: Record<Color, string>;
	onClick: () => void;
};

export const SubredditPost = ({
	post,
	colors,
	onClick,
}: SubredditPostProps) => {
	return (
		<hstack
			border="thin"
			cornerRadius="small"
			borderColor={colors.onSurface}
			backgroundColor={colors.surfaceContainerHigh}
			width="100%"
			onPress={onClick}
			gap="small"
			grow
		>
			<vstack padding="small" grow>
				<text size="medium" overflow="ellipsis" color={colors.primary}>
					{post.title}
				</text>
				<text size="small" color={colors.onSurface}>
					u/{post.byName}
				</text>
				<text
					width="95%"
					size="small"
					alignment="start middle"
					color={colors.onSurface}
				>
					{post.body}
				</text>
			</vstack>
			{post.thumbnail ? (
				<image
					url={post.thumbnail}
					imageWidth={100}
					imageHeight={100}
					height="100%"
				/>
			) : (
				<></>
			)}
		</hstack>
	);
};
