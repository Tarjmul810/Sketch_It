import axios from "axios"
import { BACKEND_URL, TOKEN } from"@repo/common/config"
import { CanvasClient } from "./CanvasClient"

const getRoomId = async (slug: string) => {
    console.log(`${BACKEND_URL}/room/${slug}`, typeof slug)
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`, { headers: {Authorization: `Bearer ${TOKEN}`}})
    return response.data.roomId
}

export default async function Canvas ({ slug }: { slug: string }) {

    const roomId = await getRoomId(slug)
    console.log(roomId)
    return <CanvasClient roomId={roomId} />
}