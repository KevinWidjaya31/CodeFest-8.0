import React, { useState, useEffect } from "react"
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../declarations/web3_project_backend"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons" // Ikon tebal
import { useDropzone } from "react-dropzone"
import { useNavigate } from "react-router-dom" // Import useNavigate
import "./Minting.css"

// Membuat instance HttpAgent
const agent = new HttpAgent()
if (process.env.DFX_NETWORK !== "ic") {
  agent.fetchRootKey()
}

// Inisialisasi aktor untuk berkomunikasi dengan canister
const nftMinting = Actor.createActor(idlFactory, {
  agent,
  canisterId: "bd3sg-teaaa-aaaaa-qaaba-cai",
})

const Minting = () => {
  const navigate = useNavigate() // Initialize navigate
  const [nfts, setNFTs] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [supply, setSupply] = useState(1)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const fetchNFTs = async () => {
    try {
      const result = await nftMinting.getNFTs()
      setNFTs(result)
    } catch (error) {
      console.error("Error fetching NFTs:", error)
    }
  }

  useEffect(() => {
    fetchNFTs()
  }, [])

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0])
      setPreviewUrl(URL.createObjectURL(acceptedFiles[0]))
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  })

  const handleMint = async (e) => {
    e.preventDefault()
    if (name && file && supply > 0) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const imageData = reader.result // Base64 image data
        try {
          const newId = await nftMinting.mintNFT(
            name,
            description,
            supply,
            imageData
          )
          console.log("Minted NFT with ID:", newId)
          setName("")
          setDescription("")
          setSupply(1)
          setFile(null)
          setPreviewUrl(null)
          fetchNFTs()
        } catch (err) {
          console.error("Error minting NFT:", err)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteNFT = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this NFT?"
    )
    if (!confirmDelete) return
    try {
      const success = await nftMinting.deleteNFT(id)
      if (success) {
        console.log("NFT deleted successfully:", id)
        fetchNFTs()
      } else {
        console.error("Failed to delete NFT with ID:", id)
      }
    } catch (error) {
      console.error("Error deleting NFT:", error)
    }
  }

  return (
    <div>
      {/* Tombol Back */}
      <button className="btn-back-circle" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>

      <div className="minting-container">
        <h1>Create an NFT</h1>
        <p>
          Once your item is minted you will not be able to change any of its
          information.
        </p>
        <form className="minting-form" onSubmit={handleMint}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name your NFT"
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="supply">Supply *</label>
            <input
              type="number"
              id="supply"
              value={supply}
              onChange={(e) => setSupply(parseInt(e.target.value, 10))}
              placeholder="1"
              min="1"
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description"
              className="textarea-field"></textarea>
          </div>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Drag and drop an image here, or click to select one</p>
          </div>
          {previewUrl && (
            <div className="preview-section">
              <p>NFT Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="preview-image"
                onError={(e) => {
                  e.target.onerror = null
                }}
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </div>

      <div className="nft-list">
        <h2>Your Minted NFTs:</h2>
        <ul className="nft-cards">
          {nfts.map((nft) => (
            <li key={nft.id} className="nft-card">
              <img
                src={nft.imageData}
                alt={nft.name}
                className="nft-image"
                onError={(e) => {
                  e.target.onerror = null
                }}
              />
              <div className="nft-details">
                <p className="nft-name">{nft.name}</p>
                <p className="nft-description">
                  {nft.description || "No description available"}
                </p>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteNFT(nft.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Minting
