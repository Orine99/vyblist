import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import slugify from 'slugify'


export async function POST(req: NextRequest): Promise<NextResponse>{
    const {name , date, venue, capacity } = await req.json()
    
    if(!name || !date || !venue || !capacity){
        return NextResponse.json({error: 'All fields required'}, {status: 400})
    }

    if (!/[a-zA-Z]/.test(name)) {
    return NextResponse.json({ error: 'Event name must contain at least one letter' }, { status: 400 })
    }

    // Create a unique slug from the event name + random suffix
    const base = slugify(name, { lower: true, strict: true })
    const suffix = Math.random().toString(36).slice(2, 7)
    const slug = `${base}-${suffix}`


    const {data, error} = await supabase
                .from('events')
                .insert({name,date,venue, capacity: parseInt(capacity), slug})
                .select()
                .single()
    if(error){
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ event: data }, { status: 200 })
}