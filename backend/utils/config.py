import os
import json
from dotenv import load_dotenv

load_dotenv()

def get_version_links():
    VERSION_LINKS = json.loads(os.getenv("VERSION_LINKS"))
    return VERSION_LINKS