import React from "react";
import "./PromoBanner.css";

const PromoBanner = () => {
    const handleClose = () => {
        const banner = document.getElementById("promo-banner");
        banner.classList.add("promo-banner-hide");
        setTimeout(() => banner.remove(), 300);
    };

    return (
        <div id="promo-banner" className="promo-banner">
            <img
                src="/dexRabbitLogo.png"
                alt="DEXrabbit logo"
                className="promo-banner-logo"
            />
            <div
                className="promo-banner-content"
                onClick={() => window.open("https://dexrabbit.com/", "_blank")}
            >
                <p className="promo-banner-text">
                    Smarter trading on all blockchains with{" "}
                    <span className="promo-banner-dex">DEX</span>
                    <span className="promo-banner-link">Rabbit</span>.
                </p>
            </div>
            <button
                onClick={handleClose}
                className="promo-banner-close"
                aria-label="Close"
            >
                ✕
            </button>
        </div>
    );
};

export default PromoBanner;
