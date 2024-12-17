import { Comment, Devvit, StateSetter, useAsync } from "@devvit/public-api";
import {
	mainContainerPadding,
	NSFW_PREVIEW,
	PADDING_MAPPING,
} from "../constants.js";
import { Service } from "../Service.js";
import { Settings } from "../types/Settings.js";
import { Color } from "../types/Theme.js";
import { TPost } from "../types/TPost.js";
import { LoadingState } from "./LoadingState.js";

export const UserPostsAndComments = ({
	service,
	userId,
	userName,
	onClick,
	colors,
	cache,
	setCache,
	scheme,
}: {
	service: Service;
	userId: string;
	userName: string;
	onClick: (subreddit: string) => void;
	colors: Record<Color, string>;
	cache: Record<string, TPost[]>;
	setCache: StateSetter<Record<string, TPost[]>>;
	scheme: Settings["scheme"];
}) => {
	const { data: posts, loading } = useAsync<TPost[]>(async () => {
		if (cache[userName]) return Promise.resolve(cache[userName]);
		const response = await service.getCommentsAndPostsByUser(userName);
		const posts = response.map((item) => ({
			id: item.id as string,
			title: item instanceof Comment ? item.body : item.title,
			body: item instanceof Comment ? "Comment" : "Post",
			thumbnail:
				item instanceof Comment
					? ""
					: item.isNsfw()
					? NSFW_PREVIEW
					: item.thumbnail?.url ?? "",
			subreddit: item.subredditName,
			byName: userName,
			byId: userId,
		}));
		setCache({ ...cache, [userName]: posts });
		return posts;
	});

	const {
		dimensions: { width },
	} = service;

	return posts && !loading ? (
		<vstack
			gap="small"
			width={`${width - 2 * PADDING_MAPPING[mainContainerPadding]}px`}
			grow
		>
			{posts.map((post) => (
				<hstack
					border="thin"
					cornerRadius="small"
					padding="xsmall"
					borderColor={colors.onSurface}
					backgroundColor={colors.surfaceContainerHigh}
					width="100%"
					gap="medium"
					grow
				>
					<vstack padding="small" grow>
						<text
							size="medium"
							overflow="ellipsis"
							color={colors.onSurface}
						>
							[{post.body}] {post.title}
						</text>
						<hstack onPress={() => onClick(post.subreddit)} grow>
							<text size="small" color={colors.primary}>
								r/{post.subreddit}
							</text>
						</hstack>
					</vstack>
					{post.thumbnail ? (
						<image
							url={post.thumbnail}
							imageWidth={100}
							imageHeight={100}
						/>
					) : (
						<></>
					)}
				</hstack>
			))}
		</vstack>
	) : (
		<LoadingState scheme={scheme} />
	);
};
