
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const APP_URL = Deno.env.get('APP_URL')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

const getHtmlTemplate = (templateId: string, data: any, trackingId: string) => {
  const openTrackingPixel = `${APP_URL}/functions/v1/track?id=${trackingId}&type=open`;
  const unsubscribeLink = `${APP_URL}/functions/v1/unsubscribe?id=${data.userId}`;
  const ctaLink = `${APP_URL}/functions/v1/track?id=${trackingId}&type=click&url=${encodeURIComponent(APP_URL!)}`;

  const baseLayout = (content: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #0A0A0B; padding: 40px 20px; text-align: center; }
          .content { padding: 40px; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #999; }
          .button { display: inline-block; padding: 14px 28px; background: #EAB308; color: #0A0A0B; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
          .stat-box { background: #f9f9f9; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #EAB308; margin: 0; font-size: 24px; letter-spacing: 2px;">FOCUS ADVANTAGE</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>Focus Advantage HQ · 123 Deep Work Way · San Francisco, CA</p>
            <p><a href="${unsubscribeLink}" style="color: #999;">Unsubscribe</a> from these notifications.</p>
          </div>
        </div>
        <img src="${openTrackingPixel}" width="1" height="1" style="display:none !important;" />
      </body>
    </html>
  `;

  switch (templateId) {
    case 'reengagement_7d':
      return baseLayout(`
        <h2 style="margin-top: 0;">Your Focus Block is waiting for you 🎯</h2>
        <p>Hey there, it's been 7 days since your last deep work session. Your momentum is the most valuable asset you have.</p>
        <div class="stat-box">
          <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Current Streak</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #EAB308;">${data.streak || 0} Days</p>
        </div>
        <p>Don't let that streak go to waste. We've predicted today as a high-potential focus day for you.</p>
        <a href="${ctaLink}" class="button">Resume Your Mission</a>
      `);
    case 'reengagement_14d':
      return baseLayout(`
        <h2 style="margin-top: 0;">${data.circle_name} hasn't heard from you</h2>
        <p>Accountability is the secret weapon of elite performers. Your Circle misses your presence.</p>
        <div class="stat-box">
          <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Circle Activity</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${data.member_count || 0} members are locked in today.</p>
        </div>
        <p>A quick check-in takes 30 seconds but keeps your commitment alive. See what the group is working on.</p>
        <a href="${ctaLink}" class="button">Check In With Your Circle</a>
      `);
    case 'reengagement_21d':
      return baseLayout(`
        <h2 style="margin-top: 0;">Help us understand what happened</h2>
        <p>We noticed you haven't been using Focus Advantage lately. We're constantly trying to improve the experience for deep workers like you.</p>
        <p>Was the setup too complex? Not enough time? We'd love your honest feedback.</p>
        <div style="background: #EAB308; padding: 20px; border-radius: 8px; color: #0A0A0B; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">Special Offer:</p>
          <p style="margin: 5px 0 0 0;">Complete our 2-minute survey and get <strong>1 month of Master Tier free</strong>.</p>
        </div>
        <a href="${ctaLink}" class="button">Take the Survey</a>
      `);
    case 'reengagement_30d':
      return baseLayout(`
        <h2 style="margin-top: 0;">Your account will be archived in 30 days</h2>
        <p>It's been a month since your last login. To keep our systems efficient, we archive inactive accounts after 60 days.</p>
        <p style="color: #d93025; font-weight: bold;">Your focus data, streaks, and vault entries will be permanently deleted if no action is taken.</p>
        <p>Simply log back in to keep your account active and preserve your progress.</p>
        <a href="${ctaLink}" class="button">Reactivate My Account</a>
      `);
    default:
      return baseLayout(`<p>Welcome back to Focus Advantage!</p><a href="${ctaLink}" class="button">Open App</a>`);
  }
}

serve(async (req) => {
  try {
    // 1. Fetch pending emails from queue
    const { data: queueItems, error: queueError } = await supabase
      .from('email_queue')
      .select('*, users(email, id)')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(10)

    if (queueError) throw queueError
    if (!queueItems || queueItems.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending emails' }), { status: 200 })
    }

    const results = []

    for (const item of queueItems) {
      const trackingId = crypto.randomUUID()
      const html = getHtmlTemplate(item.template_id, { ...item.metadata, userId: item.users.id }, trackingId)
      
      // 2. Send via Resend
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Focus Advantage <reengagement@focusadvantage.app>',
          to: [item.users.email],
          subject: item.template_id === 'reengagement_7d' ? 'Your Focus Block is waiting for you 🎯' :
                   item.template_id === 'reengagement_14d' ? `[${item.metadata.circle_name}] hasn't heard from you` :
                   item.template_id === 'reengagement_21d' ? 'Help us understand what happened' :
                   'Your account will be archived in 30 days',
          html: html,
        }),
      })

      const resData = await res.json()

      if (res.ok) {
        // 3. Log success and update queue
        await supabase.from('email_logs').insert({
          user_id: item.users.id,
          template_id: item.template_id,
          status: 'sent',
          tracking_id: trackingId
        })
        await supabase.from('email_queue').update({ status: 'sent' }).eq('id', item.id)
        results.push({ id: item.id, status: 'success' })
      } else {
        // 4. Log failure
        await supabase.from('email_logs').insert({
          user_id: item.users.id,
          template_id: item.template_id,
          status: 'failed',
          error_message: JSON.stringify(resData)
        })
        results.push({ id: item.id, status: 'failed', error: resData })
      }
    }

    return new Response(JSON.stringify(results), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
