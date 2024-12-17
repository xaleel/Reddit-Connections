import { Devvit, StateSetter } from "@devvit/public-api";
import { Settings } from "../types/Settings.js";
import { Color } from "../types/Theme.js";
import { StyledButton } from "./StyledButton.js";

export const GameMenu = ({
	giveUp,
	colors,
	settings,
	setSettings,
	close,
	lifelinesLeft,
	goBackOneStep,
	goToRandomSubreddit,
}: {
	giveUp: () => void;
	colors: Record<Color, string>;
	settings: Settings;
	setSettings: StateSetter<Settings>;
	close: () => void;
	lifelinesLeft: number;
	goBackOneStep: () => void;
	goToRandomSubreddit: () => void;
}) => {
	const setScheme = (scheme: "light" | "dark") => {
		if (scheme === settings.scheme) return;
		setSettings((prev) => ({
			...prev,
			scheme,
			isHighContrast: scheme === "dark",
		}));
	};

	// const setHighContrast = (isHighContrast: boolean) => {
	// 	if (isHighContrast === settings.isHighContrast) return;
	// 	setSettings((prev) => ({ ...prev, isHighContrast }));
	// };

	return (
		<vstack
			width="80%"
			height="90%"
			alignment="center middle"
			gap="small"
			backgroundColor={colors.secondaryContainer}
			border="thin"
			borderColor={colors.onSecondaryContainer}
			cornerRadius="medium"
		>
			<StyledButton
				label="Give up"
				onPress={() => giveUp()}
				colors={colors}
			/>
			<text color={colors.onSecondaryContainer}>
				Lifelines: ({lifelinesLeft} remaining)
			</text>
			<hstack gap="small">
				<StyledButton
					label="Back one step"
					onPress={goBackOneStep}
					colors={colors}
					disabled={!lifelinesLeft}
					width="120px"
				/>
				<StyledButton
					label="Random subreddit"
					onPress={goToRandomSubreddit}
					colors={colors}
					disabled={!lifelinesLeft}
					width="140px"
				/>
			</hstack>
			<text color={colors.onSecondaryContainer}>Theme:</text>
			<hstack gap="small">
				<StyledButton
					label={`${settings.scheme === "light" ? "✔ " : ""}Light`}
					appearance={
						settings.scheme === "light" ? "primary" : "secondary"
					}
					onPress={() => setScheme("light")}
					colors={colors}
				/>
				<StyledButton
					label={`${settings.scheme === "dark" ? "✔ " : ""}Dark`}
					appearance={
						settings.scheme === "dark" ? "primary" : "secondary"
					}
					onPress={() => setScheme("dark")}
					colors={colors}
				/>
			</hstack>
			{/* <text color={colors.onSecondaryContainer}>Contrast:</text>
			<hstack gap="small">
				<StyledButton
					label={`${settings.isHighContrast ? "" : "✔ "}Normal`}
					appearance={
						settings.isHighContrast ? "secondary" : "primary"
					}
					onPress={() => setHighContrast(false)}
					colors={colors}
				/>
				<StyledButton
					label={`${settings.isHighContrast ? "✔ " : ""}High`}
					appearance={
						settings.isHighContrast ? "primary" : "secondary"
					}
					onPress={() => setHighContrast(true)}
					colors={colors}
				/>
			</hstack> */}
			<spacer height="20px" />
			<StyledButton
				label="Close"
				appearance="secondary"
				onPress={close}
				colors={colors}
			/>
		</vstack>
	);
};
