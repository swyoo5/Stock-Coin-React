import React from "react";

const chat = {
    chatContainer : {
        marginTop : "20px",
    },

    chatHeader : {
        fontSize : "1.5em",
        marginBottom : "10px",
    },

    chatBox : {
        border : "1px solid #ccc",
        height : "200px",
        overflowY : "auto",
        marginBottom : "10px",
        padding : "10px",
        display : "flex",
        flexDirection : "column",
    },

    chatMessage : {
        display : "flex",
        flexDirection : "column",
        alignItems : "flex-start",
        marginBottom : "10px",
    },

    chatBubble : {
        maxWidth : "60%",
        padding : "10px",
        borderRadius : "10px",
        boxShadow : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        wordWrap : "break-word",
        position : "realtive",
    },

    chatSender : {
        fontSize : "0.9em",
        fontWeight : "bold",
        color : "#555",
        marginRight : "5px",
    },

    chatContent: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        marginBottom: "10px",
        fontSize: "1em",
        color: "#333",
        wordBreak: "break-word",
    },

    chatTime : {
        fontSize : "0.75em",
        color : "#888",
        textAlign : "right",
        marginTop : "5px",
    },

    chatInput : {
        width : "80%",
        marginRight : "10px",
        padding : "8px",
        borderRadius : "4px",
        border : "1px solid #ccc",
    },

    chatButton : {
        padding : "8px 16px",
        backgroundColor : "#007bff",
        color : "#fff",
        border : "none",
        borderRadius : "4px",
        cursor : "pointer",
    },

    chatMessageRight : {
        alignItems : "flex-end",
    },

    chatBubbleRight : {
        maxWidth : "60%",
        padding : "10px",
        borderRadius : "10px",
        boxShadow : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        wordWrap : "break-word",
        position : "realtive",
        backgroundColor : "#d1f5d3",
    },

    chatBubbleLeft : {
        maxWidth : "60%",
        padding : "10px",
        borderRadius : "10px",
        boxShadow : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        wordWrap : "break-word",
        position : "realtive",
        backgroundColor : "#f1f1f1",
    },

    chatButtonHover : {
        backgroundColor : "#0056b3",
    },
}

export default chat;