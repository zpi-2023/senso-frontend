// TODO: this is a proof of concept, to be removed in the future
import { Text, View } from "@/components/Themed";
import { useApi } from "@/util/api";

export function ApiExample() {
  const { data } = useApi({ url: "/user" });

  return (
    <View>
      {(data as any as string[] | undefined) // TODO: backend's fault, the Swagger spec is invalid
        ?.map((n) => <Text key={n}>{n}</Text>) ?? "Loading..."}
    </View>
  );
}
