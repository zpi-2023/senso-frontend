import { act, renderHook } from "@testing-library/react-native";

import { useIdentity, IdentityProvider } from "@/common/identity";

describe(useIdentity, () => {
  it("initially returns a null token", () => {
    const { result } = renderHook(() => useIdentity(), {
      wrapper: IdentityProvider,
    });

    expect(result.current.token).toBeNull();
  });

  it("can change the token", () => {
    const { result } = renderHook(() => useIdentity(), {
      wrapper: IdentityProvider,
    });

    act(() => result.current.setToken("SUPER_SECURE_TOKEN"));

    expect(result.current.token).toBe("SUPER_SECURE_TOKEN");
  });
});
