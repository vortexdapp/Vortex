import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Import the Supabase client
import { FaTwitter, FaTelegramPlane, FaGlobe } from "react-icons/fa"; // Correct icons
import "./TokenList.css";

function TokensList({ limit }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        // Fetch tokens from Supabase
        const { data: tokensArray, error } = await supabase
          .from("tokens")
          .select("*");

        if (error) {
          throw error;
        }

        // Map tokens and parse timestamp
        const tokensWithParsedData = tokensArray.map((token) => {
          return {
            ...token,
            timestamp: token.timestamp ? new Date(token.timestamp) : null,
          };
        });

        // Sort tokens by timestamp in descending order (most recent first)
        const sortedTokens = tokensWithParsedData.sort(
          (a, b) => b.timestamp - a.timestamp
        );

        setTokens(sortedTokens);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <p>Loading tokens...</p>
      </div>
    );
  if (!tokens.length) return <p>No tokens found.</p>;

  const displayedTokens = limit ? tokens.slice(0, limit) : tokens;

  return (
    <div className="tokens-container">
      <h3 className="deployedtokenstitle">Deployed Tokens</h3>
      <h5 className="subtitletokens">Trade them directly on Uniswap</h5>
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
              {token.imageUrl && (
                <img
                  src={token.imageUrl}
                  alt={token.name}
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
                {token.name ? token.name : "Loading..."}
              </h1>

              {/* Contract Address */}
              {token.address && (
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
                    Contract Address: {token.address.slice(0, 6)}...
                    {token.address.slice(-4)}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(token.address)}
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
                {token.website && (
                  <a
                    href={`https://${token.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <FaGlobe size={20} color="#ffffff" />
                  </a>
                )}
                {token.telegram && (
                  <a
                    href={`https://${token.telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <FaTelegramPlane size={20} color="#ffffff" />
                  </a>
                )}
                {token.twitter && (
                  <a
                    href={`https://${token.twitter}`}
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
        ))}
      </div>
    </div>
  );
}

export default TokensList;
