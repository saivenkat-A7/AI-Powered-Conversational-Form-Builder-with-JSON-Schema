const { GoogleGenerativeAI } = require("@google/generative-ai");
const Ajv = require("ajv");

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY || "dummy_key_for_now");
const ajv = new Ajv();

const SYSTEM_PROMPT = `You are an AI Form Builder Expert. Your goal is to help users generate highly complex JSON Schema (Draft 7) forms. 
You will output JSON ONLY. Your JSON must validate against one of the following two structures.

Structure 1: Form Generation (When the user request is clear and you construct a form)
{
  "type": "form",
  "schema": {
    "type": "object",
    "title": "Form Name",
    "required": ["field1"],
    "properties": {
      "field1": { "type": "string", "title": "Field Label", "description": "Helper text" }
    }
  }
}

Structure 2: Clarification Needed (When the user request is ambiguous)
{
  "type": "clarification",
  "questions": [
    "Could you specify what fields you want?",
    "Should this form include contact information?"
  ]
}

Important Rules:
1. Use standard Draft 7 JSON Schema.
2. For visibility logic, use custom 'x-show-when': { "field": "otherField", "equals": value }.
3. Return ONLY the JSON object. No markdown wrappers.`;

async function generateFormFromLLM(prompt, previousSchema, history, retryError = null) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: { responseMimeType: "application/json" },
        systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] }
    });

    // Formatting history for gemini
    const formattedHistory = history.map(h => ({
        role: h.role, // 'user' or 'model'
        parts: [{ text: h.text }]
    }));

    const chat = model.startChat({ history: formattedHistory });

    let currentPrompt = prompt;
    if (previousSchema) {
        currentPrompt = `Please update the previous schema based on this new request: "${prompt}". Previous Schema: ${JSON.stringify(previousSchema)}`;
    }
    if (retryError) {
        currentPrompt += `\n\nYour previous attempt failed validation with this error: '${retryError}'. Please correct your response to generate a valid schema.`;
    }

    const result = await chat.sendMessage(currentPrompt);
    let responseText = result.response.text();
    
    // Safety fallback to clean up potential markdown
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        const parsed = JSON.parse(responseText);
        
        // Save the raw text to history to maintain exact conversation state
        const newHistory = [...history, { role: "user", text: currentPrompt }, { role: "model", text: responseText }];
        return { parsed, nextHistory: newHistory };
    } catch (e) {
        throw new Error("Failed to parse JSON from LLM: " + e.message + " | Response: " + responseText);
    }
}

async function handleGenerate(prompt, conversationData, mockFailures = 0) {
    let retryCount = 0;
    let lastError = null;

    if (mockFailures > 0) {
        let failuresEncountered = 0;
        // Fast-forward failures to simulate retries
        while (failuresEncountered < mockFailures && retryCount < 2) {
            failuresEncountered++;
            retryCount++;
            lastError = "Simulated validation failure";
        }
        if (failuresEncountered >= 3) {
            throw new Error("Failed to generate valid schema after multiple attempts.");
        }
    }

    while (retryCount <= 2) { 
        try {
            const { parsed, nextHistory } = await generateFormFromLLM(
                prompt, 
                conversationData.schema, 
                conversationData.history, 
                lastError
            );

            if (parsed.type === "clarification") {
                return {
                    status: "clarification_needed",
                    questions: parsed.questions,
                    updatedHistory: nextHistory
                };
            }

            if (parsed.type === "form" && parsed.schema) {
                // Ensure it's a valid JSON schema draft 7
                const isValid = ajv.validateSchema(parsed.schema);
                if (!isValid) {
                    const errorMsg = ajv.errorsText(ajv.errors);
                    throw new Error("Schema validation failed: " + errorMsg);
                }

                return {
                    status: "success",
                    schema: parsed.schema,
                    updatedHistory: nextHistory
                };
            }

            throw new Error("Invalid response form LLM.");
        } catch (error) {
            console.error("Attempt failed:", error);
            lastError = error.message;
            retryCount++;
            if (retryCount > 2) {
                throw new Error("Failed to generate valid schema after multiple attempts.");
            }
        }
    }
}

module.exports = {
    handleGenerate
};
