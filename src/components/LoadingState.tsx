import { Devvit } from "@devvit/public-api";
import { Settings } from "../types/Settings.js";

export const LoadingState = ({
	scheme,
}: {
	scheme: Settings["scheme"];
}): JSX.Element => (
	<zstack width="100%" height="100%" alignment="center middle">
		<image
			url={`loader-${scheme}.gif`}
			imageWidth={96}
			imageHeight={115}
			description="Generative artwork: Fuzzy Fingers"
		/>
	</zstack>
);
