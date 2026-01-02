#!.venv/bin/python

"""DB Service"""

from dataclasses import dataclass
from os import path

from peewee import AutoField, CharField, Model, SqliteDatabase
from pydantic import BaseModel

DB_FILE = "rx.db"

DEBUG = False


class Med(BaseModel):
    """Rx data model"""

    pk: int | None = None
    medication: str
    strength: str


class Rx(Model):
    """Rx DB model"""

    id = AutoField()
    medication = CharField(null=False)
    strength = CharField(null=False)

    @dataclass
    class Meta:
        """Metadata"""

        database = SqliteDatabase(
            DB_FILE,
            pragmas={"journal_mode": "wal"},
        )


def create():
    """Create tables"""
    if not path.exists(DB_FILE):
        if DEBUG:
            print("Creating database")
        Rx.create_table()


def add(med: Med):  # c
    """Add medication"""
    if DEBUG:
        print(f"Adding row: {med.medication}, {med.strength}")
    Rx.create(medication=med.medication, strength=med.strength)


def get():  # r
    """Get medication"""
    if DEBUG:
        print(f"Getting rows: {Rx.select().count(None)}")
    return list(Rx.select().dicts())


def update(med: Med):  # u
    """Update medication"""
    if DEBUG:
        print(f"Updating row: {med.pk}, {med.medication}, {med.strength}")
    Rx.update(medication=med.medication, strength=med.strength).where(
        Rx.id == med.pk
    ).execute()


def delete(pk: int):  # d
    """Delete medication"""
    if DEBUG:
        print(f"Deleting row: {pk}")
    Rx.delete_by_id(pk)


if __name__ == "__main__":
    raise NotImplementedError("Cannot be executed as a stand-alone script!")
