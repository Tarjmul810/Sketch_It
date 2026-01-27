import { useEffect, useState } from "react";
import { WS_URL, TOKEN } from "@repo/common/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=${localStorage.getItem("token") || TOKEN}`,
    );

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    return () => {
      ws.close();
      setLoading(true);
    };
  }, []);

  return { socket, loading };
}
