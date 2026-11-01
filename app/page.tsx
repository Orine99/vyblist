'use client'

import {useState} from 'react'

export default function Home(){
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/waitlist', {
      method : 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({email}),
    })

   if(res.ok){
    setStatus('success')
    setEmail('')
   }else if (res.status === 409){
    setStatus('duplicate')
   }else{
    setStatus('error')
   }
    
  }
  return (
    <main className="min-h-screen bg-[#A28089] text-black flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <span className="text-white font-black text-sm">V</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Vyblist</span>
        </div>
        <span className="text-xs font-semibold text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1 rounded-full">
          Coming Soon
        </span>
      </nav>
      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-fuchsia-600/15 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300">Built for Caribbean event culture</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Event ticketing{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              that matches the vibes
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            No more Google Forms. No more searching guest lists by hand.
            Vyblist gives promoters a smart RSVP system with QR check-in,
            a Highlight Hub for event moments, and real-time guest management —
            all from your phone.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? 'Joining...' : status === 'success' ? '✓ You\'re in!' : 'Join Waitlist'}
            </button>
          </form>

          {/* Status messages */}
          {status === 'success' && (
            <p className="mt-4 text-green-400 text-sm font-medium">
              🎉 Welcome to the list! We&apos;ll hit you when we launch.
            </p>
          )}
          {status === 'duplicate' && (
            <p className="mt-4 text-yellow-400 text-sm font-medium">
              You&apos;re already on the list — we got you! 👊
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-400 text-sm font-medium">
              Something went wrong. Try again in a sec.
            </p>
          )}

          <p className="mt-5 text-gray-600 text-xs">
            No spam. Just a heads-up when we launch.
          </p>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-t border-white/5 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎟️',
              title: 'QR Ticket Check-in',
              desc: 'Guests get a unique QR code on registration. Scan with any phone — no hardware needed.',
            },
            {
              icon: '📸',
              title: 'Highlight Hub',
              desc: 'Promoters share a QR at the event. Guests upload photos and videos directly to the event gallery.',
            },
            {
              icon: '📊',
              title: 'Real-time Dashboard',
              desc: 'See who\'s checked in, capacity status, and guest counts — all live as people walk through the door.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:border-violet-500/30 transition"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-6 text-center">
        <p className="text-gray-600 text-xs">© 2026 Vyblist. Built for the culture.</p>
      </footer>
    </main>
  )

}