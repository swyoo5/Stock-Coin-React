import React, {useState} from "react";

const modal = {
    modal: {
        display: "flex",
        position: "fixed",
        zIndex: "1",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContent : {
        backgroundColor : "#fff",
        padding : "20px",
        borderRadius : "8px",
        width : "80%",
        maxWidth : "800px",
        maxHeight : "80vh",
        overflowY : "auto",
        boxShadow : "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },

    close : {
        color : "red",
        float : "right",
        fontSize : "28px",
        fontWeight : "bold",
        cursor : "pointer",
    },

    closeHover: {
        color: "black",
        textDecoration: "none",
        float: "right",
        fontSize: "28px",
        fontWeight: "bold",
        cursor: "pointer",
    },
}

export const CloseButton = ({ onClose }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            style={{
                ...modal.close,
                ...(isHovered && { color: "black", textDecoration: "none" }), // hover 스타일 추가
            }}
            onClick={onClose}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            &times;
        </span>
    );
};

export default modal;