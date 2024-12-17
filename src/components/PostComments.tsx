import { Devvit, useAsync } from "@devvit/public-api";
import { mainContainerPadding, PADDING_MAPPING } from "../constants.js";
import { Service } from "../Service.js";
import { Color } from "../types/Theme.js";
import { TPost } from "../types/TPost.js";
import { LoadingState } from "./LoadingState.js";
import { PostComment } from "./subcomponents/PostComment.js";
import { Settings } from "../types/Settings.js";

export const PostComments = ({
	service,
	postId,
	onUserClick,
	onRandomSubredditClick,
	colors,
	scheme,
}: {
	service: Service;
	postId: string;
	onUserClick: (userId: string, userName: string) => void;
	onRandomSubredditClick: () => void;
	colors: Record<Color, string>;
	scheme: Settings["scheme"];
}) => {
	const { data: comments, loading } = useAsync<TPost[]>(async () => {
		const response = await service.getComments(postId);
		return response.map((comment) => ({
			id: comment.id,
			title: comment.body,
			body: "",
			thumbnail: "",
			subreddit: comment.subredditName,
			byName: comment.authorName,
			byId: comment.authorId ?? "",
		}));
	});

	const {
		dimensions: { width },
	} = service;

	return comments && !loading ? (
		<vstack
			gap="medium"
			padding="small"
			grow
			width={`${width - 2 * PADDING_MAPPING[mainContainerPadding]}px`}
		>
			{comments.map((comment) => (
				<PostComment
					comment={comment}
					colors={colors}
					onClick={
						// SO MUCH NSFW STUFF BY AutoModerator
						comment.byName === "AutoModerator"
							? undefined
							: () => onUserClick(comment.byId, comment.byName)
					}
				/>
			))}
			{comments.length === 0 ||
				(comments.length === 1 &&
					comments[0].byName === "AutoModerator" && (
						<vstack
							height="100%"
							width="100%"
							alignment="center middle"
							gap="medium"
							grow
						>
							<text size="medium" color={colors.onSurface}>
								Oops, this post has no comments. Click here to
								go to a random subreddit
							</text>
							<vstack
								border="thin"
								cornerRadius="small"
								height={50}
								width="50%"
								borderColor={colors.onSurface}
								onPress={onRandomSubredditClick}
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
						</vstack>
					))}
		</vstack>
	) : (
		<LoadingState scheme={scheme} />
	);
};
