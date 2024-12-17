import { Devvit } from "@devvit/public-api";
import { TPost } from "../../types/TPost.js";
import { Color } from "../../types/Theme.js";

type PostCommentProps = {
	comment: TPost;
	colors: Record<Color, string>;
	onClick?: () => void;
};

export const PostComment = ({ comment, colors, onClick }: PostCommentProps) => {
	return (
		<vstack
			border="thin"
			cornerRadius="small"
			padding="xsmall"
			borderColor={colors.onSurface}
			backgroundColor={colors.surfaceContainerHigh}
			grow
		>
			<hstack onPress={onClick}>
				<text grow size="medium" color={colors.primary} wrap>
					u/{comment.byName}
				</text>
			</hstack>
			<text grow size="small" color={colors.onSurface}>
				{comment.title}
			</text>
		</vstack>
	);
};
