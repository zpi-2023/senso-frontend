// TODO: this is a proof of concept, to be removed in the future

import { useEffect, useState } from "react";

import { Text, View } from "@/components/Themed";
import { GET } from "@/util/api";

export function ApiExample() {
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    GET("/User", {}).then(({ data }) => {
      setNames(data as any); // TODO: backend's fault, /Users has incorrect Swagger spec
    });
  }, []);

  return (
    <View>
      {names.map((n) => (
        <Text key={n}>{n}</Text>
      ))}
    </View>
  );
}
