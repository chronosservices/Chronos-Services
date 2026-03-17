// netlify/functions/groq-proxy.js
// Proxy sécurisé Netlify — utilisé par le formulaire de création CV
// et le formulaire de mise à jour CV. Une seule clé GROQ_API_KEY suffit.

exports.handler = async function(event, context) {

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body);

    // Vérification minimale : le payload doit contenir un modèle et des messages
    if (!payload.model || !payload.messages) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Payload invalide : model et messages requis.' })
      };
    }

    // Appel à l'API Groq — même clé pour les deux formulaires
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: corsHeaders(),
        body: JSON.stringify({ error: data.error || 'Groq API error' })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message })
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}