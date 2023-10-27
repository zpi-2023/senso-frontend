import type { ActionKey } from "../actions";
import { useApi } from "../api";
import type { Identity } from "../identity";

export const useDashboardGadgets = (identity: Identity): ActionKey[] | null => {
  const { data } = useApi(
    identity.hasProfile
      ? {
          url: "/api/v1/dashboard/{seniorId}",
          params: { path: { seniorId: identity.profile.seniorId } },
        }
      : null,
  );

  if (!data?.gadgets) {
    return null;
  }

  return data.gadgets as ActionKey[];
};
