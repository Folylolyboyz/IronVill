from fastapi import FastAPI
from pydantic import BaseModel
from scraping.get_server_jar import get_all_versions_vanilla
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio

from routes.websocket.terminal import MinecraftServer



app = FastAPI()

origins = [
    "http://localhost:5173",  # Vite dev server
    # "http://localhost:3000",  # Alternative React port
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"message": "API is working"}


@app.get("/vanilla-versions")
def send_vanilla_versions():
    return {"vanilla_versions" : get_all_versions_vanilla()}


# STARTING THE SERVER AND MANAGING IT
def start_server():
    server = MinecraftServer() 
    return server

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_json()

            action = data.get("action")

            if action == "start":
                server = start_server()
                print("started")
                server.start(data["min_ram"], data["max_ram"], data["server_name"])
                asyncio.create_task(server.stream_output(websocket))

            elif action == "stop":
                try:
                    print("stopped")
                    server.stop()
                except:
                    continue

            elif action == "command":
                print(data["command"])
                server.send_command(data["command"])

    except WebSocketDisconnect:
        pass

#uvicorn routes.api.server_setup:app --reload