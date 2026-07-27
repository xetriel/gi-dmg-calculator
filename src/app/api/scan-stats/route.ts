import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API_KEY_MISSING",
          message: "Gemini API key is not configured. Please add GEMINI_API_KEY=\"your_key_here\" to your .env file in the project root.",
        },
        { status: 400 }
      );
    }

    const { image } = await request.json();
    if (!image) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Missing image parameter" },
        { status: 400 }
      );
    }

    // Process base64 format
    let mimeType = "image/png";
    let base64Data = image;

    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      } else {
        return NextResponse.json(
          { error: "INVALID_IMAGE_FORMAT", message: "Failed to parse data URL image" },
          { status: 400 }
        );
      }
    }

    const promptText = `Analyze this Genshin Impact character details screen screenshot. Extract the character stats and level.
For primary stats (HP, ATK, DEF):
1. If the screenshot shows separate base (white number) and flat bonus (green number, e.g., '+6,485'), map the white number as base (hpBase, atkBase, defBase) and the green number as flat bonus (hpFlat, atkFlat, defFlat).
2. If the screenshot ONLY shows a single stat value for HP, ATK, or DEF (e.g., '33000' or 'Max HP: 33,000' with no green '+' bonus breakdown), map base (hpBase, atkBase, defBase) to "0" and put that single total stat value directly into flat bonus (hpFlat, atkFlat, defFlat).
Set all percentage bonuses (hpPercent, atkPercent, defPercent) to "0".
Extract other stats like Elemental Mastery (em), CRIT Rate (critRate), CRIT DMG (critDmg), Energy Recharge (energyRecharge), and the Element DMG Bonus or Physical DMG Bonus (dmgBonus) as clean decimal string values without units/percent signs (e.g., "60.0" instead of "60.0%").
Also extract the Character Level (levelChar) and the Character Name (characterName).`;

    const geminiPayload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            hpBase: { type: "STRING", description: "White base HP number if separate base/bonus values exist; otherwise \"0\"" },
            hpFlat: { type: "STRING", description: "Green flat additional HP number if separate values exist; otherwise the single HP stat number" },
            hpPercent: { type: "STRING", description: "Set to \"0\"" },
            atkBase: { type: "STRING", description: "White base ATK number if separate base/bonus values exist; otherwise \"0\"" },
            atkFlat: { type: "STRING", description: "Green flat additional ATK number if separate values exist; otherwise the single ATK stat number" },
            atkPercent: { type: "STRING", description: "Set to \"0\"" },
            defBase: { type: "STRING", description: "White base DEF number if separate base/bonus values exist; otherwise \"0\"" },
            defFlat: { type: "STRING", description: "Green flat additional DEF number if separate values exist; otherwise the single DEF stat number" },
            defPercent: { type: "STRING", description: "Set to \"0\"" },
            em: { type: "STRING", description: "Elemental Mastery number" },
            critRate: { type: "STRING", description: "CRIT Rate percentage number (no % sign)" },
            critDmg: { type: "STRING", description: "CRIT DMG percentage number (no % sign)" },
            energyRecharge: { type: "STRING", description: "Energy Recharge percentage number (no % sign)" },
            dmgBonus: { type: "STRING", description: "The active Element DMG Bonus percentage number or Physical DMG Bonus percentage number (no % sign)" },
            levelChar: { type: "STRING", description: "Character Level number" },
            characterName: { type: "STRING", description: "Character name (e.g., Mavuika)" },
          },
          required: [
            "hpBase", "hpFlat", "hpPercent",
            "atkBase", "atkFlat", "atkPercent",
            "defBase", "defFlat", "defPercent",
            "em", "critRate", "critDmg", "energyRecharge", "dmgBonus", "levelChar", "characterName"
          ],
        },
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API request failed:", errorText);
      return NextResponse.json(
        { error: "API_REQUEST_FAILED", message: `Gemini API request failed: ${response.statusText}` },
        { status: 502 }
      );
    }

    const result = await response.json();
    const outputText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!outputText) {
      return NextResponse.json(
        { error: "NO_OUTPUT", message: "Gemini API returned an empty response" },
        { status: 502 }
      );
    }

    // Since we used responseSchema, outputText is guaranteed to be a JSON string adhering to the schema
    const parsedData = JSON.parse(outputText.trim());

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Screenshot scan handler error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
