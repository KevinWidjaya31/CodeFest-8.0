import React, { useState, useEffect } from "react"
import axios from "axios"
import "./Marketplace.css"

const Marketplace = () => {
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNFTs = async () => {
      const url = "https://api.opensea.io/api/v2/collections"
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": "7bbf75c07b124074a2cda5e4b0fa909d",
        },
        params: { limit: "2" },
      }

      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        console.log(data)
      } catch (error) {
        console.error("Error fetching data:", error.message)
      }
    }

    fetchNFTs()
  }, [])

  // Menampilkan loading atau error jika ada
  if (loading) return <div>Loading NFTs...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="marketplace">
      <h1>Marketplace</h1>
      <div className="nft-cards">
        {nfts.map((nft) => (
          <div className="nft-card" key={nft.id}>
            <img
              src={nft.image_url || "default-image-url.jpg"} // Default jika tidak ada image
              alt={nft.name || "Unnamed NFT"}
              className="nft-image"
            />
            <div className="nft-details">
              <h3>{nft.name || "Unnamed NFT"}</h3>
              <p>{nft.description || "No description available"}</p>
              <div className="nft-price">
                <span>
                  Price:{" "}
                  {nft.last_sale?.total_price
                    ? `${nft.last_sale.total_price} ETH`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marketplace
