import React, { useEffect, useState } from "react";
import "./PromoBanner.css";

const PromoBanner = () => {
    const [visible, setVisible] = useState(true);
    const [animate, setAnimate] = useState(false);

    const handleClose = () => {
        setAnimate(true);
        setTimeout(() => setVisible(false), 300);
    };

    useEffect(() => {
        const timer = setTimeout(handleClose, 30000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div id="promo-banner" className={`promo-banner ${animate ? "promo-banner-hide" : ""}`}>
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
            <button onClick={handleClose} className="promo-banner-close" aria-label="Close">
                ✕
            </button>
        </div>
    );
};

export default PromoBanner;
