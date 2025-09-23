import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

/**
 * Custom hook to monitor the network connection status.
 * @returns {boolean | null} True if connected, false if not, null on initial check.
 */
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
};
