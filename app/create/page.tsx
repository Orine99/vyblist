'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

export default function CreateEvent(){
    const router = useRouter()
    
    const[form , setForm] = useState({
        name: '',
        date: '',
        venue: '',
        capacity: ''
    })

    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
     }

     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setError('')


        const res = await fetch('/api/events',{
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(form),

        })

        const data = await res.json()

        if(!res.ok){
            setError(data.error || 'Something went wrong')
            setStatus('error')
            return
        }

        // Redirect to the event page after creation
        router.push(`/events/${data.event.slug}`)

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

        {/* Form */}
        <section className="flex-1 flex flex-col items-center px-6 py-12">
            <div className="w-full max-w-lg">
            <h1 className="text-3xl font-black mb-2">Create an Event</h1>
            <p className="text-gray-400 mb-10">Fill in the details and share your event link.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Event Name
                </label>
                <input
                    name="name"
                    type="text"
                    placeholder="Summer Vibes 2026"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Date & Time
                </label>
                <input
                    name="date"
                    type="datetime-local"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition [color-scheme:dark]"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Venue
                </label>
                <input
                    name="venue"
                    type="text"
                    placeholder="Kingston, Jamaica"
                    value={form.venue}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Capacity
                </label>
                <input
                    name="capacity"
                    type="number"
                    placeholder="200"
                    min="1"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                />
                </div>

                {error && (
                <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                {status === 'loading' ? 'Creating...' : 'Create Event →'}
                </button>
            </form>
            </div>
        </section>
        </main>
    )
 
}