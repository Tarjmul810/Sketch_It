import { BACKEND_URL, TOKEN } from "@repo/common/config";
import axios from "axios";
import { Shapes } from "../types/shapes";

export const getShapes = async (roomId: number) => {
  const token = localStorage.getItem("token")

  try {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data.messages.map((m: any) =>
      JSON.parse(m.message),
    ) as Shapes[];
  } catch (error) {
    console.error(error);
    return [];
  }
};