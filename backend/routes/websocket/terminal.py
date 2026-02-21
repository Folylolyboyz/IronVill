import asyncio
import subprocess
from fastapi import WebSocket, WebSocketDisconnect


class MinecraftServer:
    def __init__(self):
        self.process: subprocess.Popen | None = None

    def start(self, min_ram: int, max_ram: int):
        if self.process:
            return

        CMD = f"java -Xmx{min_ram}G -Xms{max_ram}G -jar server.jar nogui".split()

        self.process = subprocess.Popen(
            CMD,
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