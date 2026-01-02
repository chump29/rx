#!.venv/bin/python

"""API Service"""

from os import environ, getenv
from tomllib import load

from fastapi import FastAPI
from uvicorn import run

from db import add as c, create, delete as d, get as r, Med, update as u


api = FastAPI()

create()


@api.post("/api/add")
def add(med: Med):
    """Add medication"""
    c(med)


@api.get("/api/get")
def get():
    """Get medication"""
    return r()


@api.put("/api/update")
def update(med: Med):
    """Update medication"""
    u(med)


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
    return version


if __name__ == "__main__":
    run(app="api:api", host="0.0.0.0", port=5556, reload=True)
