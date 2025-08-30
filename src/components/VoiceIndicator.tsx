interface VoiceIndicatorProps {
  message: string;
}

export const VoiceIndicator = ({ message }: VoiceIndicatorProps) => {
  return (
    <div className="mb-8 text-center">
      <div className="inline-flex items-center bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border transition-colors">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
        <span className="text-sm text-muted-foreground">
          {message}
        </span>
      </div>
    </div>
  );
};
