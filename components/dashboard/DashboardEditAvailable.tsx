import { IconButton, List } from "react-native-paper";

import { type ActionKey, actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";

type DashboardEditAvailableProps = {
  gadget: ActionKey;
  disabled: boolean;
  onAdd: () => void;
};

export const DashboardEditAvailable = ({
  gadget,
  disabled,
  onAdd,
}: DashboardEditAvailableProps) => {
  const { t } = useI18n();

  return (
    <List.Item
      left={(props) => <List.Icon {...props} icon={actions[gadget].icon} />}
      title={actions[gadget].displayName(t)}
      right={(props) => (
        <IconButton
          {...props}
          icon="plus"
          iconColor="#AED581"
          size={16}
          style={styles.button}
          onPress={onAdd}
          disabled={disabled}
        />
      )}
    />
  );
};

const styles = sty.create({
  button: { marginVertical: 0, transform: [{ scale: 1.5 }] },
});
