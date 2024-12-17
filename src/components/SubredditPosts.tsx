import { Devvit, StateSetter, useAsync } from "@devvit/public-api";
import {
	mainContainerPadding,
	NSFW_PREVIEW,
	PADDING_MAPPING,
} from "../constants.js";
import { Service } from "../Service.js";
import { Color } from "../types/Theme.js";
import { TPost } from "../types/TPost.js";
import { LoadingState } from "./LoadingState.js";
import { SubredditPost } from "./subcomponents/SubredditPost.js";
import { Settings } from "../types/Settings.js";

export const SubredditPosts = ({
	service,
	subreddit,
	onPostClick,
	colors,
	cache,
	setCache,
	scheme,
}: {
	service: Service;
	subreddit: string;
	onPostClick: (postId: string) => void;
	colors: Record<Color, string>;
	cache: Record<string, TPost[]>;
	setCache: StateSetter<Record<string, TPost[]>>;
	scheme: Settings["scheme"];
}) => {
	const { data: posts, loading } = useAsync<TPost[]>(async () => {
		if (cache[subreddit]) return Promise.resolve(cache[subreddit]);
		const postsResponse = await service.getPosts(subreddit);
		const posts = postsResponse.map((post) => ({
			id: post.id,
			title: post.title,
			body: post.body ?? "",
			thumbnail: post.isNsfw() ? NSFW_PREVIEW : post.thumbnail?.url ?? "",
			subreddit,
			byName: post.authorName,
			byId: post.authorId ?? "",
		}));
		setCache({ ...cache, [subreddit]: posts });
		return posts;
	});

	const {
		dimensions: { width },
	} = service;

	return posts && !loading ? (
		<vstack
			gap="medium"
			width={`${width - 2 * PADDING_MAPPING[mainContainerPadding]}px`}
			grow
		>
			{posts.map((post) => (
				<SubredditPost
					post={post}
					colors={colors}
					onClick={() => onPostClick(post.id)}
				/>
			))}
		</vstack>
	) : (
		<LoadingState scheme={scheme} />
	);
};
