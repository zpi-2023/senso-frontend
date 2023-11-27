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

  it.each([
    // EN
    ["STRING", "en" as const, "STRING examples"],
    [0, "en" as const, "0 examples"],
    [1, "en" as const, "1 example"],
    [2, "en" as const, "2 examples"],
    [3, "en" as const, "3 examples"],
    [4, "en" as const, "4 examples"],
    [5, "en" as const, "5 examples"],
    [100, "en" as const, "100 examples"],
    // PL
    ["STRING", "pl" as const, "STRING przykładów"],
    [0, "pl" as const, "0 przykładów"],
    [1, "pl" as const, "1 przykład"],
    [2, "pl" as const, "2 przykłady"],
    [3, "pl" as const, "3 przykłady"],
    [4, "pl" as const, "4 przykłady"],
    [5, "pl" as const, "5 przykładów"],
    [100, "pl" as const, "100 przykładów"],
  ])("correctly pluralizes count %d in %p", (count, language, expected) => {
    render(
      <MockI18nProvider language={language}>
        <I18nConsumer args={["__MOCK_COUNT", { count }]} />
      </MockI18nProvider>,
    );

    expect(screen.getByText(expected)).toBeVisible();
  });
});
