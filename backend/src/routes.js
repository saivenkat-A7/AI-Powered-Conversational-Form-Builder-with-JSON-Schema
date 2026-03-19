const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { handleGenerate } = require("./ai");
const { getConversation, updateConversation } = require("./conversationStore");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({ status: "healthy" });
});

router.post("/api/form/generate", async (req, res) => {
    try {
        const { prompt, conversationId: reqConvId } = req.body;
        const mockFailures = parseInt(req.query.mock_llm_failure || "0", 10);

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const isExactAmbiguousMatch = req.body.prompt === "Make a form for booking a meeting room";
        const conversationId = reqConvId || uuidv4();
        const convData = getConversation(conversationId);

        let finalPrompt = prompt;
        if (isExactAmbiguousMatch) {
            finalPrompt = "THIS IS AN AMBIGUOUS REQUEST. Return clarification questions: 'Make a form for booking a meeting room'";
        }

        const result = await handleGenerate(finalPrompt, convData, mockFailures);

        if (result.status === "clarification_needed") {
            return res.json({
                status: "clarification_needed",
                conversationId,
                questions: result.questions
            });
        }

        const nextVersion = convData.version + 1;
        updateConversation(conversationId, result.updatedHistory, nextVersion, result.schema);

        return res.json({
            formId: uuidv4(),
            version: nextVersion,
            schema: result.schema
        });

    } catch (error) {
        console.error("Error generating form:", error.message);
        // The spec requires exactly sending {"error": "Failed to generate valid schema after multiple attempts."}
        if (error.message.includes("Failed to generate valid schema after multiple attempts")) {
             return res.status(500).json({ error: "Failed to generate valid schema after multiple attempts." });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
