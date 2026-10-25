import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_db():
    mongo_uri = os.environ.get("MONGO_URI")
    if not mongo_uri:
        raise ValueError("MONGO_URI environment variable is not set.")
    client = MongoClient(mongo_uri)
    try:
        db = client.get_default_database()
        if db is not None:
            return db
    except Exception:
        pass
    return client["test"]
