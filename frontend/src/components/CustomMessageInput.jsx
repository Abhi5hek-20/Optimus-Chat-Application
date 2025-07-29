import React, { useRef } from 'react';
import { MessageInput } from 'stream-chat-react';
import { PaperclipIcon } from 'lucide-react';

const CustomMessageInput = (props) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && props.channel) {
      files.forEach(file => {
        props.channel.sendMessage({
          text: `📎 ${file.name}`,
          attachments: [{
            type: 'file',
            asset_url: URL.createObjectURL(file),
            title: file.name,
            file_size: file.size,
            mime_type: file.type
          }]
        });
      });
    }
  };

  return (
    <div className="relative">
      <MessageInput {...props} />
      
          {/* Custom file upload button positioned inside the input area */}
      <button
        onClick={handleFileUpload}
        className="absolute top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors z-20 bg-transparent"
        type="button"
        title="Upload file"
        style={{ 
          left: '20px',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '14px',
          marginLeft: '10px',
        }}
      >
        <PaperclipIcon className="w-5 h-5 text-gray-600" />
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="*/*"
      />
    </div>
  );
};

export default CustomMessageInput;
