import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import CustomChannelHeader from "../components/CustomChannelHeader";
import CustomMessageInput from "../components/CustomMessageInput";
import { useThemeStore } from "../store/useThemeStore";

// Import the CSS file
import "../styles/chat.css";
import "stream-chat-react/dist/css/v2/index.css";


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageListRef = useRef(null);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        //
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  // Auto-scroll function
  const scrollToBottom = () => {
    setTimeout(() => {
      const messageContainer = document.querySelector('.str-chat__message-list');
      const virtualList = document.querySelector('.str-chat__virtual-message-list');
      const scrollContainer = document.querySelector('.str-chat__message-list-scroll');
      
      const container = messageContainer || virtualList || scrollContainer;
      
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Add auto-scroll listeners
  useEffect(() => {
    if (!channel) return;

    const handleNewMessage = (event) => {
      // Auto-scroll for new messages
      scrollToBottom();
    };

    const handleMessageSent = (event) => {
      // Auto-scroll when user sends a message
      scrollToBottom();
    };

    // Listen for new messages
    channel.on('message.new', handleNewMessage);
    
    // Listen for message updates (including sent messages)
    channel.on('message.updated', handleMessageSent);

    return () => {
      channel.off('message.new', handleNewMessage);
      channel.off('message.updated', handleMessageSent);
    };
  }, [channel]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  // Initial scroll to bottom when chat loads
  useEffect(() => {
    if (channel && !loading) {
      scrollToBottom();
    }
  }, [channel, loading]);

  if (loading || !chatClient || !channel) return <ChatLoader />;

  // Custom attachment actions - only show File option
  const customAttachmentActions = [
    {
      id: 'file',
      name: 'File',
      icon: '📎',
    }
  ];


  return (
    <div className="h-[calc(100vh-80px)] w-full max-w-full overflow-hidden bg-base-100 ">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full h-full max-w-full flex flex-col relative overflow-hidden">
            <Window>
              <CustomChannelHeader handleVideoCall={handleVideoCall} />
              <MessageList />
              <CustomMessageInput 
                focus 
                channel={channel}
              />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;