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
            <p className="promo-banner-text">
                Visit{" "}
                <a
                    href="https://dexrabbit.com/"
                    target="_blank"
                    rel="noopener noreferrer"

                >
                    <span className='promo-banner-dex'>DEX</span>
                    <span  className="promo-banner-link" >Rabbit</span>
                </a>
            </p>
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
