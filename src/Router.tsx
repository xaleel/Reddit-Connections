import { Context, Devvit, useAsync, useState } from "@devvit/public-api";
import { Service } from "./Service.js";
import { LoadingState } from "./components/LoadingState.js";
import { Main } from "./components/Main.js";
import { MainMenu } from "./components/MainMenu.js";
import { Tutorial } from "./components/Tutorial.js";
import { WinScreen } from "./components/WinScreen.js";
import { theme } from "./constants.js";
import { GameState } from "./types/GameState.js";
import { Settings } from "./types/Settings.js";

export type Page = "menu" | "main" | "winScreen" | "tutorial";

export const Router: Devvit.CustomPostComponent = (context: Context) => {
	const [page, setPage] = useState<Page>("menu");
	const [settings, setSettings] = useState<Settings>({
		scheme: "light",
		isHighContrast: true,
	});
	const [winSteps, setWinSteps] = useState<GameState["stepList"]>([]);

	const service = new Service(context);
	const { data: gameState, loading } = useAsync(() => service.getGame());

	const colors =
		theme[
			`${settings.scheme}${
				settings.isHighContrast ? "-high-contrast" : ""
			}`
		];

	const pages: Record<Page, JSX.Element> = {
		menu: <MainMenu setPage={setPage} colors={colors} />,
		main: (
			<Main
				service={service}
				initGameState={gameState!}
				colors={colors}
				settings={settings}
				setSettings={setSettings}
				onGameWon={(steps) => {
					setWinSteps(steps);
					setPage("winScreen");
				}}
				back={() => setPage("menu")}
			/>
		),
		winScreen: (
			<WinScreen
				stepList={winSteps}
				back={() => setPage("menu")}
				colors={colors}
			/>
		),
		tutorial: (
			<Tutorial
				back={() => setPage("menu")}
				colors={colors}
				settings={settings}
				setSettings={setSettings}
			/>
		),
	};

	return (
		<zstack
			width="100%"
			height="100%"
			alignment="top start"
			backgroundColor={colors.surface}
		>
			{loading ? (
				<LoadingState scheme={settings.scheme} />
			) : gameState ? (
				pages[page]
			) : (
				<text>Error</text>
			)}
		</zstack>
	);
};
