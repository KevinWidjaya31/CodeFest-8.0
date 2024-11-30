import React, { useState } from "react"
import { useAuth } from "./AuthProvider"

export default function Home() {
  const [result, setResult] = useState("")

  const { callFunction, logout } = useAuth()

  const handleClick = async () => {
    const id = await callFunction.idprincipal()

    setResult(id)
  }

  return (
    <div>
      <center>
        <h1>Welcome Page</h1>
        <button type="button" onclick={handleClick}>
          Show Id?
        </button>

        <h2>This is your Principal: {result}</h2>

        <button id="logout" onclick={logout}>
          log out
        </button>
      </center>
    </div>
  )
}
