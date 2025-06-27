import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ShimmerLoader = ({ rows = 6, columns = 4 }) => {
    return (
        <div style={{ padding: "16px", background: "#f5f5f5", borderRadius: "8px" }}>
            {[...Array(rows)].map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    style={{
                        display: "flex",
                        gap: "16px",
                        marginBottom: "16px",
                    }}
                >
                    {[...Array(columns)].map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            height={24}
                            width="100%"
                            style={{
                                flex: 1,
                                borderRadius: "6px",
                                minWidth: 0,
                            }}
                            baseColor="#e0e0e0"
                            highlightColor="#f0f0f0"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ShimmerLoader;