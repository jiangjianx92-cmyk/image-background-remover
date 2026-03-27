export async function onRequestGet({ env }) {
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'API is working',
    hasApiKey: !!env.REMOVE_BG_API_KEY 
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
