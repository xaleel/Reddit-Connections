import { Devvit } from "@devvit/public-api";
import { GameState } from "../types/GameState.js";
import { Color } from "../types/Theme.js";
import { StyledButton } from "./StyledButton.js";

type WinScreenProps = {
	stepList: GameState["stepList"];
	back: () => void;
	colors: Record<Color, string>;
};

export const WinScreen = ({ back, stepList, colors }: WinScreenProps) => {
	return (
		<vstack
			width="100%"
			height="100%"
			alignment="center middle"
			gap="small"
		>
			<text size="xxlarge" color={colors.onSurface}>
				Congratulations
			</text>
			<text size="large" color={colors.onSurface}>
				You've won the game in {stepList.length} steps
			</text>
			<spacer height="16px" />
			<StyledButton label="Back" colors={colors} onPress={back} />
		</vstack>
	);
};
