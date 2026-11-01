import {NextRequest,NextResponse} from 'next/server'
import {supabase} from '@/lib/supabase'
import {randomUUID} from 'crypto'
import {Resend} from 'resend'
import QRCode from 'qrcode'



const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest): Promise<NextResponse>{

        const {name, email, event_id} = await req.json()

        if(!name || !email || !event_id){
           return NextResponse.json({ error: 'All fields required' }, { status: 400 })
   
        }

        // Check capacity
        const { count: guestCount } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event_id)

        const { data: eventData } = await supabase
        .from('events')
        .select('capacity, name, date, venue')
        .eq('id', event_id)
        .single()

        if (eventData && guestCount !== null && guestCount >= eventData.capacity) {
        return NextResponse.json({ error: 'Event is full' }, { status: 410 })
        }

        // Generate unique QR token
        const qr_token = randomUUID()

        const { error } = await supabase
        .from('guests')
        .insert({ name, email: email.toLowerCase().trim(), event_id, qr_token })

        if(error){
                if(error.code === '23505'){
                  return NextResponse.json({ error: 'Already registered' }, { status: 409 })
  
                }
                return NextResponse.json({ error: error.message }, { status: 500 })

        }

        // Generate QR code as base64 image
        const qrDataUrl = await QRCode.toDataURL(qr_token,{
                width: 300,
                margin: 2,
                color: {dark: '#000000', light: '#ffffff' },
        })


        // Strip the prefix to get raw base64
        const qrBase64 = qrDataUrl.replace('data:image/png;base64,', '')

        // Send email
  await resend.emails.send({
    from: 'orinestephenson4@gmail.com',
    to: email,
    subject: `Your ticket for ${eventData?.name} 🎟️`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0f; color: white; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #a21caf); width: 40px; height: 40px; border-radius: 10px; line-height: 40px; font-weight: 900; font-size: 18px; color: white;">V</div>
          <span style="font-weight: 800; font-size: 20px; margin-left: 8px; vertical-align: middle;">Vyblist</span>
        </div>

        <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 8px;">You're on the list, ${name}! 🎉</h1>
        <p style="color: #9ca3af; margin-bottom: 32px;">Here's your QR ticket for the event below.</p>

        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 20px; font-weight: 800; margin: 0 0 8px;">${eventData?.name}</p>
          <p style="color: #9ca3af; margin: 4px 0;">📅 ${new Date(eventData?.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="color: #9ca3af; margin: 4px 0;">📍 ${eventData?.venue}</p>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 16px;">Show this QR code at the door</p>
          <img src="cid:qrcode" alt="QR Ticket" width="220" style="border-radius: 12px;" />
        </div>

        <p style="color: #6b7280; font-size: 12px; text-align: center;">Powered by Vyblist · Built for Caribbean event culture</p>
      </div>
    `,
    attachments: [
      {
        filename: 'ticket-qr.png',
        content: qrBase64,
        contentType: 'image/png',
        contentId: 'qrcode',
      },
    ],
  })

  return NextResponse.json({ success: true, qr_token }, { status: 200 })


}