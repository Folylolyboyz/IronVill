import { useState, useRef, useEffect, useCallback } from "react";
import type { MinecraftServer } from "../types/server";

interface ServerDetailPageProps {
    server: MinecraftServer;
    onBack: () => void;
}

const ServerDetailPage = ({ server, onBack }: ServerDetailPageProps) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [command, setCommand] = useState("");
    const [minRam, setMinRam] = useState("1");
    const [maxRam, setMaxRam] = useState("2");
    const [isRunning, setIsRunning] = useState(false);
    const [connected, setConnected] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const logsEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // WebSocket connection
    const connectWs = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
            return;

        const ws = new WebSocket("ws://localhost:8000/ws");

        ws.onopen = () => {
            setConnected(true);
            setLogs((prev) => [
                ...prev,
                "[System] Connected to server manager.",
            ]);
        };

        ws.onmessage = (event) => {
            setLogs((prev) => [...prev, event.data]);
        };

        ws.onclose = () => {
            setConnected(false);
            setIsRunning(false);
            setLogs((prev) => [...prev, "[System] Disconnected."]);
        };

        ws.onerror = () => {
            setLogs((prev) => [...prev, "[System] WebSocket error."]);
        };

        wsRef.current = ws;
    }, []);

    useEffect(() => {
        connectWs();
        return () => {
            wsRef.current?.close();
        };
    }, [connectWs]);

    const sendJson = (payload: Record<string, unknown>) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
        }
    };

    const handleStart = () => {
        sendJson({
            action: "start",
            min_ram: parseInt(minRam),
            max_ram: parseInt(maxRam),
            server_name: server.name,
        });
        setIsRunning(true);
        setLogs((prev) => [
            ...prev,
            `[System] Starting server "${server.name}" (RAM: ${minRam}G - ${maxRam}G)...`,
        ]);
    };

    const handleStop = () => {
        sendJson({ action: "stop" });
        setIsRunning(false);
        setLogs((prev) => [...prev, "[System] Stopping server..."]);
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim()) return;
        sendJson({ action: "command", command: command.trim() });
        setLogs((prev) => [...prev, `> ${command.trim()}`]);
        setCommand("");
    };

    return (
        <div className="min-h-screen w-screen minecraft-bg p-8">
            <div className="max-w-300 mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="px-5 py-2.5 bg-(--color-bg-gray) border-4 border-b-(--color-border-dark) border-r-(--color-border-dark) border-t-(--color-border-accent) border-l-(--color-border-accent) hover:bg-(--color-bg-gray-hover) hover:border-t-(--color-border-green-hover) hover:border-l-(--color-border-green-hover) active:bg-(--color-bg-gray-active) active:border-t-(--color-border-dark) active:border-l-(--color-border-dark) active:border-b-(--color-border-accent) active:border-r-(--color-border-accent) transition-all duration-75 font-bold text-white tracking-wider shadow-[0_4px_0_0_rgba(0,0,0,0.4)]"
                    >
                        ← BACK
                    </button>
                    <div className="bg-(--color-bg-dark) border-4 border-b-(--color-border-dark) border-r-(--color-border-dark) border-t-(--color-border-light) border-l-(--color-border-light) px-8 py-4 shadow-lg flex-1">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-(--color-text-main) tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.8)]">
                                {server.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="text-(--color-text-secondary) text-sm font-bold uppercase tracking-wider">
                                    {server.type}
                                </span>
                                <span className="text-(--color-text-secondary) text-sm font-bold">
                                    v{server.version}
                                </span>
                                <div
                                    className={`w-3 h-3 ${
                                        isRunning ?
                                            "bg-(--color-text-green) border-(--color-border-green)"
                                        :   "bg-[#555555] border-(--color-border-dark)"
                                    } border-2`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Panel */}
                <div className="bg-[#C6C6C6] border-4 border-b-[#5B5B5B] border-r-[#5B5B5B] border-t-[#FFFFFF] border-l-[#FFFFFF] shadow-[0_4px_6px_0_rgba(0,0,0,0.4)] mb-6">
                    <div className="bg-[#2C2C2C] border-4 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#0C0C0C] border-l-[#0C0C0C] p-5">
                        <div className="flex items-end gap-4 flex-wrap">
                            {/* Min RAM */}
                            <div>
                                <label className="block text-[#FCFCFC] text-xs font-bold mb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    MIN RAM (GB)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={minRam}
                                    onChange={(e) => setMinRam(e.target.value)}
                                    disabled={isRunning}
                                    className="w-24 bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-mono font-medium focus:outline-none disabled:opacity-50"
                                />
                            </div>

                            {/* Max RAM */}
                            <div>
                                <label className="block text-[#FCFCFC] text-xs font-bold mb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    MAX RAM (GB)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={maxRam}
                                    onChange={(e) => setMaxRam(e.target.value)}
                                    disabled={isRunning}
                                    className="w-24 bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-mono font-medium focus:outline-none disabled:opacity-50"
                                />
                            </div>

                            {/* Start / Stop */}
                            {!isRunning ?
                                <button
                                    onClick={handleStart}
                                    disabled={!connected}
                                    className="px-8 py-2.5 bg-[#7CB342] border-4 border-b-[#558B2F] border-r-[#558B2F] border-t-[#9CCC65] border-l-[#9CCC65] hover:bg-[#8BC34A] hover:border-t-[#AED581] hover:border-l-[#AED581] active:bg-[#689F38] active:border-t-[#558B2F] active:border-l-[#558B2F] active:border-b-[#9CCC65] active:border-r-[#9CCC65] transition-all duration-75 font-bold text-white tracking-wider shadow-[0_4px_0_0_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    START
                                </button>
                            :   <button
                                    onClick={handleStop}
                                    className="px-8 py-2.5 bg-[#E53935] border-4 border-b-[#B71C1C] border-r-[#B71C1C] border-t-[#EF5350] border-l-[#EF5350] hover:bg-[#F44336] hover:border-t-[#EF9A9A] hover:border-l-[#EF9A9A] active:bg-[#C62828] active:border-t-[#B71C1C] active:border-l-[#B71C1C] active:border-b-[#EF5350] active:border-r-[#EF5350] transition-all duration-75 font-bold text-white tracking-wider shadow-[0_4px_0_0_rgba(0,0,0,0.4)]"
                                >
                                    STOP
                                </button>
                            }

                            {/* Connection status */}
                            <span
                                className={`text-xs font-bold tracking-wide ml-auto ${
                                    connected ? "text-[#55FF55]" : (
                                        "text-[#FF5555]"
                                    )
                                } drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
                            >
                                {connected ? "CONNECTED" : "DISCONNECTED"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Console */}
                <div className="bg-[#C6C6C6] border-4 border-b-[#5B5B5B] border-r-[#5B5B5B] border-t-[#FFFFFF] border-l-[#FFFFFF] shadow-[0_4px_6px_0_rgba(0,0,0,0.4)]">
                    <div className="bg-[#2C2C2C] border-4 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#0C0C0C] border-l-[#0C0C0C] p-4">
                        <h2 className="text-[#FCFCFC] text-sm font-bold mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            CONSOLE
                        </h2>

                        {/* Log output */}
                        <div className="bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] h-96 overflow-y-auto p-3 mb-3 font-mono text-sm">
                            {logs.map((line, i) => (
                                <div
                                    key={i}
                                    className={`${
                                        line.startsWith("[System]") ?
                                            "text-[#55FFFF]"
                                        : line.startsWith(">") ?
                                            "text-[#FFFF55]"
                                        :   "text-[#CCCCCC]"
                                    } leading-relaxed whitespace-pre-wrap break-all`}
                                >
                                    {line}
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>

                        {/* Command input */}
                        <form onSubmit={handleCommand} className="flex gap-2">
                            <input
                                type="text"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                disabled={!isRunning}
                                placeholder={
                                    isRunning ? "Type a command..." : (
                                        "Start the server to send commands"
                                    )
                                }
                                className="flex-1 bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-mono font-medium focus:outline-none disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!isRunning}
                                className="px-6 py-2 bg-[#5C5C5C] border-4 border-b-[#2C2C2C] border-r-[#2C2C2C] border-t-[#8B8B8B] border-l-[#8B8B8B] hover:bg-[#7C7C7C] hover:border-t-[#ABABAB] hover:border-l-[#ABABAB] active:bg-[#4C4C4C] active:border-t-[#2C2C2C] active:border-l-[#2C2C2C] active:border-b-[#8B8B8B] active:border-r-[#8B8B8B] transition-all duration-75 font-bold text-white tracking-wider shadow-[0_4px_0_0_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                SEND
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServerDetailPage;
