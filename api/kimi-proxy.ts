// Vercel Edge Function: Kimi K2.6 多模态代理
// 解决浏览器无法设置 User-Agent 的限制 — 转发请求 + 注入 UA 头让 Kimi For Coding 接受

export const config = { runtime: 'edge' }

const KIMI_ENDPOINT = 'https://api.kimi.com/coding/v1/chat/completions'

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // 优先用前端传的 Authorization，fallback 到环境变量
  const auth = req.headers.get('Authorization') || `Bearer ${process.env.KIMI_API_KEY || ''}`
  if (!auth.replace('Bearer ', '').trim()) {
    return new Response(JSON.stringify({ error: '未配置 Kimi key（前端未传 + 环境变量未设 KIMI_API_KEY）' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  const body = await req.text()

  const upstream = await fetch(KIMI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json',
      // 关键 — Kimi For Coding 限制只接受 coding agent 的 UA
      'User-Agent': 'claude-cli/0.0.1',
    },
    body,
  })

  const respBody = await upstream.text()
  return new Response(respBody, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
