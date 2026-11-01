'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEvent() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    date: '',
    venue: '',
    capacity: '',
    description: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      router.push(`/events/${data.event.slug}`)
    } else {
      setError(data.error || 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center px-6 py-5 max-w-3xl mx-auto w-full">
        <a href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5A623] to-[#7C3AED] rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black text-sm">V</span>
            </div>
          </div>
          <span className="font-black text-lg tracking-tight">Vyblist</span>
        </a>
      </nav>

      <section className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-lg">

          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2">Create an event</h1>
            <p className="text-gray-400">Fill in the details and we'll generate your registration link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Event Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Event Name</label>
              <input
                name="name"
                type="text"
                placeholder="Summer Beach Bash"
                value={form.name}
                onChange={handleChange}
                required
                pattern=".*[a-zA-Z].*"
                title="Event name must contain at least one letter"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5A623]/50 focus:ring-1 focus:ring-[#F5A623]/50 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
              <textarea
                name="description"
                placeholder="Tell guests what this event is about..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5A623]/50 focus:ring-1 focus:ring-[#F5A623]/50 transition resize-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Date & Time</label>
              <input
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5A623]/50 focus:ring-1 focus:ring-[#F5A623]/50 transition"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Venue</label>
              <input
                name="venue"
                type="text"
                placeholder="Kingston 5, Jamaica"
                value={form.venue}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5A623]/50 focus:ring-1 focus:ring-[#F5A623]/50 transition"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Capacity</label>
              <input
                name="capacity"
                type="number"
                placeholder="100"
                value={form.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#F5A623]/50 focus:ring-1 focus:ring-[#F5A623]/50 transition"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-[#F5A623] to-[#F97316] hover:opacity-90 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {status === 'loading' ? 'Creating...' : 'Create Event →'}
            </button>

          </form>
        </div>
      </section>
    </main>
  )
}