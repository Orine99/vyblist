import {NextRequest, NextResponse} from 'next/server'
import {supabase} from '@/lib/supabase'
import {randomUUID} from 'crypto'


export async function POST(req: NextRequest): Promise<NextResponse>{

    const {name, email, event_id} = await req.json()

    if(!name || !email ||!event_id){
            return NextResponse.json({ error: 'All fields required' }, { status: 400 })

    }

    // Check capacity
    const {count: guestCount} = await supabase
            .from('guests')
            .select('*' ,{count: 'exact' , head: true})
            .eq('event_id',event_id)
    
    const { data: eventData } = await supabase
            .from('events')
            .select('capacity')
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
        if (error.code === '23505') {
        return NextResponse.json({ error: 'Already registered' }, { status: 409 })
        }

        return NextResponse.json({ error: error.message }, { status: 500 })

    }

    return NextResponse.json({ success: true, qr_token }, { status: 200 })


}