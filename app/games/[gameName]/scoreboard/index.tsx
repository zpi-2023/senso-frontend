import { useLocalSearchParams } from "expo-router";
import { View, FlatList } from "react-native";
import { Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { useQuery } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { capitalize } from "@/common/string";
import { sty } from "@/common/styles";
import { Header } from "@/components";

const Scoreboard = () => {
  const { t } = useI18n();
  const { gameName } = useLocalSearchParams();
  const { data } = useQuery(
    gameName && typeof gameName === "string"
      ? {
          url: "/api/v1/games/{gameName}/leaderboard",
          params: { path: { gameName } },
        }
      : null,
  );

  return (
    <View>
      <Header
        title={t("games.scoreboard.pageTitle", {
          game: gameName ? capitalize(gameName as string) : "",
        })}
        left={actions.goBack}
      />
      <FlatList
        data={data?.items}
        renderItem={({ item, index }) => (
          <View key={item.accountId} style={styles.itemContainer}>
            <View style={styles.position}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginRight: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  ...stageColors(index),
                }}
              >
                <Text style={styles.label}>{index + 1}</Text>
              </View>
              <Text style={styles.label}>{item.displayName}</Text>
            </View>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
        keyExtractor={(item) => item.accountId.toString()}
      />
    </View>
  );
};

const stageColors = (index: number) => {
  switch (index) {
    case 0:
      return { backgroundColor: "#FFD700" };
    case 1:
      return { backgroundColor: "#C0C0C0" };
    case 2:
      return { backgroundColor: "#cd7f32" };
    default:
      return {};
  }
};

const styles = sty.create({
  position: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  label: {
    fontSize: 24,
    marginVertical: 8,
    lineHeight: 32,
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "right",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default Scoreboard;
