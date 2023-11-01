import type { ActionKey } from "../actions";
import { PUT, useQuery } from "../api";
import type { Identity } from "../identity";

export const useDashboardGadgets = (
  identity: Identity,
): [ActionKey[] | null, (newGadgets: ActionKey[]) => void] => {
  const { data, mutate } = useQuery(
    identity.hasProfile
      ? {
          url: "/api/v1/dashboard/{seniorId}",
          params: { path: { seniorId: identity.profile.seniorId } },
        }
      : null,
  );

  const setGadgets = (newGadgets: ActionKey[]) => {
    if (!identity.hasProfile) {
      return;
    }

    const body = { gadgets: newGadgets };

    PUT("/api/v1/dashboard/{seniorId}", {
      params: { path: { seniorId: identity.profile.seniorId } },
      body,
      headers: { Authorization: `Bearer ${identity.token}` },
    }).then(() => mutate(body));
  };

  return [data?.gadgets ? (data.gadgets as ActionKey[]) : null, setGadgets];
};
