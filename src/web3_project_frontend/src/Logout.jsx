import React from "react"
import { useAuth } from "./AuthProvider"

export default function Logout() {
  const { login } = useAuth()
  return (
    <div>
      <center>
        <h1>Click Button Below to Login</h1>
        <button type="button" onClick={login}>
          Log in
        </button>
      </center>
    </div>
  )
}
