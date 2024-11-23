import React from "react";
import TokenListTable from "../components/TokenListTable.jsx";
import TokenList from "../components/TokenList.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "./TokenListPage.css"; // Import the CSS file for TokensPage

function TokensPage() {
  return (
    <div>
      <Header />
      <div className="token-list-desktop">
        <TokenListTable />
      </div>
      <div className="token-list-mobile">
        <TokenList />
      </div>
      <Footer />
    </div>
  );
}

export default TokensPage;
