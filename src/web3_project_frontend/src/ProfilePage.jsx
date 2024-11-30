import React, { useEffect, useState } from "react"

const ProfilePage = ({ identity }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (identity && identity.getPrincipal) {
          const principal = identity.getPrincipal().toText() // Mendapatkan Principal ID
          setUserInfo({
            principal,
            // Tambahkan data lain yang dibutuhkan, jika tersedia
          })
        } else {
          console.error("Identity is invalid or not available.")
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error)
      }
    }

    fetchUserInfo()
  }, [identity])

  if (!userInfo) {
    return <p>Loading...</p>
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <p>
        <strong>Principal ID:</strong> {userInfo.principal}
      </p>
      {/* Tambahkan informasi lain yang relevan */}
    </div>
  )
}

export default ProfilePage
