import { useLocalSearchParams } from "expo-router";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";

import { actions } from "@/common/actions";
import { useQuery } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { RedirectIfNoProfile, useIdentity } from "@/common/identity";
import { capitalize } from "@/common/string";
import { sty } from "@/common/styles";
import { Header, LoadingScreen } from "@/components";

const Scoreboard = () => {
  const { t } = useI18n();
  const styles = useStyles();
  const identity = useIdentity();
  const { gameName } = useLocalSearchParams();
  const { data: leaderboardData } = useQuery(
    typeof gameName === "string"
      ? {
          url: "/api/v1/games/{gameName}/leaderboard",
          params: { path: { gameName }, query: { limit: 10 } },
        }
      : null,
  );
  const { data: yourScoreData } = useQuery(
    typeof gameName === "string"
      ? {
          url: "/api/v1/games/{gameName}/score",
          params: { path: { gameName } },
        }
      : null,
  );

  if (!identity.hasProfile) {
    return <RedirectIfNoProfile identity={identity} />;
  }

  if (!leaderboardData || !yourScoreData) {
    return <LoadingScreen title={t("games.scoreboard.loading")} />;
  }

  const { items } = leaderboardData;
  const { score: yourScore } = yourScoreData;

  const isYourScoreInLeaderboard = items.some(
    (item) => item.accountId === identity.accountId,
  );

  return (
    <View>
      <Header
        title={t("games.scoreboard.pageTitle", {
          game:
            gameName && typeof gameName === "string"
              ? capitalize(gameName)
              : "",
        })}
        left={actions.goBack}
      />
      {items.length > 0 ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={styles.score}>{t("games.scoreboard.nameColumn")}</Text>
            <Text style={styles.score}>
              {t("games.scoreboard.scoreColumn")}
            </Text>
          </View>
          <ScrollView style={styles.scrollView}>
            {items.map((item, index) => (
              <View key={item.accountId} style={styles.itemContainer}>
                <View style={styles.position}>
                  <View style={[styles.medal, stageColors(index)]}>
                    <Text style={styles.place}>{index + 1}</Text>
                  </View>
                  <Text style={styles.label}>{item.displayName}</Text>
                </View>
                <Text style={styles.score}>{item.score}</Text>
              </View>
            ))}
          </ScrollView>
          {!isYourScoreInLeaderboard && (
            <View style={styles.yourScoreContainer}>
              <Text style={styles.score}>
                {t("games.scoreboard.yourScore")}
              </Text>
              <Text style={styles.score}>{yourScore}</Text>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.emptyStateLabel}>
          {t("games.scoreboard.noScores")}
        </Text>
      )}
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

const useStyles = sty.themedHook(({ colors }) => ({
  position: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  medal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  emptyStateLabel: {
    alignSelf: "center",
    fontSize: 24,
    color: colors.text,
    marginTop: 32,
  },
  yourScoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 24,
    lineHeight: 32,
  },
  place: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
    textAlign: "center",
  },
  scrollView: {
    maxHeight: "80%",
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
    margin: 8,
    borderRadius: 16,
    backgroundColor: colors.secondaryContainer,
  },
}));

export default Scoreboard;
