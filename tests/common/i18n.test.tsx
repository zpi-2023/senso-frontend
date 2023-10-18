import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native-paper";

import { I18nProvider, MockI18nProvider, useI18n } from "@/common/i18n";

type TArgs = Parameters<ReturnType<typeof useI18n>["t"]>;

const I18nConsumer = ({ args }: { args: TArgs }) => {
  const { t } = useI18n();
  return <Text>{t(...args)}</Text>;
};

describe(useI18n, () => {
  it("displays English translation by default", () => {
    render(
      <I18nProvider>
        <I18nConsumer args={["__MOCK_BASE"]} />
      </I18nProvider>,
    );

    expect(screen.getByText("English mock value")).toBeVisible();
  });

  it("falls back to English translation when others are unavailable", () => {
    render(
      <MockI18nProvider language="pl">
        <I18nConsumer args={["__MOCK_DEFAULT"]} />
      </MockI18nProvider>,
    );

    expect(screen.getByText("Only English value")).toBeVisible();
  });

  it.each([
    ["en" as const, "English mock value"],
    ["pl" as const, "Polish mock value"],
  ])("displays the correct translation for %p", (language, result) => {
    render(
      <MockI18nProvider language={language}>
        <I18nConsumer args={["__MOCK_BASE"]} />
      </MockI18nProvider>,
    );

    expect(screen.getByText(result)).toBeVisible();
  });

  it.each([
    ["en" as const, 123, "subst", "English 123 mock subst value"],
    ["pl" as const, true, -1, "Polish true mock -1 value"],
  ])("correctly substitutes values in %p", (language, x, key, result) => {
    render(
      <MockI18nProvider language={language}>
        <I18nConsumer args={["__MOCK_SUBSTITUTION", { x, key }]} />
      </MockI18nProvider>,
    );

    expect(screen.getByText(result)).toBeVisible();
  });
});
