import { VideoIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

function CallButton({ handleVideoCall }) {
  const { theme } = useThemeStore();
  
  return (
    <button 
      onClick={handleVideoCall} 
      className="w-30 h-8 bg-primary hover:bg-primary/80 text-primary-content rounded-full flex items-center justify-center transition-all duration-200 shadow-md ml-2"
      title="Start Video Call"
    >
      <VideoIcon className="w-4 h-4 mr-2"/> Video Call
    </button>
  );
}

export default CallButton;