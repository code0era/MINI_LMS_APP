import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected && !!state.isInternetReachable !== false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isOnline;
}

// Documentation: Subscribes to device network state to drive the global offline banner UI.
