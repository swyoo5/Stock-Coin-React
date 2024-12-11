import React from "react";
import chat from "../styles/chat";

function ChatRoom({
    selectedTicker,
    messages = [],
    currentUserNickname,
    newMessage,
    setNewMessage,
    sendMessage,
}) {
    return (
        <div className="chat-container" style={chat.chatContainer}>
            <h3 className="chat-header" style={chat.chatHeader}>({selectedTicker}) 채팅방</h3>

            <div className="chat-box" style={chat.chatBox}>
                {messages
                    .filter((m) => m.ticker === selectedTicker)
                    .map((m, i) => (
                        <div
                            key={i}
                            // className={`chat-message ${m.sender === currentUserNickname ? "right" : "left"}`}
                            style = {{...chat.chatMessage,
                                    ...(m.sender === currentUserNickname ? chat.chatMessageRight : {})
                            }}
                        >
                            <div 
                            // className={`chat-bubble ${m.sender === currentUserNickname ? "right" : "left"}`}
                                style = {{...chat.chatMessage,
                                        ...(m.sender === currentUserNickname 
                                            ? chat.chatBubbleRight
                                            : chat.chatBubbleLeft
                                        )
                                }}
                            >
                                <div style={chat.chatContent}>
                                    <span className="chat-sender" style={chat.chatSender}>{m.sender}:</span>
                                    <span className="chat-content">{m.content}</span>
                                </div>
                                <div className="chat-time" style={chat.chatTime}>{m.time}</div>
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
                style = {chat.chatInput}
            />
            <button onClick={sendMessage} 
                    className="chat-button"
                    style = {chat.chatButton}>
                전송
            </button>
        </div>
    );
}

export default ChatRoom;
