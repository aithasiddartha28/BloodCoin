// ============================================================
// BloodCoin — Netlify Serverless Function
// File: netlify/functions/verify-certificate.js
//
// This acts as a proxy between the browser and Anthropic API.
// Browser cannot call api.anthropic.com directly (CORS block).
// This function runs on Netlify's server — no CORS issue.
// ============================================================

exports.handler = async function(event, context) {

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { base64Data, mimeType, donationInfo } = body;

    if (!base64Data || !mimeType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing image data' })
      };
    }

    // ── PROMPT FOR CLAUDE AI ──
    const prompt = `You are a blood donation certificate verification system for BloodCoin app in India.

Carefully analyze this uploaded image/document and determine if it is a genuine blood donation certificate or slip.

Check for these elements:
1. Donor name present
2. Blood type mentioned
3. Hospital/blood bank name
4. Date of donation
5. Official stamp or signature
6. Any certificate/receipt number

Donation info provided by user:
- Hospital: ${donationInfo?.hospital || 'Not provided'}
- Date: ${donationInfo?.date || 'Not provided'}
- Type: ${donationInfo?.type || 'Not provided'}

Respond ONLY in this exact JSON format (no other text):
{
  "verified": true or false,
  "confidence": "high" or "medium" or "low",
  "reason": "Brief explanation in 1-2 sentences",
  "donorName": "name found in certificate or null",
  "hospitalFound": "hospital name found or null",
  "dateFound": "date found or null",
  "bloodTypeFound": "blood type found or null"
}

If the image is blurry, not a certificate, a random photo, or fake — set verified: false.
If it clearly shows a blood donation certificate/receipt — set verified: true.`;

    // ── CALL ANTHROPIC API (server-side, no CORS issue) ──
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':            'application/json',
        'x-api-key':               process.env.ANTHROPIC_API_KEY, // set in Netlify env vars
        'anthropic-version':       '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            {
              type:   'image',
              source: {
                type:       'base64',
                media_type: mimeType,
                data:       base64Data
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'AI service error', details: errText })
      };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';

    // Parse AI response
    let result;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      result = JSON.parse(clean);
    } catch(e) {
      result = { verified: false, reason: 'Could not analyze certificate', confidence: 'low' };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type':                 'application/json'
      },
      body: JSON.stringify(result)
    };

  } catch(err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
