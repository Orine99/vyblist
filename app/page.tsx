'use client'

import {useState} from 'react'
import { useRouter } from 'next/navigation'
import '@/styles/home.css'

export default function Home(){
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')

  const router = useRouter()
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
  <main className="min-h-screen bg-[#818571] text-black flex flex-col">
      {/* Nav */}
      <nav className="vyblist-nav">
        <div className="vyblist-nav__logo">
          <div className="vyblist-nav__logo-icon">
            <span>V</span>
          </div>
          <span className="vyblist-nav__logo-text">Vyblist</span>
        </div>

        {/* Right side of nav */}
          <div className="vyblist-nav__actions">
            <button
              onClick={() => router.push('/events')}
              className="vyblist-btn vyblist-btn--ghost "
            >
              Browse Events
            </button>
             <button
              onClick={() => router.push('#waitlist')}
              className="vyblist-btn vyblist-btn--primary"
            >
              Join Waitlist
            </button>
          </div>
      </nav>
      {/* Hero */}
      <section className="vyblist-hero">
              {/*Glow blobs — decorative background light*/}

              <div className="vyblist-hero__glow-purple" />
              <div className="vyblist-hero__glow-gold" />
        

              <div className="vyblist-hero__content">
                  {/* Badge */}
                  <div className="vyblist-hero__badge">
                    <span className="vyblist-hero__badge-dot" />
                    <span >Built for Caribbean event culture</span>
                  </div>

                  {/* Headline */}
                  <h1 className="vyblist-hero__headline">
                    Event ticketing <br />
                    <span className="vyblist-hero__headline-gradient">
                      that matches the vibes
                    </span>
                  </h1>

                  {/* Sub */}
                  <p className="vyblist-hero__subtext">
                    No more Google Forms. No more searching guest lists by hand.
                    Vyblist gives promoters a smart RSVP system with QR check-in,
                    a Highlight Hub for event moments, and real-time guest management —
                    all from your phone.
                  </p>

                  {/* Form */}
                  <div id="waitlist" className="vyblist-hero__form-wrapper">
                      {status === 'success' ? (
                        <div className="vyblist-hero__success">
                            <p className="vyblist-hero__success-title">🎉 You're on the list!</p>
                            <p className="vyblist-hero__success-sub">We'll hit you up when we launch.</p>
                        </div>
                      ) : (
                  
                      <form onSubmit={handleSubmit} className="vyblist-hero__form">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={status === 'loading'}
                        className="vyblist-hero__input"
                      />
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="vyblist-btn vyblist-btn--primary"
                      >
                        {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                      </button>
                    </form>)}

                    {status === 'duplicate' && (
                      <p className="vyblist-hero__msg vyblist-hero__msg--warning">
                        You're already on the list! 👊
                      </p>
                    )}
                    {status === 'error' && (
                      <p className="vyblist-hero__msg vyblist-hero__msg--error">
                        Something went wrong. Try again in a sec.
                      </p>
                    )}

                    <p className="vyblist-hero__disclaimer">
                      No spam. Just a heads-up when we launch.
                    </p>
                  </div>
              </div>

      </section>

      {/*Stats bar*/}
      <section className="vyblist-stats">
        <div className="vyblist-stats__grid">
          <div className="vyblist-stats__item">
            <p className="vyblist-stats__value">100%</p>
            <p className="vyblist-stats__label">Free to Start</p>
          </div>

          <div className="vyblist-stats__divider" />

          <div className="vyblist-stats__item">
            <p className="vyblist-stats__value">QR</p>
            <p className="vyblist-stats__label">Instant check-in</p>
          </div>

          <div className="vyblist-stats__divider" />

          <div className="vyblist-stats__item">
            <p className="vyblist-stats__value vyblist-stats__value--live">Live</p>
            <p className="vyblist-stats__label">Real-time dashboard</p>
          </div>

        </div>

      </section>
      {/* How it works */}
      <section className="vyblist-how">
        <div className="vyblist-how__inner">

          <div className="vyblist-how__header">
            <p className="vyblist-how__label">How it works</p>
            <h2 className="vyblist-how__title">Three steps to a smooth event</h2>
          </div>

          <div className="vyblist-how__grid">

            <div className="vyblist-how__card">
              <span className="vyblist-how__step">01</span>
              <p className="vyblist-how__icon">🎪</p>
              <h3 className="vyblist-how__card-title">Create your event</h3>
              <p className="vyblist-how__card-desc">
                Set the name, date, venue, and capacity. Vyblist generates
                a shareable link instantly.
              </p>
            </div>

            <div className="vyblist-how__card">
              <span className="vyblist-how__step">02</span>
              <p className="vyblist-how__icon">🎟️</p>
              <h3 className="vyblist-how__card-title">Guests register</h3>
              <p className="vyblist-how__card-desc">
                Share the link. Guests fill in their name and email and get
                a QR ticket sent straight to their inbox.
              </p>
            </div>

            <div className="vyblist-how__card">
              <span className="vyblist-how__step">03</span>
              <p className="vyblist-how__icon">📱</p>
              <h3 className="vyblist-how__card-title">Scan at the door</h3>
              <p className="vyblist-how__card-desc">
                Use your phone to scan QR codes at the entrance. The
                dashboard updates live as guests check in.
              </p>
            </div>

          </div>

        </div>
      </section>
      {/* Features */}
      <section className="vyblist-features">
        <div className="vyblist-features__inner">

          <div className="vyblist-features__header">
            <p className="vyblist-features__label">Features</p>
            <h2 className="vyblist-features__title">Everything a promoter needs</h2>
          </div>

          <div className="vyblist-features__grid">

            <div className="vyblist-features__card">
              <span className="vyblist-features__icon">🎟️</span>
              <div>
                <h3 className="vyblist-features__card-title">QR Tickets</h3>
                <p className="vyblist-features__card-desc">Every guest gets a unique QR code sent to their email the moment they register.</p>
              </div>
            </div>

            <div className="vyblist-features__card">
              <span className="vyblist-features__icon">📊</span>
              <div>
                <h3 className="vyblist-features__card-title">Live Dashboard</h3>
                <p className="vyblist-features__card-desc">See registered vs checked-in counts in real time. Know exactly who's coming.</p>
              </div>
            </div>

            <div className="vyblist-features__card">
              <span className="vyblist-features__icon">📱</span>
              <div>
                <h3 className="vyblist-features__card-title">Phone Scanner</h3>
                <p className="vyblist-features__card-desc">No extra hardware. Scan QR codes with your phone camera right at the entrance.</p>
              </div>
            </div>

            <div className="vyblist-features__card">
              <span className="vyblist-features__icon">🔒</span>
              <div>
                <h3 className="vyblist-features__card-title">Capacity Control</h3>
                <p className="vyblist-features__card-desc">Set a cap. When it's full, it's full. No overbooking, no chaos.</p>
              </div>
            </div>

            <div className="vyblist-features__card">
              <span className="vyblist-features__icon">⚡</span>
              <div>
                <h3 className="vyblist-features__card-title">Instant Setup</h3>
                <p className="vyblist-features__card-desc">Create an event in under a minute. Share the link and you're done.</p>
              </div>
            </div>

            <div className="vyblist-features__card">
              <span className="vyblist-features__icon">🌴</span>
              <div>
                <h3 className="vyblist-features__card-title">Built for the Caribbean</h3>
                <p className="vyblist-features__card-desc">Designed with Caribbean event culture in mind — from beach parties to club nights.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    
      {/* Footer */}
      <footer className="vyblist-footer">
        <div className="vyblist-footer__inner">
                <p className="vyblist-footer__copy">© 2026 Vyblist. Built for the culture.

                </p>
        </div>
      </footer>
    </main>
  )

}