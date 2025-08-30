import { HamsaVoiceAgent } from "@hamsa-ai/voice-agents-sdk";

/**
 * The agent ID used for the Hamsa arabic voice agent.
 * @constant {string}
 */
const ARABIC_AGENT_ID = import.meta.env.VITE_HAMSA_ARABIC_AGENT_ID || "";

/**
 * The agent ID used for the Hamsa english voice agent.
 * @constant {string}
 */
const ENGLISH_AGENT_ID = import.meta.env.VITE_HAMSA_ENGLISH_AGENT_ID || "";

/**
 * The API key used for the Hamsa voice agent.
 * @constant {string}
 */
const API_KEY = import.meta.env.VITE_HAMSA_API_KEY || "";

// Debug logging for environment variables
console.log("DEBUG - Environment Variables:");
console.log("ARABIC_AGENT_ID:", ARABIC_AGENT_ID ? "Set (masked for security)" : "Not set");
console.log("ENGLISH_AGENT_ID:", ENGLISH_AGENT_ID ? "Set (masked for security)" : "Not set");
console.log("API_KEY:", API_KEY ? "Set (masked for security)" : "Not set");
console.log("API_KEY length:", API_KEY ? API_KEY.length : 0);

if (!API_KEY) {
  console.warn("Warning: Hamsa API Key not found in environment variables. Voice functionality will work in demo mode.");
}

if (!ARABIC_AGENT_ID || !ENGLISH_AGENT_ID) {
  console.warn("Warning: One or both agent IDs are missing. Voice functionality will work in demo mode.");
}

/**
 * Instance of the Hamsa voice agent.
 * @constant {HamsaVoiceAgent}
 */
export const agent = API_KEY ? new HamsaVoiceAgent(API_KEY) : null;

// Track if the agent is currently active
let isAgentActive = false;
// Track current language
let currentLanguage: "ar" | "en" | null = null;

// TODO: WORK ON THE TYPE SAFETY OF THIS (take the types from the SDK)
interface HamsaVoiceAgentParams {
  agentId?: string;
  params?: object;
  voiceEnablement?: boolean;
  tools?: Array<{
    function_name: string;
    fn: (...args: unknown[]) => string;
    description: string;
    parameters: Array<{
      name: string;
      type: string;
      description: string;
    }>;
    required: string[];
  }>;
}

/**
 * Parameters used to initialize the Hamsa voice agent.
 * @constant {HamsaVoiceAgentParams}
 */
const agentParams: HamsaVoiceAgentParams = {
  voiceEnablement: true,
  tools: [], // Will be populated with navigation tools later
  params: {
    our_menu: `
  **Men's Apparel (ملابس رجالية)** (categoryId: mens)
  - T-Shirts (تي شيرت) (itemId: mens_tshirts) - Various colors and sizes
  - Jeans (جينز) (itemId: mens_jeans) - Blue, Black, Grey
  - Jackets (سترات) (itemId: mens_jackets) - Winter collection

  **Women's Apparel (ملابس نسائية)** (categoryId: womens)
  - Dresses (فساتين) (itemId: womens_dresses) - Elegant designs
  - Tops (بلوزات) (itemId: womens_tops) - Casual and formal
  - Skirts (تنانير) (itemId: womens_skirts) - Various lengths

  **Kids' Clothing (ملابس أطفال)** (categoryId: kids)
  - Boys' Shirts (قمصان أولاد) (itemId: boys_shirts) 
  - Girls' Dresses (فساتين بنات) (itemId: girls_dresses)
  - Kids' Pants (بناطيل أطفال) (itemId: kids_pants)

If the user asks about an item, navigate to the appropriate category.
`,
  },
};

/**
 * Custom hook to manage the state and functionality of the Hamsa voice agent.
 *
 * @returns {{
 *  startAgent: (language: "ar" | "en") => void;
 *  endAgent: () => void;
 *  refreshCache: () => void;
 *  isActive: () => boolean;
 * }}
 */
const useVoiceAgent = () => {
  /**
   * Starts the voice agent.
   * Logs an error message if the agent fails to start.
   */
  const startAgent = (language: "ar" | "en"): void => {
    try {
      // Check if we have the required credentials
      if (!API_KEY || !agent) {
        console.log("Voice agent running in demo mode - no API key provided");
        isAgentActive = true;
        currentLanguage = language;
        return;
      }

      // Ensure any existing agent is terminated before starting a new one
      if (isAgentActive) {
        agent.end();
        console.log("Ending previous agent before starting a new one");
      }
      
      // Store current language
      currentLanguage = language;
      
      console.log("Starting agent with language:", language);
      console.log("Using agent ID:", language === "ar" ? "ARABIC_AGENT_ID (masked)" : "ENGLISH_AGENT_ID (masked)");
      console.log("Current origin:", window.location.origin);
      
      // Debug log for agent parameters
      console.log("Agent params:", {
        ...agentParams,
        agentId: language === "ar" ? "ARABIC_AGENT_ID (masked)" : "ENGLISH_AGENT_ID (masked)",
      });
      
      agent.start({
        ...agentParams,
        agentId: language === "ar" ? ARABIC_AGENT_ID : ENGLISH_AGENT_ID,
      });
      
      // Setup event listeners for agent activity
      agent.on("callStarted", () => {
        console.log("Agent conversation started");
        isAgentActive = true;
      });
      
      agent.on("callEnded", () => {
        console.log("Agent conversation ended");
        isAgentActive = false;
      });
      
      agent.on("error", (error) => {
        console.error("Agent error:", error);
        // Safe error details logging
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : "No stack trace",
          name: error instanceof Error ? error.name : "Unknown error type"
        });
        isAgentActive = false;
      });
      
      agent.on("transcriptionReceived", (text) => {
        console.log("User speech transcription received", text);
      });
      
      agent.on("answerReceived", (text) => {
        console.log("Agent answer received", text);
      });
      
      console.log("Agent started successfully");
    } catch (error) {
      console.error("Failed to start agent:", error);
      // Safe error details logging
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
        name: error instanceof Error ? error.name : "Unknown error type"
      });
      isAgentActive = false;
    }
  };

  /**
   * Ends the voice agent conversation.
   * Logs an error message if the agent fails to end.
   */
  const endAgent = (): void => {
    try {
      if (isAgentActive) {
        if (agent) {
          agent.end();
        }
        isAgentActive = false;
        console.log("Agent ended successfully");
      } else {
        console.log("No active agent to end");
      }
      // Reset current language
      currentLanguage = null;
    } catch (error) {
      console.error("Failed to end agent:", error);
      // Safe error details logging
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
        name: error instanceof Error ? error.name : "Unknown error type"
      });
      isAgentActive = false;
      currentLanguage = null;
    }
  };
  
  /**
   * Refreshes the agent by ending and restarting it.
   * Useful for clearing cache or resetting the agent state.
   */
  const refreshCache = (): void => {
    try {
      console.log("Refreshing agent cache...");
      
      // Store the current language before ending
      const language = currentLanguage;
      
      // End the current agent
      if (isAgentActive) {
        if (agent) {
          agent.end();
        }
        isAgentActive = false;
        console.log("Agent ended for refresh");
      }
      
      // If we had a language active, restart with that language
      if (language) {
        console.log("Restarting agent with language:", language);
        setTimeout(() => {
          startAgent(language);
        }, 500); // Short delay to ensure clean restart
      } else {
        console.log("No active language to restart with");
      }
    } catch (error) {
      console.error("Failed to refresh agent cache:", error);
      // Safe error details logging
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
        name: error instanceof Error ? error.name : "Unknown error type"
      });
      isAgentActive = false;
    }
  };

  /**
   * Check if the agent is currently active
   */
  const isActive = (): boolean => {
    return isAgentActive;
  };

  return { startAgent, endAgent, refreshCache, isActive };
};

export default useVoiceAgent;
