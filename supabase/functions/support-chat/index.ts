import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Tactic9 Support Assistant — a friendly, concise helper for the Tactic9 strategy game.

About Tactic9:
- A browser-based strategy game played on a 9×9 grid
- Players connect 5 marks in a row (horizontal, vertical, or diagonal) to win
- Two modes: vs Friend (local 2-player) and vs Computer (AI with Easy/Medium/Hard)
- Features: sound effects, undo, move counter, win highlighting, game statistics
- Stats are stored in browser local storage (never sent to servers)
- No account or sign-up required — completely free, no ads
- Built with React, TypeScript, Tailwind CSS
- Works on all modern browsers and devices

Common support topics:
- How to play: Place marks on the 9×9 grid, connect 5 in a row to win. X goes first.
- Undo: Click the Undo button. In vs Computer mode, it undoes both your move and the AI's.
- Sound: Toggle the speaker icon (🔊/🔇) in the game header.
- Stats: Tracked separately for vs Friend and vs Computer. Reset via the Reset button on each stats card.
- Data loss: Stats are in browser local storage. Clearing browser data deletes them. No cloud backup.
- AI difficulty: Easy = mostly random, Medium = blocks & attacks, Hard = advanced minimax algorithm.
- Switching modes: Starts a new game. Stats are kept separately per mode.
- Bug reporting: Direct users to the Contact Us form on the same page.
- Privacy: No personal data collected. Only Contact Us form submissions are sent via email.

Rules:
- Keep answers SHORT (2-4 sentences max unless the user asks for detail).
- Be friendly and helpful. Use emoji sparingly.
- If you can't solve the issue, suggest the user fill out the Contact Us form on the same page for human follow-up.
- Only answer questions related to Tactic9. For unrelated questions, politely redirect.
- Never make up features that don't exist.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable. Please use the contact form instead." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try the contact form." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("support-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
