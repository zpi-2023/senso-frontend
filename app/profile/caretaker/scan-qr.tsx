import { BarCodeScanner } from "expo-barcode-scanner";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";

import { actions } from "@/common/actions";
import { POST } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { RedirectIfLoggedOut, useIdentity } from "@/common/identity";
import { Header } from "@/components/Header";

export default function App() {
  const { t } = useI18n();
  const identity = useIdentity();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  if (!identity.isLoggedIn) {
    return <RedirectIfLoggedOut identity={identity} />;
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    const { seniorDisplayName, hash } = JSON.parse(data);
    Alert.alert(
      t("scanQR.alertTitle"),
      t("scanQR.alertDescription", { name: seniorDisplayName }),
      [
        {
          text: t("scanQR.alertCancel"),
          style: "cancel",
          onPress: () => setScanned(false),
        },
        {
          text: t("scanQR.alertAdd"),
          onPress: async () => {
            router.back();
            setScanned(false);
            const { data } = await POST("/api/v1/account/profiles/caretaker", {
              headers: { Authorization: `Bearer ${identity.token}` },
              body: { hash, seniorAlias: seniorDisplayName },
            });
            if (!data) {
              return;
            }

            const { seniorId, seniorAlias, type } = data;
            identity.selectProfile({
              type: type as "senior" | "caretaker", // TODO remove when backend type is ready
              seniorAlias,
              seniorId,
            });
          },
        },
      ],
    );
  };

  if (hasPermission === null) {
    return <Text>{t("scanQR.requestingPermission")}</Text>;
  }
  if (hasPermission === false) {
    return <Text>{t("scanQR.noPermission")}</Text>;
  }

  return (
    <View style={styles.container}>
      <Header
        left={actions.goBack}
        title={t("createSeniorProfile.pageTitle")}
      />
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
