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
      <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1D1D1D",
        borderRadius: "10px",
        padding: "20px",
        color: "#ffffff",
        maxWidth: "600px",
        margin: "20px auto",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Left Section - Logo */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={tokenName}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
        )}
      </div>

      {/* Right Section - Name, Contract Address, and Socials */}
      <div
        style={{
          flex: 1,
          marginLeft: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Token Name */}
        <h1 style={{ margin: 0, fontSize: "24px" }}>
          {tokenName ? tokenName : "Loading..."}
        </h1>

        {/* Contract Address */}
        {contractAddress && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              fontSize: "14px",
              color: "#aaaaaa",
            }}
          >
            <p style={{ margin: 0 }}>
              Contract Address: {contractAddress.slice(0, 6)}...
              {contractAddress.slice(-4)}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(contractAddress)}
              style={{
                background: "none",
                border: "1px solid #aaaaaa",
                borderRadius: "4px",
                marginLeft: "10px",
                color: "#aaaaaa",
                cursor: "pointer",
                padding: "2px 6px",
                fontSize: "12px",
              }}
            >
              Copy
            </button>
          </div>
        )}

        {/* Social Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            gap: "10px",
          }}
        >
          {website && (
            <a
              href={website.startsWith("http") ? website : `http://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <FaGlobe size={20} color="#ffffff" />
            </a>
          )}
          {telegram && (
            <a
              href={
                telegram.startsWith("http") ? telegram : `https://${telegram}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <FaTelegramPlane size={20} color="#ffffff" />
            </a>
          )}
          {twitter && (
            <a
              href={twitter.startsWith("http") ? twitter : `https://${twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <FaTwitter size={20} color="#ffffff" />
            </a>
          )}
        </div>
      </div>
    </div>

      <div style={{ padding: "10px", textAlign: "center" }}>
        <form onSubmit={handleSearchSubmit}>
          <input
            className="input2"
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Enter token contract address"
            style={{
              width: "50%",
              background:"white",
              fontSize:"22px",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              marginRight: "10px",
            }}
          />
          <button
            type="submit"
            className="search-button"
          >
            Search
          </button>
        </form>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          margin: "0 auto",
          maxWidth: "1200px",
          padding: "20px",
        }}
      >
        {/* Left Section (GeckoTerminal Embed with Pool Address) */}
        <div style={{ flex: "0 0 70%", marginRight: "10px" }}>
          <div
            style={{
              position: "relative",
              height: "800px",
              minWidth: "300px",
            }}
          >
            {pool ? (
              <iframe
                title="GeckoTerminal"
                src={`https://www.geckoterminal.com/${chain}/pools/${pool}?embed=1&info=${
                  showInfo ? 1 : 0
                }&swaps=1`}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "80%",
                  top: 0,
                  left: 0,
                  border: "0",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
                allowFullScreen
              />
            ) : (
              <p style={{ textAlign: "center", color: "#ffffff" }}>
                Pool address not available for this token.
              </p>
            )}
          </div>
        </div>

        {/* Right Section (Swapper) */}
        <Swapper
          signer={signer}
          provider={provider}
          tokenAddress={contractAddress}
          chainId={chainId}
        />
      </div>

      <Footer />
    </div>
  );
}

export default Trading;
