import { FC, PropsWithChildren } from "react";

export const ProviderList = ({
  providers,
  children,
}: PropsWithChildren<{
  providers: FC<{ children: JSX.Element }>[];
}>) => {
  if (providers.length === 0) return <>{children}</>;
  const Current = providers[0]!;
  return (
    <Current>
      <ProviderList providers={providers.slice(1)}>{children}</ProviderList>
    </Current>
  );
};
