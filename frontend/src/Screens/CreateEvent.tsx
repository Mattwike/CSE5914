import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Card, Heading, Input, Button, Text } from '../components/ui'

const CreateEvent: React.FC = () => {
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState<number | ''>('')
  const [closeDate, setCloseDate] = useState('')
  const [visibility, setVisibility] = useState('Public')
  const [photo, setPhoto] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleCreate = () => {
    setMessage('Event created (cosmetic).')
  }

  return (
    <PageWrapper>
      <MainContent>
        <Heading level={1}>Create Event</Heading>

        <Card className="card section-card mt-2">
          <div className="form-stack">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Event Title" />

            <Input label="Number of people" type="number" value={capacity as any} onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : '')} placeholder="Expected capacity" />

            <div>
              <label className="input-label" htmlFor="close-date">Close Date</label>
              <input id="close-date" className="input" type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
            </div>

            <div>
              <label className="input-label" htmlFor="visibility">Visibility</label>
              <select id="visibility" className="input" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>

            <Input label="Photo URL (optional)" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="/images/photo.jpg" />

            <div className="section-actions">
              <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
              <Button onClick={handleCreate}>Create Event</Button>
            </div>

            {message ? <Text as="p" className="status-active">{message}</Text> : null}
          </div>
        </Card>
      </MainContent>
    </PageWrapper>
  )
}

export default CreateEvent
