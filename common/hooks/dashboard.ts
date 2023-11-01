import type { ActionKey } from "../actions";
import { useQuery, useMutation } from "../api";
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
  const updateDashboard = useMutation("put", "/api/v1/dashboard/{seniorId}");

  const setGadgets = (newGadgets: ActionKey[]) => {
    if (!identity.hasProfile) {
      return;
    }

    const body = { gadgets: newGadgets };

    updateDashboard({
      params: { path: { seniorId: identity.profile.seniorId } },
      body,
    }).then(() => mutate(body));
  };

  return [data?.gadgets ? (data.gadgets as ActionKey[]) : null, setGadgets];
};
