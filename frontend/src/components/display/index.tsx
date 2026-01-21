import { useEffect, useState } from "react"

import {
  ExclamationTriangleIcon,
  PlusCircleIcon,
  TrashIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"
import { confirmAlert } from "react-confirm-alert"

import { handleX } from "../../helpers/handle"
import type Med from "../../interfaces/Med"
import Login from "../login"
import Meds from "../meds"

import "./index.css"
import "react-confirm-alert/src/react-confirm-alert.css"

const api_url = import.meta.env.VITE_API_URL || ""

export default function Display() {
  const [medications, setMedications] = useState<Med[]>([])
  const [rxName, setRxName] = useState("")

  function toggleVisibility() {
    ;["btnAddMed", "btnCancelMed", "compMeds"].forEach((element) => {
      document.getElementById(element)!.classList.toggle("hidden")
    })
  }

  function handleClick() {
    toggleVisibility()
    handleX("rxName")
    handleX("rxStrength")
  }

  function handleDelete(pk: number) {
    if (pk === 0) {
      return
    }
    confirmAlert({
      title: "Delete medication?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            fetch(api_url + "/api/delete/" + pk, {
              method: "DELETE",
              signal: AbortSignal.timeout(3000)
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Status: ${response.status}`)
                }
                window.location.reload()
              })
              .catch((e) => {
                console.error(e)
              })
          }
        },
        {
          label: "No"
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      overlayClassName: "overlay"
    })
  }

  useEffect(() => {
    const name = localStorage.getItem("rxName") || ""
    setRxName(name)
    if (!name.length) {
      return
    }
    fetch(api_url + "/api/get/" + name, {
      method: "GET",
      signal: AbortSignal.timeout(3000)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`)
        }
        return response.json()
      })
      .then((meds: Med[]) => {
        setMedications(meds)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [])

  function logout() {
    localStorage.removeItem("rxName")
    setRxName("")
    window.location.reload()
  }

  return (
    <>
      {!rxName.length ? (
        <Login />
      ) : (
        <>
          <div className="absolute top-0 left-0 ml-1 mt-1 text-sm">
            <span className="text-green-500">User: </span>
            <span className="text-white">
              {rxName}
              <XCircleIcon
                className="ml-1 size-4 inline text-red-500 cursor-pointer"
                title="Logout"
                onClick={logout}
              />
            </span>
          </div>
          <div className="mx-auto w-200 mt-10">
            {!medications.length ? (
              <div className="text-center text-white font-bold text-2xl italic">
                <ExclamationTriangleIcon className="size-7 inline text-red-500" />{" "}
                No medications to show
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-2 border-2 border-green-500 text-white rounded-md font-bold p-2">
                {medications.map((medication: Med) => (
                  <>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(Number(medication.id))}
                        title="Delete medication"
                        className="cursor-pointer">
                        <TrashIcon className="size-6 text-red-500 inline align-bottom" />
                      </button>
                    </div>
                    <div className="text-left pl-2 col-span-6">
                      {medication.medication}
                    </div>
                    <div className="text-right pr-2 col-span-5">
                      {medication.strength}
                    </div>
                  </>
                ))}
              </div>
            )}
          </div>
          <div className="text-center mt-10">
            <button
              id="btnAddMed"
              type="button"
              onClick={handleClick}
              title="Add medication"
              className="cursor-pointer border-1 border-green-500 rounded-md text-white px-2 py-1 font-bold">
              <PlusCircleIcon className="size-6 inline text-green-500" /> Add
              Medication
            </button>
            <button
              id="btnCancelMed"
              type="button"
              onClick={handleClick}
              title="Cancel"
              className="cursor-pointer border-1 border-red-500 rounded-md text-white px-2 py-1 font-bold hidden">
              <XCircleIcon className="size-6 inline text-red-500" /> Cancel
            </button>
            <Meds className="hidden" />
          </div>
        </>
      )}
    </>
  )
}
