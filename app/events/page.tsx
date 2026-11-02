'use client'

import {useState , useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {supabase} from '@/lib/supabase'

type Event =  {
    id: string
    name: string
    date: string
    venue: string
    capacity: number
    slug: string
    description: string
}


export default function EventPage(){
    const router = useRouter()
    const [event, setEvent] = useState<Event[]>([])
    const [search, setSearch]= useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
    const fetchEvents = async () => {
        const {data,error}  = await supabase
        .from('events')
        .select('*')
        .order('date', {ascending: true})

        if(!error && data) setEvent(data)
        setLoading(false)
    }

    fetchEvents()
    },[])

    const filtered = event.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase())
    )

    const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

    const isPast = (dateStr: string) => new Date(dateStr) < new Date()

    return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5A623] to-[#7C3AED] rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black text-lg">V</span>
            </div>
          </div>
          <span className="font-black text-xl tracking-tight">Vyblist</span>
        </div>
        <button
          onClick={() => router.push('/create')}
          className="text-sm font-bold bg-gradient-to-r from-[#F5A623] to-[#F97316] text-black px-5 py-2.5 rounded-xl hover:opacity-90 transition"
        >
          + Create Event
        </button>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">Upcoming Events</h1>
          <p className="text-gray-400">Find and register for events near you</p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search by event name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5A623]/50 focus:ring-1 focus:ring-[#F5A623]/50 transition"
          />
        </div>

        {/* Events grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎪</p>
            <p className="text-gray-400">No events found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((event) => (
              <button
                key={event.id}
                onClick={() => router.push(`/events/${event.slug}`)}
                className="text-left bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:border-[#F5A623]/30 hover:bg-white/[0.05] transition group"
              >
                {/* Status badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isPast(event.date)
                      ? 'bg-gray-500/10 text-gray-500'
                      : 'bg-[#F5A623]/10 text-[#F5A623]'
                  }`}>
                    {isPast(event.date) ? 'Past' : 'Upcoming'}
                  </span>
                </div>

                {/* Event name */}
                <h3 className="text-lg font-black mb-3 group-hover:text-[#F5A623] transition">
                  {event.name}
                </h3>

                {/* Description preview */}
                {event.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-1.5 text-sm text-gray-400">
                  <p>📅 {formatDate(event.date)}</p>
                  <p>📍 {event.venue}</p>
                  <p>👥 {event.capacity} spots</p>
                </div>

                {/* CTA */}
                <div className="mt-5 text-sm font-semibold text-[#F5A623] opacity-0 group-hover:opacity-100 transition">
                  View & Register →
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  )

}