import { Devvit } from "@devvit/public-api";
import { Color } from "../types/Theme.js";
import { mainContainerPadding } from "../constants.js";

interface StyledButtonProps {
	colors: Record<Color, string>;
	onPress?: () => void | Promise<void>;
	label?: string;
	appearance?: "primary" | "secondary";
	width?: Devvit.Blocks.SizeString;
	height?: Devvit.Blocks.SizeString;
	disabled?: boolean;
}

export const StyledButton = (props: StyledButtonProps): JSX.Element => {
	const {
		onPress,
		label,
		appearance,
		width = "100px",
		height = "40px",
	} = props;

	const style = {
		primary: {
			backgroundColor: props.colors.onSecondaryFixed,
			borderColor: props.colors.secondaryFixed,
			color: props.colors.secondaryFixed,
		},
		secondary: {
			backgroundColor: props.colors.primaryContainer,
			borderColor: props.colors.onSecondaryFixed,
			color: props.colors.onSecondaryFixed,
		},
	}[appearance ?? "primary"];

	return (
		<hstack
			height={height}
			width={width}
			onPress={(!props.disabled && onPress) || undefined}
			backgroundColor={style.borderColor}
			cornerRadius={mainContainerPadding}
		>
			<hstack
				height="100%"
				width="100%"
				gap="small"
				alignment="middle center"
				backgroundColor={style.backgroundColor}
				border="thick"
				borderColor={style.borderColor}
				cornerRadius="small"
			>
				{label ? <text color={style.color}>{label}</text> : null}
			</hstack>
		</hstack>
	);
};
