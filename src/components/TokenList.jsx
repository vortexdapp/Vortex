import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FaTwitter, FaTelegramPlane, FaGlobe } from "react-icons/fa";
import axios from "axios";
import "./TokenList.css";

function TokensList({ limit }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedChain, setSelectedChain] = useState("all");
  

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { data: tokensArray, error } = await supabase
          .from("tokens")
          .select("*");

        if (error) throw error;

        const tokensWithParsedData = tokensArray.map((token) => ({
          ...token,
          timestamp: token.timestamp ? new Date(token.timestamp) : null,
          marketData: null,
        }));

        const sortedTokens = tokensWithParsedData.sort(
          (a, b) => b.timestamp - a.timestamp
        );

        const tokensWithMarketData = await Promise.all(
          sortedTokens.map(async (token) => {
            try {
              const response = await axios.get(
                `https://api.coingecko.com/api/v3/coins/sepolia-testnet/contract/${token.address}`
              );
              const marketData = response.data.market_data;
              return {
                ...token,
                marketData: {
                  price: marketData.current_price.usd,
                  marketCap: marketData.market_cap.usd,
                  volume24h: marketData.total_volume.usd,
                },
              };
            } catch (error) {
              console.error(
                `Error fetching market data for token ${token.address}:`,
                error
              );
              return token;
            }
          })
        );

        setTokens(tokensWithMarketData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const sortTokens = (order) => {
    const sorted = [...tokens].sort((a, b) => {
      if (order === "newest") return b.timestamp - a.timestamp;
      return a.timestamp - b.timestamp;
    });
    setSortOrder(order);
    setTokens(sorted);
  };

  const filterByChain = (chain) => {
    setSelectedChain(chain);
  };

  if (loading)
    return (
      <div className="loading-container">
    <p className="loading-message">Loading tokens...</p>
</div>);

  if (!tokens.length) return <p>No tokens found.</p>;

  const filteredTokens =
    selectedChain === "all"
      ? tokens
      : tokens.filter(
          (token) =>
            token.chain &&
            token.chain.toLowerCase() === selectedChain.toLowerCase()
        );

  const displayedTokens = limit ? filteredTokens.slice(0, limit) : filteredTokens;

  return (
    <div className="tokens-container">
      <h3 className="titlelaunch">Deployed Tokens</h3>
      <h5 className="subtitlefactory">Choose a token and start trading</h5>
      
      {/* Filter and Sort Buttons */}
    
      <div className="button-container2">
    <button className="custom-button"
        onClick={() => sortTokens(sortOrder === "newest" ? "oldest" : "newest")}
    >
        Sort by {sortOrder === "newest" ? "Oldest" : "Newest"}
    </button>
    <select className="custom-select"
        onChange={(e) => filterByChain(e.target.value)}
        value={selectedChain}
    >
        <option value="all" className="all-chains-button">All Chains</option>
        <option value="Sepolia">Sepolia</option>
        <option value="Base">Base</option>
        <option value="BSC">BSC</option>
        <option value="OP">OP</option>
        <option value="Arbitrum">Arbitrum</option>
    </select>
</div>
      {/* Token Cards */}
      <div className="tokens-grid">
        {displayedTokens.map((token) => (
          <div
            key={token.address}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#1D1D1D",
              borderRadius: "10px",
              padding: "10px",
              color: "#ffffff",
              maxWidth: "600px",
              margin: "10px auto",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {token.imageUrl && (
                <img
                  src={token.imageUrl}
                  alt={token.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    marginBottom: "0px",
                  }}
                />
              )}
            </div>
            <div
  style={{
    flex: 1,
    padding:"10px",
    marginLeft: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>
  <h1 className="token-title" style={{ margin: 0, fontSize: "18 px" }}>
    {token.name ? token.name : "Loading..."}
  </h1>
  {token.marketData ? (
    <div style={{ marginTop: "0px" }}>
      <p style={{ margin: 0, fontSize: "16px", color: "#ffffff" }}>
        Price: ${token.marketData.price.toLocaleString()}
      </p>
      <p style={{ margin: 0, fontSize: "16px", color: "#ffffff" }}>
        Market Cap: ${token.marketData.marketCap.toLocaleString()}
      </p>
      <p style={{ margin: 0, fontSize: "16px", color: "#ffffff" }}>
        24h Volume: ${token.marketData.volume24h.toLocaleString()}
      </p>
    </div>
  ) : (
    {/* <p style={{ marginTop: "0px", color: "#aaaaaa" }}>
      Loading market data...
    </p> */}
  )}

 {/* Contract Address with Copy Button */}
<div
  style={{
    display: "flex", // Aligns elements in a row
    alignItems: "center", // Vertically aligns items
    marginTop: "0px",
    gap: "10px", // Space between the address and the button
  }}
>
  <p style={{ margin: 0, fontSize: "14px", color: "#ffffff" }}>
    CA: {token.address.slice(0, 6)}...{token.address.slice(-4)}
  </p>
  <button
    onClick={() => navigator.clipboard.writeText(token.address)}
    style={{
      background: "none",
      border: "1px solid gray", // Smooth gray border
      borderRadius: "5px", // Rounded edges for smooth look
      color: "#ffffff",
      cursor: "pointer",
      fontSize: "14px",
      textDecoration: "none", // Removed underline for a cleaner button
      padding: "5px 10px", // Added padding for better clickability
      transition: "background-color 0.3s, border-color 0.3s", // Smooth transition for hover effect
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = "#333"; // Slightly darker background on hover
      e.target.style.borderColor = "#ffffff"; // White border on hover
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = "none"; // Reset background
      e.target.style.borderColor = "gray"; // Reset border
    }}
    onMouseDown={(e) => {
      e.target.style.backgroundColor = "#555"; // Darker background when clicked
    }}
    onMouseUp={(e) => {
      e.target.style.backgroundColor = "#333"; // Return to hover background
    }}
  >
    Copy
  </button>
</div>


  {/* Chain */}
  <p style={{ marginTop: "2px", fontSize: "14px", color: "#ffffff" }}>
    Chain: {token.chain || "N/A"}
  </p>

  {/* Social Links */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginTop: "0px",
      gap: "5px",
    }}
  >
    {token.website && (
      <a
        href={`https://${token.website}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGlobe size={16} color="#ffffff" />
      </a>
    )}
    {token.telegram && (
      <a
        href={`https://${token.telegram}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTelegramPlane size={16} color="#ffffff" />
      </a>
    )}
    {token.twitter && (
      <a
        href={`https://${token.twitter}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter size={16} color="#ffffff" />
      </a>
    )}
  </div>

  {/* Trade Button */}
  <button
    onClick={() =>
      (window.location.href = `/trading/${token.chain}/${token.address}`)
    }
    style={{
      backgroundColor: "#EF10FFE1",
      color: "#ffffff",
      border: "none",
      padding: "8px 20px",
      fontSize: "16px",
      borderRadius: "10px",
      cursor: "pointer",
      marginTop: "0px",
      transition: "background-color 0.3s",
    }}
  >
    Trade
  </button>
</div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default TokensList;
