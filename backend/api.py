#!.venv/bin/python

"""API Service"""

from html import escape
from os import environ, getenv
from tomllib import load

from fastapi import FastAPI
from uvicorn import run

from db import add as c, delete as d, get as r, Med


api = FastAPI()


@api.post("/api/add")
def add(med: Med):
    """Add medication"""
    return c(med)


@api.get("/api/get/{name}")
def get(name: str):
    """Get medication"""
    return r(name)


@api.delete("/api/delete/{pk}")
def delete(pk: int):
    """Delete medication"""
    d(pk)


@api.get("/api/version")
def get_version():
    """Returns version"""
    version = getenv("BACKEND_VERSION")
    if not version:
        with open(file="pyproject.toml", mode="rb") as pyproject:
            version = load(pyproject)["project"]["version"]
            environ["BACKEND_VERSION"] = version
    return escape(str(version))


if __name__ == "__main__":
    run(app="api:api", host="0.0.0.0", port=5556, reload=True)
