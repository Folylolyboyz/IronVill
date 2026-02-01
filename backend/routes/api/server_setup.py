from fastapi import FastAPI
from pydantic import BaseModel
from scraping.get_server_jar import get_all_versions_vanilla
from fastapi.middleware.cors import CORSMiddleware


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