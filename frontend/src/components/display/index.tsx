import { useEffect, useState } from "react"

import {
  ExclamationTriangleIcon,
  PlusCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"

import { handleX, type Med, Meds } from "../meds"

const api_url = import.meta.env.VITE_API_URL || ""

export default function Display() {
  const [medications, setMedications] = useState<Med[]>([])

  function handleClick() {
    toggleVisibility()
    handleX("rxName")
    handleX("rxStrength")
  }

  function toggleVisibility() {
    ;["btnAddMed", "btnCancelMed", "compMeds"].forEach((element) => {
      document.getElementById(element)!.classList.toggle("hidden")
    })
  }

  useEffect(() => {
    fetch(api_url + "/api/get", {
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

  return (
    <>
      <div className="mx-auto w-100 mt-10">
        {!medications.length ? (
          <div className="text-center text-white font-bold text-2xl italic">
            <ExclamationTriangleIcon className="size-7 inline text-red-500" />{" "}
            No medications to show
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 border-2 border-green-500 text-white rounded-md font-bold">
            {medications.map((medication: Med) => (
              <>
                <div className="text-left pl-2">{medication.medication}</div>
                <div className="text-right pr-2">{medication.strength}</div>
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
        <Meds id="compMeds" className="hidden" />
      </div>
    </>
  )
}
