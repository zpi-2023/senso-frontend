import { BarCodeScanner } from "expo-barcode-scanner";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View, Alert } from "react-native";

import { actions } from "@/common/actions";
import { useMutation } from "@/common/api";
import { useI18n } from "@/common/i18n";
import { RedirectIfLoggedOut, useIdentity } from "@/common/identity";
import { sty } from "@/common/styles";
import { Header } from "@/components";

export default function Page() {
  const { t } = useI18n();
  const identity = useIdentity();
  const createCaretakerProfile = useMutation(
    "post",
    "/api/v1/account/profiles/caretaker",
  );

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    void getBarCodeScannerPermissions();
  }, []);

  if (!identity.isLoggedIn) {
    return <RedirectIfLoggedOut identity={identity} />;
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    const parsed = parseQrData(data);
    if (!parsed) {
      return;
    }
    const { seniorDisplayName, hash } = parsed;
    setScanned(true);

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
            const { data } = await createCaretakerProfile({
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
        style={sty.absoluteFill}
      />
    </View>
  );
}

const styles = sty.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

const parseQrData = (data: string) => {
  try {
    const parsed = JSON.parse(data) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "seniorDisplayName" in parsed &&
      typeof parsed["seniorDisplayName"] === "string" &&
      "hash" in parsed &&
      typeof parsed["hash"] === "number"
    ) {
      const { seniorDisplayName, hash } = parsed;
      return { seniorDisplayName, hash };
    }
    return null;
  } catch {
    return null;
  }
};
