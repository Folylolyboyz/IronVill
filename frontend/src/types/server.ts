export interface MinecraftServer {
    name: string;
    type:
        | ""
        | "vanilla"
        | "spigot"
        | "paper"
        | "forge"
        | "fabric"
        | "bukkit"
        | "bedrock";
    version: string;
    lastPlayed?: string;
    status: "running" | "offline";
    playerCount?: number;
    maxPlayers?: number;
    ip?: string;
    port?: number;
    description?: string;
    seed?: string;
    worldType?: string;
    motd?: string;
    serverConfigs?: string;
}