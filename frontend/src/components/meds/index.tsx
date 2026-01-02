import { useState, type ChangeEvent } from "react"

import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline"

const api_url = import.meta.env.VITE_API_URL || ""

export interface Med {
  medication: string
  strength: string
}

function setVisible(id: string, isVisibility = true) {
  document.getElementById(id)!.style.visibility = isVisibility
    ? "visible"
    : "hidden"
}

export function handleX(obj: string) {
  const rxName = document.getElementById("rxName") as HTMLInputElement
  if (obj === "rxName" && rxName.value) {
    rxName.value = ""
    ;(
      document.getElementById("txtStrength") as HTMLDivElement
    ).style.visibility = "hidden"
    rxName.focus()
  }
  const rxStrength = document.getElementById("rxStrength") as HTMLInputElement
  if (obj === "rxStrength" && rxStrength.value) {
    rxStrength.value = ""
    rxStrength.focus()
    setVisible("btnAdd", false)
  }
}

export function Meds({ id, className }: { id: string; className: string }) {
  const [name, setName] = useState("")
  const [strength, setStrength] = useState("")

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (
      e.target.id === "rxName" &&
      document.getElementById("rxStrength")!.dataset.state === "valid"
    ) {
      setName(e.target.value)
      setVisible("txtStrength")
    } else if (e.target.id === "rxStrength" && e.target.value.length > 0) {
      setStrength(e.target.value)
      setVisible("btnAdd")
    } else {
      setVisible("txtStrength", false)
      setVisible("btnAdd", false)
    }
  }

  async function handleClick() {
    try {
      await fetch(api_url + "/api/add", {
        method: "POST",
        signal: AbortSignal.timeout(3000),
        body: JSON.stringify({
          medication: name,
          strength: strength
        } as Med)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Status: ${response.status}`)
          }
          response.json()
        })
        .then((data) => {
          console.log(data)
        })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div id={id} className={className}>
        <div className="text-center mt-10">
          <input
            type="text"
            id="rxName"
            placeholder="Enter medication..."
            onBlur={handleChange}
            className="border-2 border-green-500 w-100 rounded-md text-white text-center"
          />{" "}
          &nbsp;
          <button
            type="button"
            onClick={() => handleX("rxName")}
            title="Clear medication"
            className="cursor-pointer">
            <TrashIcon className="size-6 text-red-500 inline align-bottom" />
          </button>
        </div>
        <div id="txtStrength" className="text-center mt-10 invisible">
          <input
            type="text"
            id="rxStrength"
            placeholder="Enter strength..."
            onBlur={handleChange}
            className="border-2 border-green-500 w-100 rounded-md text-white text-center"
          />{" "}
          &nbsp;
          <button
            type="button"
            onClick={() => handleX("rxStrength")}
            title="Clear strength"
            className="cursor-pointer">
            <TrashIcon className="size-6 text-red-500 inline align-bottom" />
          </button>
        </div>
        <div id="btnAdd" className="text-center mt-10 invisible">
          <button
            type="button"
            onClick={handleClick}
            title="Add medication and strength"
            className="cursor-pointer border-1 border-green-500 rounded-md text-white px-2 py-1 font-bold">
            <PlusCircleIcon className="size-6 inline text-green-500" /> Add
          </button>
        </div>
      </div>
    </>
  )
}
