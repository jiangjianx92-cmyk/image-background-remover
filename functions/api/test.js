export async function onRequestGet() {
  return new Response('Hello from Functions!', {
    headers: { 'Content-Type': 'text/plain' },
  });
}
