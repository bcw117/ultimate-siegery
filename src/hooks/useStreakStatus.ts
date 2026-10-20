import { useSyncExternalStore } from "react";
import { ChallengeStreak } from "@/lib/types/types";
import { deriveStreakStatus } from "@/lib/utils/streak";

const subscribe = () => () => {};

// The device's time zone only exists in the browser, so this is null during
// SSR and hydration and the derived status appears right after
export function useStreakStatus(streak: ChallengeStreak) {
    const isClient = useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );

    return isClient ? deriveStreakStatus(streak) : null;
}
