import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Heading, Text, LazyImage } from "../components/ui";
import { EventCard } from '../components/events'
import { GroupCard } from '../components/groups'
import '../styles/dashboard.css'
import '../styles/chat.css'
import { PageWrapper, MainContent } from "../components/layout";
import useEvents from '../hooks/useEvents'
import { request } from '../services/api'
import { useAuthContext } from '../context/AuthContext'

const sampleEvents = [
  { id: 'e1', title: 'Campus Study Group', date: new Date().toISOString(), location: 'The Union', description: 'Quick study meet to prep for exams.', thumbnail: '/block.jpg' },
  { id: 'e2', title: 'Hackathon Info Session', date: new Date().toISOString(), location: 'STEM Hall', description: 'Intro to the upcoming hackathon.', thumbnail: '/block.jpg' }
]

const sampleGroups = [
  { id: 'g1', name: 'Robotics Club', members: 42, location: 'Engineering', description: 'Building robots and competing in challenges.', thumbnail: '/block.jpg' },
  { id: 'g2', name: 'Art Society', members: 18, location: 'Fine Arts', description: 'Weekly sketching sessions and workshops.', thumbnail: '/block.jpg' }
]

type Message = { id: string; role: 'user' | 'assistant' | 'system'; text: string }

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { events } = useEvents()
  const { user } = useAuthContext()

  // Chat state (inlined from Chat.tsx)
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', role: 'assistant', text: 'Hi — I can help explain or recommend events. Ask me anything about your suggested events.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string | ''>('')
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const suggestedEvents = (events && events.length > 0)
    ? events.map((e: any) => ({ id: e.id, title: e.title }))
    : sampleEvents.map(ev => ({ id: ev.id, title: ev.title }))

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = { id: String(Date.now()), role: 'user', text: input }
    const updatedMessages = [...messages, userMsg]
    const historyToSend = updatedMessages.slice(-15).map(m => ({ role: m.role, content: m.text }))

    setMessages(updatedMessages)
    setInput('')

    const loadingId = `assistant-${Date.now()}`
    setMessages((prev) => [...prev, { id: loadingId, role: 'assistant', text: 'Thinking…' }])
    setLoading(true)

    try {
      const response = await request('/chat/basic', {
        method: 'POST',
        body: { history: historyToSend, user_id: user?.user_id ?? null }
      })

      setMessages((prev) => prev.map((x) => (x.id === loadingId ? { ...x, text: response.reply } : x)))
    } catch (error) {
      console.error("Chat API Error:", error)
      setMessages((prev) => prev.map((x) => (x.id === loadingId ? { ...x, text: "Sorry, I'm having trouble connecting." } : x)))
    } finally {
      setLoading(false)
    }
  }

  const featuredEvent = useMemo(() => {
    if (events && events.length > 0) {
      return events[Math.floor(Math.random() * events.length)]
    }
    return sampleEvents[0]
  }, [events])

  // const handleLogout = () => {
  //   alert("Logged out!");
  //   navigate("/login");
  // };

  return (
    <PageWrapper>
      <MainContent>
          {/* Chat (replaces hero section) */}
          <section className="dashboard-hero">
            <div className="chat-page">
              <div className="chat-header">
                <Heading level={1}>Event Assistant</Heading>
                <Text>Ask the assistant about recommended events, get explanations and suggestions.</Text>
              </div>

              <div className="chat-layout">
                <div className="chat-main">
                  <div className="chat-messages" ref={listRef} aria-live="polite">
                    {messages.map((m) => (
                      <div key={m.id} className={`message ${m.role === 'user' ? 'message-user' : 'message-ai'}`}>
                        <div className="message-bubble">{m.text}</div>
                      </div>
                    ))}
                  </div>

                  <div className="chat-input">
                    <div className="chat-controls">
                      <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="input">
                        <option value="">No event attached</option>
                        {suggestedEvents.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                      </select>
                    </div>

                    <div className="chat-compose">
                      <textarea
                        placeholder="Ask about this event or your suggestions..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <div className="chat-actions">
                        <Button onClick={sendMessage} disabled={loading || !input.trim()}>{loading ? 'Sending…' : 'Send'}</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="chat-side">
                  <div className="chat-side-card">
                    <Heading level={3}>How to use</Heading>
                    <Text>Pick an event to attach context, then ask for explanations, suggestions, or comparisons.</Text>
                    <Heading level={4}>Quick prompts</Heading>
                    <ul>
                      <li>Explain why I should attend this event</li>
                      <li>How does this compare to other events?</li>
                      <li>Who is this event best for?</li>
                    </ul>
                  </div>
                  <div className="brutus-wrap" aria-hidden="true">
                    <LazyImage src="/brutus.png" alt="Brutus" width={120} height={120} className="brutus-img" />
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* Featured Section */}
          <section className="dashboard-feature-grid">
            <Card className="card section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading level={3}>Featured Events</Heading>
                <Button onClick={() => navigate('/events')}>View All</Button>
              </div>
              <div style={{ marginTop: 'var(--space-md)' }} className="dashboard-preview">
                <EventCard event={featuredEvent as any} onView={(id: string) => navigate(`/events/${id}`)} />
              </div>
            </Card>

            <Card className="card section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading level={3}>Featured Groups</Heading>
                <Button onClick={() => navigate('/groups')}>View All</Button>
              </div>
              <div style={{ marginTop: 'var(--space-md)' }} className="dashboard-preview">
                <GroupCard group={sampleGroups[0]} onView={(id: string) => navigate(`/groups/${id}`)} />
              </div>
            </Card>
          </section>
        </MainContent>
    </PageWrapper>
  );
};

export default Dashboard;