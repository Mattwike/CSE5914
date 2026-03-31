import React, { useState, useRef, useEffect } from 'react'
import { PageWrapper, MainContent } from '../components/layout'
import { Heading, Button, Text, LazyImage } from '../components/ui'
import '../styles/chat.css'
import { request } from '../services/api'

type Message = { id: string; role: 'user' | 'ai' | 'system'; text: string }

const MOCK_SUGGESTED = [
  { id: '1', title: 'Campus Meetup: Study Group' },
  { id: '2', title: 'Hackathon Info Session' },
  { id: '3', title: 'Guest Lecture: AI Ethics' },
]

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', role: 'ai', text: 'Hi — I can help explain or recommend events. Ask me anything about your suggested events.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string | ''>('')
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg: Message = { id: String(Date.now()), role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')

    // Show loading AI bubble
    const loadingId = `ai-${Date.now()}`
    setMessages((m) => [...m, { id: loadingId, role: 'ai', text: 'Thinking…' }])
    setLoading(true)

    try {
      const response = await request('/chat/basic', {
        method: 'POST',
        body: { message: userMsg.text } 
      })

      setMessages((m) => 
        m.map((x) => (x.id === loadingId ? { ...x, text: response.reply } : x))
      )
    } catch (error) {
      console.error("Chat API Error:", error)
      setMessages((m) => 
        m.map((x) => (x.id === loadingId ? { ...x, text: "Sorry, I'm having trouble connecting to the server right now." } : x))
      )
    } finally {
      setLoading(false)
    }
    
  }

  return (
    <PageWrapper>
      <MainContent>
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
                    {MOCK_SUGGESTED.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                  </select>
                </div>

                <div className="chat-compose">
                  <textarea placeholder="Ask about this event or your suggestions..." value={input} onChange={(e) => setInput(e.target.value)} />
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
      </MainContent>
    </PageWrapper>
  )
}

export default Chat
