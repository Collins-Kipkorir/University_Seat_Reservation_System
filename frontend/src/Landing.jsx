import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CalendarCheck, Users, ChevronDown, ArrowRight } from 'lucide-react';
import { auth } from './api';

export default function Landing() {
  const navigate = useNavigate();
  const learnMoreRef = useRef(null);

  // Reset the global body styles imposed by Login.css / Signup.css so the
  // hero image spans edge-to-edge. Runs before paint; restores on unmount.
  useLayoutEffect(() => {
    const body = document.body;
    const prev = body.style.cssText;
    body.style.cssText = [
      'margin: 0',
      'padding: 0',
      'display: block',
      'width: 100%',
      'min-height: 100vh',
      'background-color: transparent',
      'overflow-x: hidden',
    ].join('; ');
    return () => { body.style.cssText = prev; };
  }, []);

  // If already logged in, skip the landing page
  useEffect(() => {
    auth.me().then((data) => {
      if (data.authenticated) navigate('/home');
    }).catch(() => {});
  }, [navigate]);

  const scrollToLearnMore = () => {
    learnMoreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', fontFamily: 'Arial, Helvetica, sans-serif', overflowX: 'hidden' }}>

      {/* ─── HERO SECTION ─── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          backgroundImage: 'url(/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {/* ─── NAVBAR ─── */}
        <nav
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 40px',
            background: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(6px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#2563eb',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MapPin size={20} color="#fff" />
            </div>
            <span style={{
              color: '#fff',
              fontSize: '1.15rem',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              University Seat Reservation
            </span>
          </div>

          {/* Sign In button */}
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1a3c6d',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textDecoration: 'none',
              letterSpacing: '0.02em',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#14305a'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a3c6d'}
          >
            Sign In <ArrowRight size={15} />
          </Link>
        </nav>

        {/* ─── HERO CONTENT ─── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(37,99,235,0.85)',
            color: '#bfdbfe',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: '800',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            backdropFilter: 'blur(4px)',
          }}>
            <CalendarCheck size={13} />
            Campus Booking Platform
          </div>

          {/* Title */}
          <h1 style={{
            color: '#ffffff',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: '900',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: '760px',
            marginBottom: '20px',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}>
            Reserve Your Spot.<br />
            <span style={{ color: '#93c5fd' }}>Any Time, Any Place.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'rgba(255,255,255,0.82)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '520px',
            lineHeight: 1.7,
            marginBottom: '40px',
            textShadow: '0 1px 8px rgba(0,0,0,0.3)',
          }}>
            Book a seat or table at the university campus in seconds.
            Browse available spots, choose your time, and confirm — all in one place.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#1a3c6d',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '1rem',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                boxShadow: '0 4px 20px rgba(26,60,109,0.45)',
                transition: 'transform 0.15s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#14305a'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#1a3c6d'; }}
            >
              Get Started <ArrowRight size={18} />
            </Link>

            <button
              onClick={scrollToLearnMore}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '1rem',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              Learn More <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Scroll indicator arrow */}
        <button
          onClick={scrollToLearnMore}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '999px',
            padding: '10px 14px',
            cursor: 'pointer',
            animation: 'bounce 2s infinite',
            backdropFilter: 'blur(4px)',
          }}
          aria-label="Scroll down"
        >
          <ChevronDown size={22} color="#fff" />
        </button>
      </div>

      {/* ─── LEARN MORE SECTION ─── */}
      <section
        ref={learnMoreRef}
        style={{
          background: '#f8fafc',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{
              display: 'inline-block',
              background: '#dbeafe',
              color: '#1d4ed8',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: '800',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}>
              How It Works
            </span>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: '900',
              color: '#0f172a',
              letterSpacing: '-0.025em',
              marginBottom: '14px',
            }}>
              Simple. Fast. Reliable.
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '1.05rem',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              The university seat reservation system lets students, staff, and guests
              book campus seating in three easy steps — no phone calls, no queues.
            </p>
          </div>

          {/* Steps cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '56px',
          }}>
            {[
              {
                icon: <Users size={28} color="#2563eb" />,
                step: '01',
                title: 'Create Your Account',
                desc: 'Sign up with your student or staff ID in under a minute. Guest access is also supported.',
              },
              {
                icon: <MapPin size={28} color="#2563eb" />,
                step: '02',
                title: 'Choose a Spot',
                desc: 'Browse the interactive seat map. Pick any available table in Shade A or B and see real-time availability.',
              },
              {
                icon: <CalendarCheck size={28} color="#2563eb" />,
                step: '03',
                title: 'Confirm & Go',
                desc: 'Set your group size and booking time. Your reservation is confirmed instantly — just show up.',
              },
            ].map((card) => (
              <div
                key={card.step}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Step number watermark */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '18px',
                  fontSize: '4rem',
                  fontWeight: '900',
                  color: '#f1f5f9',
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}>
                  {card.step}
                </span>

                <div style={{
                  background: '#eff6ff',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'inline-flex',
                  marginBottom: '18px',
                }}>
                  {card.icon}
                </div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  color: '#0f172a',
                  marginBottom: '10px',
                }}>
                  {card.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
            borderRadius: '24px',
            padding: '48px 32px',
            boxShadow: '0 8px 32px rgba(37,99,235,0.3)',
          }}>
            <h3 style={{
              color: '#fff',
              fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)',
              fontWeight: '900',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}>
              Ready to reserve your seat?
            </h3>
            <p style={{
              color: '#bfdbfe',
              fontSize: '1rem',
              marginBottom: '28px',
            }}>
              Join students and staff who book their spots every day.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/login"
                style={{
                  background: '#fff',
                  color: '#1a3c6d',
                  padding: '13px 30px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Sign In <ArrowRight size={16} />
              </Link>
              <Link
                to="/signup"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '13px 30px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 40px',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          {/* Left — copyright */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: '#2563eb',
              borderRadius: '7px',
              padding: '5px 7px',
              display: 'inline-flex',
            }}>
              <MapPin size={14} color="#fff" />
            </div>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
              © 2026 <span style={{ color: '#94a3b8', fontWeight: '600' }}>Sea Reservation System</span>
            </span>
          </div>

          {/* Right — nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[
              { label: 'Home',       action: 'top' },
              { label: 'Learn More', action: 'learn' },
              { label: 'Sign In',    action: 'login' },
            ].map(({ label, action }) => (
              action === 'login' ? (
                <Link
                  key={label}
                  to="/login"
                  style={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    transition: 'color 0.15s, background 0.15s',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {label}
                </Link>
              ) : (
                <button
                  key={label}
                  onClick={() => {
                    if (action === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
                    if (action === 'learn') learnMoreRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    color: '#94a3b8',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {label}
                </button>
              )
            ))}
          </nav>
        </div>
      </footer>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
