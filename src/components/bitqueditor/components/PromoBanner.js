import React, { useEffect, useState, useCallback } from "react";
import "./PromoBanner.css";

const promotions = [
    {
        id: "kafka",
        icon: "bi bi-activity", 
        link: "https://docs.bitquery.io/docs/streams/kafka-streaming-concepts/",
        content: (
            <p className="promo-banner-text">
                Get real-time blockchain data with our <span className="promo-banner-link">Kafka Streams</span>. Learn more.
            </p>
        ),
    },
    {
        id: "dexrabbit",
        image: "/dexRabbitLogo.png",
        alt: "DEXrabbit logo",
        link: "https://dexrabbit.com/",
        content: (
            <p className="promo-banner-text">
                Smarter trading on all blockchains with{" "}
                <span className="promo-banner-dex">DEX</span>
                <span className="promo-banner-link">Rabbit</span>.
            </p>
        ),
    },
];

const PromoBanner = () => {
    const [visible, setVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClose = useCallback(() => {
        setIsFadingOut(true);
        setTimeout(() => setVisible(false), 300); 
    }, []);

    useEffect(() => {
        // Timer to rotate promotions every minute
        const rotateInterval = setInterval(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % promotions.length);
                setIsFadingOut(false);
            }, 300); // Time for fade out before content swap
        }, 10000); // 10 seconds

        // Timer to hide the banner completely after 5 minutes
        const masterTimeout = setTimeout(handleClose, 300000); // 5 minutes

        return () => {
            clearInterval(rotateInterval);
            clearTimeout(masterTimeout);
        };
    }, [handleClose]);

    if (!visible) return null;

    const promo = promotions[currentIndex];

    return (
        <div
            id="promo-banner"
            className={`promo-banner promo-banner-${promo.id} ${isFadingOut ? "promo-banner-hide" : ""}`}
        >
            {promo.image && (
                <img
                    src={promo.image}
                    alt={promo.alt}
                    className="promo-banner-logo"
                />
            )}
            {promo.icon && <i className={`${promo.icon} promo-banner-icon`} />}
            <div
                className="promo-banner-content"
                onClick={() => window.open(promo.link, "_blank")}
            >
                {promo.content}
            </div>
            <button onClick={handleClose} className="promo-banner-close" aria-label="Close">
                ✕
            </button>
        </div>
    );
};

export default PromoBanner;
