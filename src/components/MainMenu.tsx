import { Devvit } from "@devvit/public-api";
import { Page } from "../Router.js";
import { StyledButton } from "./StyledButton.js";
import { Color } from "../types/Theme.js";

export const MainMenu = ({
	setPage,
	colors,
}: {
	setPage: (page: Page) => void;
	colors: Record<Color, string>;
}) => {
	return (
		<vstack
			width="100%"
			height="100%"
			alignment="center middle"
			gap="small"
		>
			<StyledButton
				label="Start"
				onPress={() => setPage("main")}
				colors={colors}
			/>
			<StyledButton
				label="How to play"
				appearance="secondary"
				onPress={() => setPage("tutorial")}
				colors={colors}
			/>
		</vstack>
	);
};
