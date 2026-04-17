import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Heading, Text, LazyImage } from "../components/ui";
import ReactMarkdown from 'react-markdown';
import '../styles/dashboard.css'
import '../styles/chat.css'
import { PageWrapper, MainContent } from "../components/layout";
import useEvents from '../hooks/useEvents'
import { request } from '../services/api'
import { featuredGroups as fetchFeaturedGroupsApi } from '../services/groups'
import { useAuthContext } from '../context/AuthContext'

interface RecommendedEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  is_free: boolean;
}

interface FeaturedGroup {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  join_policy: 'open' | 'approval';
  image_url: string | null;
}

const sampleEvents = [
  { id: 'e1', title: 'Campus Study Group', date: new Date().toISOString(), location: 'The Union', description: 'Quick study meet to prep for exams.', thumbnail: '/block.jpg' },
  { id: 'e2', title: 'Hackathon Info Session', date: new Date().toISOString(), location: 'STEM Hall', description: 'Intro to the upcoming hackathon.', thumbnail: '/block.jpg' }
]

type Message = { id: string; role: 'user' | 'assistant' | 'system'; text: string }

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { events } = useEvents()
  const { user } = useAuthContext()

  // Featured events state
  const [featuredEvents, setFeaturedEvents] = useState<RecommendedEvent[]>([])
  const [featuredLoading, setFeaturedLoading] = useState(false)

  // Featured groups state
  const [featuredGroups, setFeaturedGroups] = useState<FeaturedGroup[]>([])
  const [featuredGroupsLoading, setFeaturedGroupsLoading] = useState(false)

  // Chat state (inlined from Chat.tsx)
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', role: 'assistant', text: 'Hi — I can help explain or recommend events. Ask me anything about your suggested events.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string | ''>('')
  const listRef = useRef<HTMLDivElement | null>(null)

  // Fetch featured events
  const fetchFeaturedEvents = async () => {
    if (!user?.user_id) return;
    
    setFeaturedLoading(true);
    try {
      const data = await request(`/chat/top-recommendations/${user.user_id}`);
      setFeaturedEvents(data?.recommendations || []);
    } catch (err) {
      console.error("Failed to fetch featured events:", err);
      setFeaturedEvents([]);
    } finally {
      setFeaturedLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchFeaturedEvents();
    }
  }, [user, location])

  const fetchFeaturedGroups = async () => {
    setFeaturedGroupsLoading(true);
    try {
      const data = await fetchFeaturedGroupsApi(3);
      setFeaturedGroups(data?.groups ?? []);
    } catch (err) {
      console.error("Failed to fetch featured groups:", err);
      setFeaturedGroups([]);
    } finally {
      setFeaturedGroupsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedGroups();
  }, [])

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
    const historyToSend = updatedMessages.slice(-10).map(m => ({ role: m.role, content: m.text }))

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
                        <div
                          className="message-bubble"
                          style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                        >
                          <ReactMarkdown>{m.text}</ReactMarkdown>
                        </div>
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
            <Card className="card section-card" style={{ gridColumn: '1 / -1' }}>
              <Heading level={2} style={{ marginBottom: '24px' }}>Featured Events Just For You</Heading>

              {featuredEvents.length === 0 && !featuredLoading ? (
                <Text as="p" style={{ color: '#666' }}>No recommendations available yet.</Text>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {featuredEvents.map((event) => (
                    <div
                      key={event.id}
                      style={{
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <Heading level={3} style={{ marginBottom: '8px', fontSize: '1.1em' }}>{event.title}</Heading>
                      <Text as="p" style={{ color: '#666', marginBottom: '8px', fontSize: '0.9em' }}>
                        {event.start_time}
                      </Text>
                      <Text as="p" style={{ color: '#666', marginBottom: '8px', fontSize: '0.9em' }}>
                        📍 {event.location}
                      </Text>
                      <Text as="p" style={{ color: '#666', marginBottom: '12px', fontSize: '0.85em' }}>
                        {event.description?.substring(0, 80)}...
                      </Text>
                      <Text as="p" style={{ 
                        fontWeight: 'bold', 
                        color: event.is_free ? '#4caf50' : '#ff9800',
                        fontSize: '0.9em'
                      }}>
                        {event.is_free ? "Free" : "Paid"}
                      </Text>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="card section-card" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Heading level={2}>Featured Groups</Heading>
                <Button onClick={() => navigate('/groups')}>View All</Button>
              </div>

              {featuredGroups.length === 0 && !featuredGroupsLoading ? (
                <Text as="p" style={{ color: '#666' }}>No groups available yet.</Text>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {featuredGroups.map((group) => (
                    <div
                      key={group.id}
                      style={{
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      <Heading level={3} style={{ marginBottom: '8px', fontSize: '1.1em' }}>{group.name}</Heading>
                      <Text as="p" style={{ color: '#666', marginBottom: '8px', fontSize: '0.9em' }}>
                        👥 {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
                      </Text>
                      <Text as="p" style={{ color: '#666', marginBottom: '12px', fontSize: '0.85em' }}>
                        {(group.description || 'No description.').substring(0, 80)}{(group.description?.length ?? 0) > 80 ? '…' : ''}
                      </Text>
                      <Text as="p" style={{
                        fontWeight: 'bold',
                        color: group.join_policy === 'open' ? '#4caf50' : '#ff9800',
                        fontSize: '0.9em'
                      }}>
                        {group.join_policy === 'open' ? 'Open to join' : 'Request to join'}
                      </Text>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>
        </MainContent>
    </PageWrapper>
  );
};

export default Dashboard;