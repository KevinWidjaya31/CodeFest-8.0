import React, { useState, useEffect } from "react"
import { AuthClient } from "@dfinity/auth-client"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import "./App.css"
import Minting from "./Minting"
import Marketplace from "./Marketplace"
import ProfilePage from "./ProfilePage"

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [principal, setPrincipal] = useState(null)

  useEffect(() => {
    const initAuthClient = async () => {
      const authClient = await AuthClient.create()
      if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient)
      }
    }
    initAuthClient()
  }, [])

  const handleAuthenticated = async (authClient) => {
    try {
      const identity = authClient.getIdentity()
      if (identity) {
        const principalId = identity.getPrincipal().toText()
        setIsAuthenticated(true)
        setPrincipal(identity) // Simpan identity, bukan hanya principal ID
      } else {
        throw new Error("Identity not found.")
      }
    } catch (error) {
      console.error("Authentication failed:", error)
    }
  }

  const handleLogin = async () => {
    const authClient = await AuthClient.create()
    authClient.login({
      identityProvider: "https://identity.ic0.app/",
      onSuccess: () => handleAuthenticated(authClient),
      onError: (err) => console.error("Login failed:", err),
    })
  }

  const handleLogout = async () => {
    const authClient = await AuthClient.create()
    await authClient.logout()
    setIsAuthenticated(false)
    setPrincipal(null)
  }

  return (
    <BrowserRouter>
      <div>
        <Header
          isAuthenticated={isAuthenticated}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Minting" element={<Minting />} />
          <Route path="/Marketplace" element={<Marketplace />} />
          <Route
            path="/Profile"
            element={<ProfilePage identity={principal} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

const Header = ({ isAuthenticated, handleLogin, handleLogout }) => {
  const [menuActive, setMenuActive] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const navigate = useNavigate()

  const toggleMenu = () => {
    setMenuActive(!menuActive) // Toggle burger menu
  }

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible) // Toggle dropdown
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="header">
      <h1 onClick={() => navigate("/")}>MintVerse</h1>

      <span className="menu-icon" onClick={toggleMenu}>
        ☰
      </span>

      <div className={`nav-links ${menuActive ? "active" : ""}`}>
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection("about")
          }}>
          About
        </a>
        <a
          href="#featured-nft"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection("featured-nft")
          }}>
          Featured
        </a>
        <a
          href="#how-it-works"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection("how-it-works")
          }}>
          How-It-Works
        </a>
        <a
          href="#service"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection("service")
          }}>
          Service
        </a>
        {isAuthenticated ? (
          <div
            className="profile-menu"
            onMouseLeave={() => setDropdownVisible(false)}>
            <button className="profile-button" onClick={toggleDropdown}>
              <i className="fas fa-user-circle"></i> Profile
            </button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <a href="/Profile" className="dropdown-item">
                  <i className="fas fa-user"></i> Profile
                </a>
                <a href="#settings" class="dropdown-item">
                  <i class="fas fa-cog"></i> Settings
                </a>
                <a
                  href="#"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault() // Mencegah navigasi default pada <a>
                    handleLogout() // Panggil fungsi handleLogout
                  }}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </a>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </header>
  )
}

const HeroSection = () => {
  return (
    <section className="hero">
      <video autoPlay loop muted className="hero-video">
        <source
          src="NFT Logo Reveal Animation - After Effects Template.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-content">
        <h2>Welcome to Our Marketplace</h2>
        <p>
          Explore unique digital collectibles and the future of digital
          ownership.
        </p>
      </div>
    </section>
  )
}

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-image">
        <img src="astronaut.png" alt="About Us" />
      </div>
      <div className="about-content">
        <h2>About Us</h2>
        <p>
          Our NFT Marketplace is a revolutionary platform that allows users to
          buy, sell, and create unique digital assets securely and transparently
          on the blockchain. Join us in exploring the world of digital
          collectibles and be a part of the future of digital ownership.
        </p>
      </div>
    </section>
  )
}

const FeaturedNFT = () => {
  return (
    <section id="featured-nft" className="featured-nft-section">
      <h2>Featured NFTs</h2>
      <div className="nft-cards">
        <div className="nft-card">
          <div className="image-container">
            <img src="astronaut_bubble.png" alt="NFT 1" />
          </div>
          <div className="nft-info">
            <h3>Galactic Explorer</h3>
            <p>Explore the galaxy with this unique digital collectible.</p>
            <span className="price">0.8 ETH</span>
          </div>
        </div>
        <div className="nft-card">
          <div className="image-container">
            <img src="astronaut_bubble.png" alt="NFT 2" />
          </div>
          <div className="nft-info">
            <h3>Cosmic Wanderer</h3>
            <p>Own a piece of the cosmos with this rare NFT.</p>
            <span className="price">1.2 ETH</span>
          </div>
        </div>
        <div className="nft-card">
          <div className="image-container">
            <img src="astronaut_bubble.png" alt="NFT 3" />
          </div>
          <div className="nft-info">
            <h3>Stellar Navigator</h3>
            <p>Navigate the stars with this exclusive NFT artwork.</p>
            <span className="price">0.5 ETH</span>
          </div>
        </div>
      </div>
    </section>
  )
}

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="how-it-works-content">
        <h2>How It Works</h2>
        <p>
          Follow these simple steps to start buying, selling, and creating NFTs.
        </p>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>
              Sign up on our platform to start your NFT journey. Secure your
              account and customize your profile.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Explore & Buy NFTs</h3>
            <p>
              Browse the marketplace to find unique digital assets. Purchase
              NFTs using secure payment methods.
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Create & Sell NFTs</h3>
            <p>
              Upload your digital art, set a price, and sell it on our
              marketplace for others to buy and own.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const ServiceSection = () => {
  const navigate = useNavigate()

  const handleGoToMinting = () => {
    navigate("/Minting")
  }

  return (
    <section id="service" className="service-section">
      <h2>Our Services</h2>
      <div className="service-content">
        <p>
          From minting your first NFT to trading on our marketplace, we provide
          all the tools you need to dive into the world of NFTs. Get started
          today and experience the seamless process of creating and collecting
          digital assets.
        </p>

        <div className="card-container">
          <div className="card">
            <i
              className="fas fa-coins"
              style={{ fontSize: "3em", color: "#ffcc00" }}></i>
            <h3>Mint Your NFT</h3>
            <p>
              Create and mint your unique digital art, collectibles, and assets
              easily.
            </p>
          </div>
          <div className="card">
            <i
              className="fas fa-search"
              style={{ fontSize: "3em", color: "#007bff" }}></i>
            <h3>Explore Marketplace</h3>
            <p>
              Discover and collect NFTs from a variety of categories and
              creators.
            </p>
          </div>
          <div className="card">
            <i
              className="fas fa-shield-alt"
              style={{ fontSize: "3em", color: "#28a745" }}></i>
            <h3>Secure Trading</h3>
            <p>Trade NFTs securely with blockchain technology.</p>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button className="minting-button" onClick={handleGoToMinting}>
          Create Your Own NFTs
        </button>

        <button
          className="marketplace-button"
          onClick={() => {
            navigate("/Marketplace")
          }}>
          Go to Marketplace NFTs
        </button>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section: Footer Columns */}
      <div className="footer-columns">
        <div className="footer-column">
          <h4>Framer</h4>
          <ul>
            <li>
              <a href="#">Teams</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">Showcase</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Developers</a>
            </li>
            <li>
              <a href="#">Updates</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Platforms</h4>
          <ul>
            <li>
              <a href="#">Web</a>
            </li>
            <li>
              <a href="#">macOS</a>
            </li>
            <li>
              <a href="#">Windows</a>
            </li>
            <li>
              <a href="#">iOS</a>
            </li>
            <li>
              <a href="#">Android</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Learn</h4>
          <ul>
            <li>
              <a href="#">Tutorials</a>
            </li>
            <li>
              <a href="#">Examples</a>
            </li>
            <li>
              <a href="#">Templates</a>
            </li>
            <li>
              <a href="#">Sessions</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li>
              <a href="#">Components</a>
            </li>
            <li>
              <a href="#">Input Kit</a>
            </li>
            <li>
              <a href="#">State of Prototyping</a>
            </li>
            <li>
              <a href="#">Desktop Prototyping</a>
            </li>
            <li>
              <a href="#">Prototyping Tool</a>
            </li>
            <li>
              <a href="#">Wireframing Tool</a>
            </li>
            <li>
              <a href="#">UI/UX Design Tool</a>
            </li>
            <li>
              <a href="#">Graphic Design Tool</a>
            </li>
            <li>
              <a href="#">User Testing</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>About</h4>
          <ul>
            <li>
              <a href="#">Loupe</a>
            </li>
            <li>
              <a href="#">Community</a>
            </li>
            <li>
              <a href="#">Company</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Legal</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="#">Using Framer</a>
            </li>
            <li>
              <a href="#">Accounts</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section: Social Icons and Policy Links */}
      <div className="footer-bottom">
        <div className="social-icons">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <p>&copy; 2024 MintVerse. All Rights Reserved.</p>
        <div className="policy-links">
          <a href="#">Cookies</a>
          <a href="#">Security</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Statement</a>
        </div>
      </div>
    </footer>
  )
}

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedNFT />
      <HowItWorks />
      <ServiceSection />
      <Footer />
    </>
  )
}

export default App
