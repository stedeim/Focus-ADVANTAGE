
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

serve(async (req) => {
  const url = new URL(req.url)
  const userId = url.searchParams.get('id')

  if (!userId) {
    return new Response('Missing User ID', { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ email_notifications_enabled: false })
      .eq('id', userId)

    if (error) throw error

    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0A0A0B; color: white; }
            .card { background: #151619; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); text-align: center; max-width: 400px; }
            h1 { color: #EAB308; }
            p { color: rgba(255,255,255,0.6); line-height: 1.6; }
            .btn { display: inline-block; margin-top: 20px; color: #EAB308; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Unsubscribed</h1>
            <p>You have been successfully unsubscribed from re-engagement emails. We're sorry to see you go, but we respect your focus.</p>
            <p>You can re-enable notifications anytime in your account settings.</p>
            <a href="/" class="btn">Return to Focus Advantage</a>
          </div>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } })
  } catch (err) {
    return new Response('Error processing unsubscribe request', { status: 500 })
  }
})
