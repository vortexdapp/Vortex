import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.jsx"; // Import your Supabase client
import Footer from "../components/Footer.jsx";
import "./Trading.css";
import Header from "../components/Header.jsx";
import Swapper from "../components/Swapper.jsx";
import { FaTelegramPlane, FaTwitter, FaGlobe } from "react-icons/fa";

function Trading() {
  const { chain: initialChain, contractAddress: initialContractAddress } =
    useParams();
  let chain = initialChain.toLowerCase();

  // Update chain if it is sepolia
  if (chain === "sepolia") {
    chain = "sepolia-testnet";
  }

  const [contractAddress, setContractAddress] = useState(
    initialContractAddress
  );
  const [pool, setPool] = useState(""); // New state for pool address
  const [searchValue, setSearchValue] = useState(initialContractAddress);
  const [tokenName, setTokenName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  // State for wallet connection
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    // Log the signer, provider, and chainId whenever they are updated
    if (signer || provider || chainId) {
      console.log("Signer:", signer);
      console.log("Provider:", provider);
      console.log("Chain ID:", chainId);
    }
  }, [signer, provider, chainId]);

  useEffect(() => {
    // Fetch token data (using Supabase)
    const fetchTokenData = async () => {
      try {
        const { data, error } = await supabase
          .from("tokens")
          .select("*")
          .eq("address", contractAddress);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const tokenData = data[0]; // Assuming you want the first match
          setTokenName(tokenData.name);
          setImageUrl(tokenData.imageUrl);
          setWebsite(tokenData.website);
          setTelegram(tokenData.telegram);
          setTwitter(tokenData.twitter);
          if (tokenData.pool) {
            setPool(tokenData.pool);
          } else {
            console.warn("No pool address found for this token.");
          }
        } else {
          console.warn("Token data not found.");
        }
      } catch (error) {
        console.error("Error fetching token data from Supabase:", error);
      }
    };

    fetchTokenData();
  }, [contractAddress]);

  const handleWalletConnect = async ({ signer, provider }) => {
    try {
      // Explicitly fetch the network details from the provider
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      console.log("Wallet connected:", { signer, provider, chainId });

      // Set states
      setSigner(signer);
      setProvider(provider);
      setChainId(chainId);
    } catch (error) {
      console.error("Error fetching chainId:", error);
      setChainId(null); // Reset if there's an error
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setContractAddress(searchValue);
    navigate(`/trading/${chain}/${searchValue}`);
  };

  return (
    <div>
      <Header
        onWalletConnect={({ signer, provider }) => {
          handleWalletConnect({ signer, provider });
        }}
      />

      {/* Search Container */}
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            className="input3"
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Enter token contract address"
            aria-label="Token Contract Address" // Accessibility improvement
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Column (Chart) */}
        <div className="chart-container">
          <div className="chart-inner-container">
            {pool ? (
              <iframe
                title="GeckoTerminal"
                src={`https://www.geckoterminal.com/${chain}/pools/${pool}?embed=1&info=${
                  showInfo ? 1 : 0
                }&swaps=1`}
                className="chart-iframe"
                allowFullScreen
              />
            ) : (
              <p style={{ textAlign: "center", color: "#ffffff" }}>
                Pool address not available for this token.
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Token Information */}
          <div className="token-container">
            {/* Left Section - Logo */}
            <div className="token-logo">
              {imageUrl && (
                <img src={imageUrl} alt={tokenName} className="token-image" />
              )}
            </div>

            {/* Right Section - Name, Contract Address, and Socials */}
            <div className="token-details">
              {/* Token Name */}
              <h1 className="token-name">
                {tokenName ? tokenName : "Loading..."}
              </h1>

              {/* Contract Address */}
              {contractAddress && (
                <>
                  <div className="contract-address-container">
                    <p className="contract-address">
                      CA: {contractAddress.slice(0, 6)}...
                      {contractAddress.slice(-4)}
                    </p>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(contractAddress)
                      }
                      className="copy-button"
                    >
                      Copy
                    </button>
                  </div>

                  {/* Token Market Info */}
                  <div className="token-market-info">
                    <div className="market-info" style={{ fontSize: 'smaller' }}>Market Cap: Volume: Price:</div>
                    
                  </div>
                </>
              )}

              {/* Social Links */}
              <div className="social-links">
                {website && (
                  <a
                    href={
                      website.startsWith("http") ? website : `http://${website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGlobe size={18} color="#ffffff" />
                  </a>
                )}
                {telegram && (
                  <a
                    href={
                      telegram.startsWith("http")
                        ? telegram
                        : `https://${telegram}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTelegramPlane size={18} color="#ffffff" />
                  </a>
                )}
                {twitter && (
                  <a
                    href={
                      twitter.startsWith("http") ? twitter : `https://${twitter}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter size={18} color="#ffffff" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Swapper */}
          <div className="swapper-container">
            <Swapper
              signer={signer}
              provider={provider}
              tokenAddress={contractAddress}
              chainId={chainId}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Trading;
