'use client'

export const dynamic = 'force-dynamic'

import {useState , useEffect} from 'react'
import { useParams } from 'next/navigation'
import {supabase} from '@/lib/supabase'


type Event = {
  id: string
  name: string
  date: string
  venue: string
    capacity: number
  slug: string
}

export default function EventPage(){
    const {slug}  = useParams()
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)


    const[form, setForm] = useState({name: '', email: ''})
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'full' | 'error'>('idle')

 useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setEvent(data)
      }
      setLoading(false)
    }

    fetchEvent()
  }, [slug])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault()
    if(!event) return
    setStatus('loading')

    const res = await fetch('/api/guests',{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({...form, event_id: event.id}),
    })

    if(res.ok){
        setStatus('success')
        setForm({name: '', email: ''})
    }else if (res.status === 409){
        setStatus('duplicate')
    }else if(res.status === 410){
        setStatus('full')
    }else{
        setStatus('error')
    }
  }


  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }


  if (notFound) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center text-center px-6">
        <div>
          <p className="text-5xl mb-4">🎪</p>
          <h1 className="text-2xl font-black mb-2">Event not found</h1>
          <p className="text-gray-400">This link may be invalid or the event was removed.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center px-6 py-5 max-w-3xl mx-auto w-full">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <span className="text-white font-black text-sm">V</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Vyblist</span>
        </a>
      </nav>

      <section className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-lg">

          {/* Event details */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-4">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-semibold text-violet-400">Registration Open</span>
            </div>
            <h1 className="text-3xl font-black mb-4">{event?.name}</h1>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📅 {formatDate(event?.date || '')}</p>
              <p>📍 {event?.venue}</p>
              <p>👥 {event?.capacity} capacity</p>
            </div>
          </div>

          {/* Registration form */}
          {status === 'success' ? (
            <div className="text-center bg-green-500/10 border border-green-500/20 rounded-2xl p-8">
              <p className="text-4xl mb-4">🎟️</p>
              <h2 className="text-xl font-black mb-2">You&apos;re on the list!</h2>
              <p className="text-gray-400 text-sm">Check your email — your QR ticket is on its way.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold mb-6">Register for this event</h2>
              {/*name*/}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={handleChange}
                  required
                  pattern="[a-zA-Z\s]+"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                />
              </div>

               {/*email*/}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="jane@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                />
              </div>

              {status === 'duplicate' && (
                <p className="text-yellow-400 text-sm">You&apos;re already registered for this event! 👊</p>
              )}
              {status === 'full' && (
                <p className="text-red-400 text-sm">Sorry, this event is at full capacity.</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm">Something went wrong. Try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                {status === 'loading' ? 'Registering...' : 'Register Now →'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )


}