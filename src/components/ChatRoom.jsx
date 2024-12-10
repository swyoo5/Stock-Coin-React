import React from "react";
import "../styles/ChatRoom.css";

const ChatRoom = ({
    selectedTicker,
    messages,
    currentUserNickname,
    newMessage,
    setNewMessage,
    sendMessage,
}) => (
    <div className="chat-room">
        <h3>{selectedTicker} 채팅방</h3>
        <div className="chat-box">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`chat-message ${
                        message.sender === currentUserNickname ? "right" : "left"
                    }`}
                >
                    <span className="chat-sender">{message.sender}</span>:{" "}
                    <span className="chat-content">{message.content}</span>
                </div>
            ))}
        </div>
        <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="chat-input"
        />
        <button onClick={sendMessage} className="chat-button">
            전송
        </button>
    </div>
);

export default ChatRoom;
