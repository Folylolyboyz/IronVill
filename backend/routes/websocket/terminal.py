import asyncio
import subprocess
from pathlib import Path
import os
from fastapi import WebSocket, WebSocketDisconnect

class MinecraftServer:
    def __init__(self):
        self.process: subprocess.Popen | None = None
        self.BASE_DIR = Path(__file__).resolve().parents[3]


    def start(self, min_ram: int, max_ram: int, server_name: str):
        if self.process:
            return

        SERVER_DIR = os.path.join(self.BASE_DIR, "servers", server_name)
        JAR_PATH = os.path.join(SERVER_DIR, "server.jar")
        CMD = f"java -Xms{min_ram}G -Xmx{max_ram}G -jar {JAR_PATH} nogui".split()
        
        EULA_PATH = os.path.join(SERVER_DIR, "eula.txt")
        with open(EULA_PATH, "w") as f:
            f.writelines(["eula=true\n"])

        self.process = subprocess.Popen(
            CMD,
            cwd=SERVER_DIR,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )

    def stop(self):
        if self.process:
            self.process.stdin.write("stop\n")
            self.process.stdin.flush()

    def send_command(self, command: str):
        if self.process:
            self.process.stdin.write(command + "\n")
            self.process.stdin.flush()

    async def stream_output(self, websocket: WebSocket):
        loop = asyncio.get_event_loop()

        while self.process and self.process.poll() is None:
            line = await loop.run_in_executor(
                None, self.process.stdout.readline
            )
            if line:
                await websocket.send_text(line)

