import { IconButton } from "react-native-paper";

type IconProps = Pick<
  Parameters<typeof IconButton>[0],
  | "icon"
  | "iconColor"
  | "size"
  | "accessibilityLabel"
  | "style"
  | "testID"
  | "theme"
>;

export const Icon = (props: IconProps) => (
  <IconButton {...props} style={[{ margin: 0, padding: 0 }, props.style]} />
);
