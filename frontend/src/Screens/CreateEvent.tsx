import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Card, Heading, Input, Button, Text } from '../components/ui'
import { request } from '../services/api'

// TODO: replace with real authenticated user ID once auth is wired up
const TEST_USER_ID = '078a3566-ad0b-4a12-aa3b-0547af0e4ade'

const CreateEvent: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [capacity, setCapacity] = useState<number | ''>('')
  const [closeDate, setCloseDate] = useState('')
  const [photo, setPhoto] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleCreate = async () => {
    setError('')
    setMessage('')

    if (!title.trim()) {
      setError('Event title is required.')
      return
    }
    if (!startTime) {
      setError('Start time is required.')
      return
    }

    setLoading(true)
    try {
      const body: Record<string, any> = {
        title: title.trim(),
        start_time: new Date(startTime).toISOString(),
      }
      if (description.trim()) body.description = description.trim()
      if (locationName.trim()) body.location_name = locationName.trim()
      if (locationAddress.trim()) body.location_address = locationAddress.trim()
      if (endTime) body.end_time = new Date(endTime).toISOString()
      if (capacity !== '') body.capacity = capacity
      if (closeDate) body.close_date = new Date(closeDate).toISOString()
      if (photo.trim()) body.image_url = photo.trim()

      await request(`/events/${TEST_USER_ID}/create`, {
        method: 'POST',
        body,
      })

      setMessage('Event created successfully!')
      setTimeout(() => navigate('/events'), 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to create event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <MainContent>
        <Heading level={1}>Create Event</Heading>

        <Card className="card section-card mt-2">
          <div className="form-stack">
            <Input label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" />

            <div>
              <label className="input-label" htmlFor="description">Description</label>
              <textarea id="description" className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your event..." />
            </div>

            <Input label="Location Name" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="e.g. Ohio Union" />

            <Input label="Location Address" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} placeholder="e.g. 1739 N High St, Columbus, OH" />

            <div>
              <label className="input-label" htmlFor="start-time">Start Time *</label>
              <input id="start-time" className="input" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>

            <div>
              <label className="input-label" htmlFor="end-time">End Time</label>
              <input id="end-time" className="input" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>

            <Input label="Number of People" type="number" value={capacity as any} onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : '')} placeholder="Expected capacity" />

            <div>
              <label className="input-label" htmlFor="close-date">Registration Close Date</label>
              <input id="close-date" className="input" type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
            </div>

            <Input label="Photo URL (optional)" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="/images/photo.jpg" />

            <div className="section-actions">
              <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
              <Button onClick={handleCreate} disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</Button>
            </div>

            {error ? <Text as="p" className="status-error">{error}</Text> : null}
            {message ? <Text as="p" className="status-active">{message}</Text> : null}
          </div>
        </Card>
      </MainContent>
    </PageWrapper>
  )
}

export default CreateEvent
