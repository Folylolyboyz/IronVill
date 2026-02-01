from fastapi import FastAPI
from pydantic import BaseModel
from scraping.get_server_jar import get_all_versions_vanilla


app = FastAPI()

@app.get("/")
def health_check():
    return {"message": "API is working"}

@app.get("/vanilla-versions")
def send_vanilla_versions():
    return {"vanilla_versions" : get_all_versions_vanilla()}