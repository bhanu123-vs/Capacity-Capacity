export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  topic?: string;
}

export interface AskDoubtOptions {
  messages: { role: 'user' | 'assistant'; content: string }[];
  currentTopic?: string;
  mode?: 'Intuitive & Practical' | 'Deep Atmospheric Science' | 'MCQ & Exam Prep';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export async function askGeminiDoubt(options: AskDoubtOptions): Promise<{ text: string; modelUsed?: string; fallback?: boolean }> {
  try {
    const response = await fetch('/api/ai/doubt-solver', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text,
      modelUsed: data.modelUsed,
      fallback: data.fallback,
    };
  } catch (error: any) {
    console.warn("API request failed, using local domain intelligent answer generator:", error);
    return {
      text: "I am currently running in local offline mode. Here is the core meteorological insight: Atmospheric motion is governed by Navier-Stokes momentum equations, thermodynamic energy conservation, and continuity. In operational forecasting, check radar reflectivity (dBZ) along with INSAT-3D water vapor imagery for upper-level dynamics.",
      fallback: true
    };
  }
}
