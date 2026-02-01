import { useState } from "react";
import type { MinecraftServer } from "../types/server";

interface ImportServerPageProps {
    onBack: () => void;
    onImport: (server: MinecraftServer) => void;
}

const ImportServerPage = ({ onBack, onImport }: ImportServerPageProps) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "" as MinecraftServer["type"] | "",
        version: "",
        ip: "",
        port: "25565",
        maxPlayers: "20",
        description: "",
        hasModpack: false,
        seed: "",
        worldType: "default",
        motd: "",
        serverConfigs: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [versions, setVersions] = useState<string[]>([]);
    const [loadingVersions, setLoadingVersions] = useState(false);

    const fetchVanillaVersion = async () => {
        setLoadingVersions(true);
        try {
            const response = await fetch(
                "http://localhost:8000/vanilla-versions",
            );
            const data = await response.json();
            // console.log(data.vanilla_versions);
            setVersions(data.vanilla_versions);
        } catch (err) {
            const newErrors: Record<string, string> = {};
            newErrors.version = "Unable to fetch version info.";
            setErrors(newErrors);
        } finally {
            setLoadingVersions(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        // Fetch versions when server type changes to vanilla
        if (name === "type" && value === "vanilla") {
            fetchVanillaVersion();
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Server name is required";
        }

        if (!formData.type) {
            newErrors.type = "Server type is required";
        }

        if (!formData.version.trim()) {
            newErrors.version = "Version is required";
        }

        const port = parseInt(formData.port);
        if (isNaN(port) || port < 1 || port > 65535) {
            newErrors.port = "Port must be between 1 and 65535";
        }

        const maxPlayers = parseInt(formData.maxPlayers);
        if (isNaN(maxPlayers) || maxPlayers < 1) {
            newErrors.maxPlayers = "Max players must be at least 1";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // validate all inputs and call the submit button
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const serverData: MinecraftServer = {
            name: formData.name,
            type: formData.type,
            version: formData.version,
            status: "offline",
            ip: formData.ip || undefined,
            port: parseInt(formData.port),
            maxPlayers: parseInt(formData.maxPlayers),
            playerCount: 0,
            description: formData.description || undefined,
            seed: formData.seed || undefined,
            worldType: formData.worldType || undefined,
            motd: formData.motd || undefined,
            serverConfigs: formData.serverConfigs || undefined,
        };
        onImport(serverData);
    };

    return (
        <div className="min-h-screen w-screen minecraft-bg p-8">
            <div className="max-w-200 mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-block mb-6">
                        <div className="bg-[#2C2C2C] border-4 border-b-[#0C0C0C] border-r-[#0C0C0C] border-t-[#4C4C4C] border-l-[#4C4C4C] px-8 py-4 shadow-lg">
                            <h1 className="text-3xl font-bold text-[#FCFCFC] tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.8)]">
                                IMPORT NEW SERVER
                            </h1>
                        </div>
                    </div>
                    <p className="text-[#C6C6C6] text-base font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        Enter the details of your Minecraft server
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-[#C6C6C6] border-4 border-b-[#5B5B5B] border-r-[#5B5B5B] border-t-[#FFFFFF] border-l-[#FFFFFF] shadow-[0_4px_6px_0_rgba(0,0,0,0.4)]">
                    <div className="bg-[#2C2C2C] border-4 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#0C0C0C] border-l-[#0C0C0C] p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Server Name */}
                            <div>
                                <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    SERVER NAME *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-medium focus:outline-none focus:border-t-[#1C1C1C] focus:border-l-[#1C1C1C]"
                                    placeholder="My Awesome Server"
                                />
                                {errors.name && (
                                    <p className="text-[#FF5555] text-xs mt-1 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Server Type & Version Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        SERVER TYPE *
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full bg-[#5C5C5C] border-4 border-b-[#2C2C2C] border-r-[#2C2C2C] border-t-[#8B8B8B] border-l-[#8B8B8B] px-3 py-2 text-[#FCFCFC] font-bold focus:outline-none cursor-pointer"
                                    >
                                        <option value="">
                                            Select Server Type
                                        </option>
                                        <option value="vanilla">Vanilla</option>
                                        <option value="spigot">Spigot</option>
                                        <option value="paper">Paper</option>
                                        <option value="forge">Forge</option>
                                        <option value="fabric">Fabric</option>
                                        <option value="bukkit">Bukkit</option>
                                        <option value="bedrock">Bedrock</option>
                                    </select>
                                    {errors.type && (
                                        <p className="text-[#FF5555] text-xs mt-1 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        VERSION *
                                    </label>
                                    <select
                                        name="version"
                                        value={formData.version}
                                        onChange={handleChange}
                                        disabled={loadingVersions}
                                        className="w-full bg-[#5C5C5C] border-4 border-b-[#2C2C2C] border-r-[#2C2C2C] border-t-[#8B8B8B] border-l-[#8B8B8B] px-3 py-2 text-[#FCFCFC] font-bold focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">
                                            {loadingVersions ?
                                                "Loading..."
                                            :   "Select Version"}
                                        </option>
                                        {versions.map((version) => (
                                            <option
                                                key={version}
                                                value={version}
                                            >
                                                {version}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.version && (
                                        <p className="text-[#FF5555] text-xs mt-1 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                            {errors.version}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* IP & Port Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        SERVER IP
                                    </label>
                                    <input
                                        type="text"
                                        name="ip"
                                        value={formData.ip}
                                        onChange={handleChange}
                                        className="w-full bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-mono font-medium focus:outline-none focus:border-t-[#1C1C1C] focus:border-l-[#1C1C1C]"
                                        placeholder="192.168.1.100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        PORT
                                    </label>
                                    <input
                                        type="text"
                                        name="port"
                                        value={formData.port}
                                        onChange={handleChange}
                                        className="w-full bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-mono font-medium focus:outline-none focus:border-t-[#1C1C1C] focus:border-l-[#1C1C1C]"
                                    />
                                    {errors.port && (
                                        <p className="text-[#FF5555] text-xs mt-1 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                            {errors.port}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Max Players */}
                            <div>
                                <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    MAX PLAYERS
                                </label>
                                <input
                                    type="text"
                                    name="maxPlayers"
                                    value={formData.maxPlayers}
                                    onChange={handleChange}
                                    className="w-full bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-medium focus:outline-none focus:border-t-[#1C1C1C] focus:border-l-[#1C1C1C]"
                                />
                                {errors.maxPlayers && (
                                    <p className="text-[#FF5555] text-xs mt-1 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        {errors.maxPlayers}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    DESCRIPTION
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-medium focus:outline-none focus:border-t-[#1C1C1C] focus:border-l-[#1C1C1C] resize-none"
                                    placeholder="A friendly survival server for friends"
                                />
                            </div>

                            {/* Seed & World Type Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        WORLD SEED
                                    </label>
                                    <input
                                        type="text"
                                        name="seed"
                                        value={formData.seed}
                                        onChange={handleChange}
                                        className="w-full bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-mono font-medium focus:outline-none focus:border-t-[#1C1C1C] focus:border-l-[#1C1C1C]"
                                        placeholder="-1234567890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        WORLD TYPE
                                    </label>
                                    <select
                                        name="worldType"
                                        value={formData.worldType}
                                        onChange={handleChange}
                                        className="w-full bg-[#5C5C5C] border-4 border-b-[#2C2C2C] border-r-[#2C2C2C] border-t-[#8B8B8B] border-l-[#8B8B8B] px-3 py-2 text-[#FCFCFC] font-bold focus:outline-none cursor-pointer"
                                    >
                                        <option value="default">Default</option>
                                        <option value="flat">Flat</option>
                                        <option value="largebiomes">
                                            Large Biomes
                                        </option>
                                        <option value="amplified">
                                            Amplified
                                        </option>
                                        <option value="buffet">Buffet</option>
                                    </select>
                                </div>
                            </div>

                            {/* MOTD */}
                            <div>
                                <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    MOTD (MESSAGE OF THE DAY)
                                </label>
                                <input
                                    type="text"
                                    name="motd"
                                    value={formData.motd}
                                    onChange={handleChange}
                                    className="w-full bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-medium focus:outline-none focus:border-t-[#1C1C1C] focus:border-l-[#1C1C1C]"
                                    placeholder="Welcome to our Minecraft server!"
                                />
                            </div>

                            {/* Server Configs */}
                            <div>
                                <label className="block text-[#FCFCFC] text-sm font-bold mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                    SERVER CONFIGS
                                </label>
                                <textarea
                                    name="serverConfigs"
                                    value={formData.serverConfigs}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-[#0C0C0C] border-2 border-b-[#4C4C4C] border-r-[#4C4C4C] border-t-[#000000] border-l-[#000000] px-3 py-2 text-[#FCFCFC] font-mono text-sm font-medium focus:outline-none focus:border-t-[#1C1C1C] focus:border-l-[#1C1C1C] resize-none"
                                    placeholder="difficulty=normal&#10;gamemode=survival&#10;pvp=true&#10;max-world-size=29999984"
                                />
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-b-2 border-t-[#0C0C0C] border-b-[#4C4C4C] my-6" />

                            {/* Buttons */}
                            <div className="flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="px-8 py-3 bg-[#5C5C5C] border-4 border-b-[#2C2C2C] border-r-[#2C2C2C] border-t-[#8B8B8B] border-l-[#8B8B8B] hover:bg-[#6C6C6C] hover:border-t-[#9B9B9B] hover:border-l-[#9B9B9B] active:bg-[#4C4C4C] active:border-t-[#2C2C2C] active:border-l-[#2C2C2C] active:border-b-[#8B8B8B] active:border-r-[#8B8B8B] transition-all duration-75 font-bold text-white tracking-wider shadow-[0_4px_0_0_rgba(0,0,0,0.4)]"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-[#7CB342] border-4 border-b-[#558B2F] border-r-[#558B2F] border-t-[#9CCC65] border-l-[#9CCC65] hover:bg-[#8BC34A] hover:border-t-[#AED581] hover:border-l-[#AED581] active:bg-[#689F38] active:border-t-[#558B2F] active:border-l-[#558B2F] active:border-b-[#9CCC65] active:border-r-[#9CCC65] transition-all duration-75 font-bold text-white tracking-wider shadow-[0_4px_0_0_rgba(0,0,0,0.4)] drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]"
                                >
                                    IMPORT SERVER
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportServerPage;
