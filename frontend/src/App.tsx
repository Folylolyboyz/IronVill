import { useState } from "react";
import ServerPage from "./components/ServerPage";
import ImportServerPage from "./components/ImportServerPage";
// import ServerDetailPage from "./components/ServerDetailPage";
import type { MinecraftServer } from "./types/server";

function App() {
    const [currentPage, setCurrentPage] = useState<
        "servers" | "import" | "detail"
    >("servers");
    const [servers, setServers] = useState<MinecraftServer[]>([]);
    // const [selectedServer, setSelectedServer] =
    //     useState<MinecraftServer | null>(null);

    const handleImportServer = (serverData: MinecraftServer) => {        
		setServers((prev) => [...prev, serverData]);
        setCurrentPage("servers");
    };

    const handleServerSelect = (server: MinecraftServer) => {
        // setSelectedServer(server);
        // setCurrentPage("detail");
    };

    return (
        <>
            {currentPage === "servers" ?
                <ServerPage
                    initialServers={servers}
                    onNavigateToImport={() => setCurrentPage("import")}
                    onServerSelect={handleServerSelect}
                />
            : currentPage === "import" ?
                <ImportServerPage
                    onBack={() => setCurrentPage("servers")}
                    onImport={handleImportServer}
                />
            // : selectedServer ?
            //     <ServerDetailPage
            //         server={selectedServer}
            //         onBack={() => setCurrentPage("servers")}
            //     />
            :   null}
        </>
    );
}

export default App;
