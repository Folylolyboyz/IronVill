import { useState, useEffect } from "react";
import type { MinecraftServer } from "../types/server";
import ServerCard from "./ServerCard";

interface ServerPageProps {
    initialServers: MinecraftServer[];
    onNavigateToImport: () => void;
    onServerSelect: (server: MinecraftServer) => void;
}

const ServerPage = ({
    initialServers,
    onNavigateToImport,
    onServerSelect,
}: ServerPageProps) => {
    const [servers, setServers] = useState<MinecraftServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Replace with your actual API endpoint
        const fetchServers = async () => {
            setLoading(true);
            try {
                // const response = await fetch("");
                // const data = await response.json();
                // setServers(data);

                // Mock data for demonstration
                const mockData: MinecraftServer[] = [
                    {
                        name: "My Favorite Server",
                        type: "vanilla",
                        version: "1.20.4",
                        lastPlayed: "2024-01-26T20:58:00",
                        status: "offline",
                        playerCount: 0,
                        maxPlayers: 20,
                        description: "A friendly survival server",
                    },
                    {
                        name: "Creative Build World",
                        type: "spigot",
                        version: "1.19.3",
                        lastPlayed: "2024-01-25T14:30:00",
                        status: "running",
                        playerCount: 8,
                        maxPlayers: 50,
                        ip: "192.168.1.100",
                        port: 25565,
                    },
                ];

                // Merge mock data with imported servers
                setServers([...mockData, ...initialServers]);
                setError(null);
            } catch (err) {
                setError("Failed to fetch servers");
                console.error("Error fetching servers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchServers();
    }, [initialServers]);

    if (loading) {
        return (
            <div className="min-h-screen minecraft-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-[#2C2C2C] border-4 border-b-[#0C0C0C] border-r-[#0C0C0C] border-t-[#4C4C4C] border-l-[#4C4C4C] px-12 py-8">
                        <div className="w-12 h-12 border-4 border-[#8B8B8B] border-t-[#2C2C2C] animate-spin mx-auto mb-4"></div>
                        <p className="text-[#FCFCFC] text-base font-bold tracking-wide drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
                            Loading servers...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen minecraft-bg flex items-center justify-center">
                <div className="bg-[#AA0000] border-4 border-b-[#550000] border-r-[#550000] border-t-[#FF5555] border-l-[#FF5555] p-8 max-w-md shadow-xl">
                    <p className="text-white text-center font-bold text-lg drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen minecraft-bg p-8">
            <div className="max-w-350 mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="flex justify-center items-center mb-6">
                        <img
                            src="ironvill_logo.png"
                            width={100}
                            height={100}
                            className="p-1 hover:scale-95 cursor-pointer transition-all duration-300 ease-out active:scale-80 border-4 border-b-[#0C0C0C] border-r-[#0C0C0C] border-t-[#4C4C4C] border-l-[#4C4C4C]"
						/>
                        <div className="bg-[#2C2C2C] border-4 border-b-[#0C0C0C] border-r-[#0C0C0C] border-t-[#4C4C4C] border-l-[#4C4C4C] px-8 py-4 shadow-lg">
                            <h1 className="text-3xl font-bold text-[#FCFCFC] tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.8)]">
                                MINECRAFT SERVER MANAGER
                            </h1>
                        </div>
                    </div>
                    <p className="text-[#C6C6C6] text-base font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        Select a server to manage
                    </p>
                </div>

                {/* Server Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                    {servers.map((server) => (
                        <ServerCard
                            server={server}
                            onClick={() => onServerSelect(server)}
                        />
                    ))}
                </div>

                {/* Import Server Button */}
                <div className="flex justify-center mt-10">
                    <button
                        onClick={onNavigateToImport}
                        className="group relative px-10 py-3.5 bg-[#5C5C5C] border-4 border-b-[#2C2C2C] border-r-[#2C2C2C] border-t-[#8B8B8B] border-l-[#8B8B8B] hover:bg-[#7C7C7C] hover:border-t-[#ABABAB] hover:border-l-[#ABABAB] active:bg-[#4C4C4C] active:border-t-[#2C2C2C] active:border-l-[#2C2C2C] active:border-b-[#8B8B8B] active:border-r-[#8B8B8B] transition-all duration-75 font-bold text-white tracking-wider shadow-[0_4px_0_0_rgba(0,0,0,0.4)]"
                    >
                        <span className="flex items-center gap-3 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                            >
                                <path
                                    strokeLinecap="square"
                                    strokeLinejoin="miter"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            IMPORT SERVER
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServerPage;
