// Vercel Edge Function: Kimi K2.6 多模态代理（支持流式 SSE）
// 关键 — Kimi For Coding 限制只接受 coding agent 的 UA，浏览器无法设，故走代理转发

export const config = { runtime: 'edge' }

const KIMI_ENDPOINT = 'https://api.bochaai.com/v1/chat/completions'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const auth = req.headers.get('Authorization') || `Bearer ${process.env.KIMI_API_KEY || ''}`
  if (!auth.replace('Bearer ', '').trim()) {
    return new Response(JSON.stringify({ error: '未配置 Kimi key' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  const bodyText = await req.text()
  let isStream = false
  try {
    isStream = JSON.parse(bodyText).stream === true
  } catch { /* ignore */ }

  const upstream = await fetch(KIMI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      'User-Agent': 'claude-cli/0.0.1',
    },
    body: bodyText,
  })

  // 流式：直接 pipe upstream body 到 client
  if (isStream && upstream.body) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        ...CORS_HEADERS,
      },
    })
  }

  // 非流式：buffer 全文返回
  const respBody = await upstream.text()
  return new Response(respBody, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      ...CORS_HEADERS,
    },
  })
}
