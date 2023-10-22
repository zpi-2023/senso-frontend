import { BarCodeScanner } from "expo-barcode-scanner";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";

import { actions } from "@/common/actions";
import { useI18n } from "@/common/i18n";
import { Header } from "@/components/Header";

export default function App() {
  const { t } = useI18n();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    const { seniorDisplayName, hash } = JSON.parse(data);
    Alert.alert(
      t("scanQR.alertTitle"),
      `name: ${seniorDisplayName}\nhash: ${hash}`,
      [
        {
          text: t("scanQR.alertCancel"),
          style: "cancel",
          onPress: () => setScanned(false),
        },
        {
          text: t("scanQR.alertAdd"),
          onPress: () => {
            router.back();
            setScanned(false);
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
