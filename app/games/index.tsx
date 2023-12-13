import { useRouter } from "expo-router";
import { useState, type FC, useMemo } from "react";
import { FlatList, View } from "react-native";
import { Card, IconButton, Menu } from "react-native-paper";

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
  const [visible, setVisible] = useState<boolean>(false);

  const handlePressPlay = () => {
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
    <Card style={styles.cardWrapper} onPress={handlePressPlay}>
      <Card.Title
        title={name}
        titleStyle={styles.gameTitle}
        subtitle={description}
        left={(props) => <Icon {...props} icon={icon} />}
        right={(props) => (
          <Menu
            {...props}
            visible={visible}
            onDismiss={closeMenu}
            anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}
          >
            <Menu.Item
              onPress={handlePressScoreboard}
              title={t("games.menu.scoreboardButton")}
            />
          </Menu>
        )}
      />
    </Card>
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
    <View style={sty.full}>
      <Header title="Games" left={actions.goBack} />
      <FlatList
        data={games}
        renderItem={({ item }) => <GameItem {...item} />}
        keyExtractor={(item) => item.name}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = sty.create({
  separator: {
    height: 16,
  },
  gameTitle: {
    fontWeight: "bold",
  },
  cardWrapper: {
    marginHorizontal: 16,
  },
});

export default Page;
