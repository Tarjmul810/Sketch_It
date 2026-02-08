import axios from "axios"
import { BACKEND_URL, TOKEN } from "@repo/common/config"
import { cookies } from "next/headers"
import { CanvasClient } from "./CanvasClient"

const getRoomId = async (slug: string) => {
    const token = (await cookies()).get("token")?.value
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`, { headers: { Authorization: `Bearer ${token}` } })
    return response.data.roomId
}

export default async function Canvas({ slug }: { slug: string }) {

    const roomId = await getRoomId(slug)

    console.log(roomId )
    return (
        <div className=" ">
            <CanvasClient roomId={roomId} />
        </div>
    )
}