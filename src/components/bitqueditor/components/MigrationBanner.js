import React from "react";
import "./MigrationBanner.css";

const MigrationBanner = () => {
    const handleClose = () => {
        const banner = document.getElementById("migration-banner");
        banner.classList.add("migration-banner-hide");
        setTimeout(() => banner.remove(), 300);
    };

    return (
        <div id="migration-banner" className="migration-banner">
            <div
                className="migration-banner-content"
                onClick={() => window.open("https://community.bitquery.io/t/migration-announcement-ethereum-bsc-v1-to-v2/2227", "_blank")}
            >
                <p className="migration-banner-text">
                    Migration Announcement: Ethereum & BSC V1 users, please migrate to V2 APIs before February 28, 2025. <span className="migration-banner-link">Read More</span>
                </p>
            </div>
            <button
                onClick={handleClose}
                className="migration-banner-close"
                aria-label="Close"
            >
                ✕
            </button>
        </div>
    );
};

export default MigrationBanner;
