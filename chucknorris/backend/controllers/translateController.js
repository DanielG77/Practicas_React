// translateController.js - Updated version using native fetch
exports.translateText = async (req, res) => {
    try {
        const { text, sourceLang, targetLang } = req.body;

        if (!text || !sourceLang || !targetLang) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        // Use native fetch (no import needed)
        const response = await fetch('http://localhost:5000/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text'
            })
        });

        if (!response.ok) {
            throw new Error(`Translation service error: ${response.status}`);
        }

        const translationData = await response.json();
        res.json({
            originalText: text,
            translatedText: translationData.translatedText,
            sourceLanguage: sourceLang,
            targetLanguage: targetLang
        });

    } catch (error) {
        console.error('Error in translateText:', error);
        res.status(500).json({ error: 'Translation failed', message: error.message });
    }
};