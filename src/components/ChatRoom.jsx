import React from "react";

const ChatRoom = ({
    selectedTicker,
    messages,
    currentUserNickname,
    newMessage,
    setNewMessage,
    sendMessage,
}) => {
    return (
        <div className="chat-container">
            <h3>({selectedTicker}) 채팅방</h3>
            <div className="chat-box">
                {messages
                    .filter((m) => m.ticker === selectedTicker)
                    .map((m, i) => (
                        <div
                            key={i}
                            className={`chat-message ${m.sender === currentUserNickname ? "right" : "left"}`}
                        >
                            <div className={`chat-bubble ${m.sender === currentUserNickname ? "right" : "left"}`}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span className="chat-sender">{m.sender}:</span>
                                    <span className="chat-content">{m.content}</span>
                                </div>
                                <div className="chat-time">{m.time}</div>
                            </div>
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
};

export default ChatRoom;
