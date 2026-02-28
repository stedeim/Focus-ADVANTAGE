
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

serve(async (req) => {
  const url = new URL(req.url)
  const trackingId = url.searchParams.get('id')
  const type = url.searchParams.get('type') // 'open' or 'click'
  const redirectUrl = url.searchParams.get('url')

  if (!trackingId) {
    return new Response('Missing Tracking ID', { status: 400 })
  }

  try {
    if (type === 'open') {
      await supabase
        .from('email_logs')
        .update({ opened_at: new Date().toISOString() })
        .eq('tracking_id', trackingId)
        .is('opened_at', null) // Only track first open

      // Return 1x1 transparent pixel
      const pixel = Uint8Array.from([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 
        0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00, 
        0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 
        0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b
      ])
      return new Response(pixel, { headers: { 'Content-Type': 'image/gif' } })
    } 
    
    if (type === 'click') {
      await supabase
        .from('email_logs')
        .update({ clicked_at: new Date().toISOString() })
        .eq('tracking_id', trackingId)
        .is('clicked_at', null) // Only track first click

      return Response.redirect(redirectUrl || '/', 302)
    }

    return new Response('Invalid tracking type', { status: 400 })
  } catch (err) {
    console.error(err)
    return new Response('Tracking error', { status: 500 })
  }
})
