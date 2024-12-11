import { useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export const useWebSocket = (url) => {
    const stompClientRef = useRef(null);

    useEffect(() => {
        const stompClient = Stomp.over(() => new SockJS(url));
        stompClient.connect({}, () => {
            stompClientRef.current = stompClient;
        });

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect();
            }
        };
    }, [url]);

    return stompClientRef;
};
