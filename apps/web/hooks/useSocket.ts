import { useEffect, useState } from "react";
import { WS_URL } from "@repo/common/config";
import { getToken } from "../lib/auth";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    ws.onclose = () => {
      setLoading(true);
      setSocket(null);
    };

    ws.onerror = () => {
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { socket, loading };
}
