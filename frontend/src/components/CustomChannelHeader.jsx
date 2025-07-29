import React from 'react';
import { useChannelStateContext } from 'stream-chat-react';
import CallButton from './CallButton';

const CustomChannelHeader = ({ handleVideoCall }) => {
  const { channel } = useChannelStateContext();
  
  if (!channel) return null;

  // Get channel members
  const members = Object.values(channel.state.members || {});
  const memberCount = members.length;
  const onlineCount = members.filter(member => member.user?.online).length;

  // Get the other user's info (not the current user)
  const otherMember = members.find(member => member.user_id !== channel._client.userID);
  const displayName = otherMember?.user?.name || channel.data?.name || 'Chat';
  const avatar = otherMember?.user?.image;

  return (
    <div className="str-chat__channel-header">
      <div className="str-chat__channel-header-info">
        {avatar && (
          <img 
            src={avatar} 
            alt={displayName}
            className="w-8 h-8 rounded-full mr-3"
          />
        )}
        <div>
          <div className="str-chat__channel-header__title">
            {displayName}
          </div>
          <div className="str-chat__channel-header__subtitle">
            {memberCount} members, {onlineCount} online
          </div>
        </div>
      </div>
      
      {/* Video call button positioned in header */}
      <div className="flex items-center">
        <CallButton handleVideoCall={handleVideoCall} />
      </div>
    </div>
  );
};

export default CustomChannelHeader;
