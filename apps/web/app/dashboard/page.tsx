"use client"

import { LogOut, Pencil, Plus, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/config";


export default function Dashboard() {

  const router = useRouter()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [rooms, setRooms] = useState([]);
  const [joinRoomName, setJoinRoomName] = useState("");
  const [createRoomName, setCreateRoomName] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    const storedToken = localStorage.getItem("token")

    setUserEmail(storedEmail)
    setToken(storedToken)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/')
  };

  const handleCreateRoom = async (e: any) => {
    e.preventDefault();
    const response = await axios.post(`${BACKEND_URL}/room`, {
      slug: createRoomName
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

    router.push(`/room/${response.data.slug}`);
  };

  const handleJoinRoom = (e: any) => {
    e.preventDefault();
    router.push(`/room/${joinRoomName}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-cyan-50">
      <nav className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center transform rotate-3">
              <Pencil className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              DrawFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-lg text-gray-600">Create or join a room to start collaborating</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create Room</h2>
            </div>
            <p className="text-gray-600 mb-6">Create a new collaborative room</p>

            <form
              onSubmit={handleCreateRoom}
              className="space-y-4">
              <div className="py-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={createRoomName}
                  onChange={(e) => setCreateRoomName(e.target.value)}
                  placeholder="e.g., Project Alpha Design"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={!createRoomName.trim()}
                className="w-full py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Create Room
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-600" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Join Room</h2>
            </div>
            <p className="text-gray-600 mb-6">Join an existing collaborative room</p>

            <form
              onSubmit={handleJoinRoom}
              className="space-y-4">
              <div className="py-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={joinRoomName}
                  onChange={(e) => setJoinRoomName(e.target.value)}
                  placeholder="Enter room name to join"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={!joinRoomName.trim()}
                className="w-full py-3 bg-linear-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Rooms</h2>
            <div className="relative flex items-center justify-between">
              <Search className="absolute left-3 w-5 h-5 text-gray-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search rooms..."
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
              />
            </div>
          </div>

          {/* <div className="grid md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Created {room.createdAt}</p>
                    </div>
                    <div className="bg-linear-to-br from-blue-500 to-cyan-500 rounded-full p-2">
                      <Users className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(room.participants, 3) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {room.participants} {room.participants === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 font-medium text-sm">
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div> */}

          {rooms.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No rooms yet</h3>
              <p className="text-gray-600">Create a room or join an existing one to get started</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}