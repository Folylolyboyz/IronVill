import type { MinecraftServer } from "../types/server";

interface ServerCardProps {
    server: MinecraftServer;
    onClick?: () => void;
}

const ServerCard = ({ server, onClick }: ServerCardProps) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getServerTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            vanilla: "🧊",
            spigot: "💧",
            paper: "📄",
            forge: "⚒️",
            fabric: "🧵",
            bukkit: "📦",
            bedrock: "🪨",
        };
        return icons[type] || "🎮";
    };

    const getServerTypeColor = (type: string) => {
        // Minecraft-inspired solid colors with border accent
        const colors: Record<string, { bg: string; border: string }> = {
            vanilla: { bg: "bg-[#7CB342]", border: "border-[#558B2F]" }, // Grass green
            spigot: { bg: "bg-[#FBC02D]", border: "border-[#F57F17]" }, // Gold/yellow
            paper: { bg: "bg-[#42A5F5]", border: "border-[#1976D2]" }, // Sky blue
            forge: { bg: "bg-[#E53935]", border: "border-[#B71C1C]" }, // Redstone red
            fabric: { bg: "bg-[#AB47BC]", border: "border-[#6A1B9A]" }, // Purple
            bukkit: { bg: "bg-[#8D6E63]", border: "border-[#4E342E]" }, // Wood brown
            bedrock: { bg: "bg-[#78909C]", border: "border-[#455A64]" }, // Stone gray
        };
        return (
            colors[type] || { bg: "bg-[#757575]", border: "border-[#424242]" }
        );
    };

    const typeColor = getServerTypeColor(server.type);

    return (
        <div
            onClick={onClick}
            className="group relative bg-[#C6C6C6] border-4 border-b-[#5B5B5B] border-r-[#5B5B5B] border-t-[#FFFFFF] border-l-[#FFFFFF] hover:border-t-[#EFEFEF] hover:border-l-[#EFEFEF] transition-all duration-100 cursor-pointer hover:translate-y-px shadow-[0_4px_6px_0_rgba(0,0,0,0.4)]"
        >
            {/* Inner dark container */}
            <div className="bg-[#2C2C2C] border-4 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#0C0C0C] border-l-[#0C0C0C] p-5 relative">
                {/* Status Indicator */}
                <div className="absolute top-3 right-3 z-10">
                    {server.status === "running" ?
                        <div className="relative">
                            <div className="w-4 h-4 bg-[#00AA00] border-2 border-[#005500]" />
                            <div className="absolute inset-0 w-4 h-4 bg-[#55FF55] border-2 border-[#00AA00] animate-ping" />
                        </div>
                    :   <div className="w-4 h-4 bg-[#555555] border-2 border-[#2C2C2C]" />
                    }
                </div>

                {/* Server Icon & Type Badge */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                        <div
                            className={`w-20 h-20 ${typeColor.bg} border-4 border-b-black/40 border-r-black/40 border-t-white/30 border-l-white/30 flex items-center justify-center text-4xl shadow-lg`}
                        >
                            {getServerTypeIcon(server.type)}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[#FCFCFC] mb-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] group-hover:text-[#FFFF55] transition-colors truncate">
                            {server.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className={`px-2.5 py-1 ${typeColor.bg} border-2 border-b-black/40 border-r-black/40 border-t-white/20 border-l-white/20 text-white text-[10px] font-bold uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
                            >
                                {server.type}
                            </span>
                            <span className="text-[#C6C6C6] text-xs font-bold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                v{server.version}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t-2 border-b-2 border-t-[#0C0C0C] border-b-[#4C4C4C] my-3" />

                {/* Server Info */}
                <div className="space-y-2">
                    {server.description && (
                        <p className="text-[#AAAAAA] text-sm line-clamp-2 mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            {server.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#999999] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            Last Played
                        </span>
                        <span className="text-[#E0E0E0] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            {formatDate(server.lastPlayed)}
                        </span>
                    </div>

                    {server.status === "running" &&
                        server.playerCount !== undefined && (
                            <div className="flex items-center justify-between text-sm bg-[#1C1C1C] border-2 border-b-[#3C3C3C] border-r-[#3C3C3C] border-t-[#0C0C0C] border-l-[#0C0C0C] px-2 py-1.5">
                                <span className="text-[#999999] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    Players Online
                                </span>
                                <span className="text-[#55FF55] font-bold text-base drop-shadow-[0_2px_4px_rgba(85,255,85,0.6)]">
                                    {server.playerCount} / {server.maxPlayers}
                                </span>
                            </div>
                        )}

                    {server.ip && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[#999999] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                Address
                            </span>
                            <span className="text-[#55FFFF] font-mono text-xs font-bold drop-shadow-[0_1px_3px_rgba(85,255,255,0.5)]">
                                {server.ip}:{server.port || 25565}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServerCard;
