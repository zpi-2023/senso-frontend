import { useRouter } from "expo-router";
import { useState, type FC, useMemo } from "react";
import { FlatList, View } from "react-native";
import { Menu, Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { AppRoutes } from "@/common/constants";
import { useI18n } from "@/common/i18n";
import { sty } from "@/common/styles";
import { Header, Icon } from "@/components";

interface IGameItem {
  name: string;
  icon: string;
  route: string;
  description: string;
}

const GameItem: FC<IGameItem> = ({ name, icon, route, description }) => {
  const router = useRouter();
  const { t } = useI18n();
  const styles = useStyles();
  const [visible, setVisible] = useState<boolean>(false);

  const handlePressItem = () => {
    closeMenu();
    router.push(route);
  };

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handlePressScoreboard = () => {
    closeMenu();
    router.push({
      pathname: AppRoutes.GameScoreboard,
      params: { gameName: name.toLowerCase() },
    });
  };

  return (
    <View style={styles.gameItemContainer} onTouchStart={openMenu}>
      <View style={styles.gameItemLabelWrapper}>
        <Text style={styles.gameItemTitle}>{name}</Text>
        <Text style={styles.gameItemDescription}>{description}</Text>
      </View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Icon icon={icon} size={64} />}
      >
        <Menu.Item
          onPress={handlePressItem}
          title={t("games.menu.playButton")}
        />
        <Menu.Item
          onPress={handlePressScoreboard}
          title={t("games.menu.scoreboardButton")}
        />
      </Menu>
    </View>
  );
};

const Page = () => {
  const { t } = useI18n();
  const games: IGameItem[] = useMemo(
    () => [
      {
        name: "Wordle",
        icon: "file-word-box",
        route: AppRoutes.WordleGame,
        description: t("games.menu.wordleDescription"),
      },
      {
        name: "Memory",
        icon: "cards",
        route: AppRoutes.MemoryGame,
        description: t("games.menu.memoryDescription"),
      },
      {
        name: "Sudoku",
        icon: "apps",
        route: AppRoutes.SudokuGame,
        description: t("games.menu.sudokuDescription"),
      },
    ],
    [t],
  );
  return (
    <View>
      <Header title="Games" left={actions.goBack} />
      <FlatList
        data={games}
        renderItem={({ item }) => <GameItem {...item} />}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

const useStyles = sty.themedHook(({ colors }) => ({
  gameItemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    margin: 8,
    borderRadius: 16,
    borderColor: colors.primary,
    borderWidth: 3,
    backgroundColor: colors.surface,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  gameItemLabelWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  gameItemTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
  },
  gameItemDescription: {
    fontSize: 24,
    color: colors.text,
  },
}));

export default Page;
