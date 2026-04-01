import React, { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Card, Heading, Input, Button, Text } from '../components/ui'
import { request } from '../services/api'
import { supabase } from '../services/supabase'
import { addGroupEvent } from '../services/groups'

const CreateEvent: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [capacity, setCapacity] = useState<number | ''>('')
  const [closeDate, setCloseDate] = useState('')
  const [fee, setFee] = useState<number | ''>('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const groupId = searchParams.get('groupId')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setPhotoFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPhotoPreview(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0] || null
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

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
      let imageUrl: string | undefined

      // Upload photo to Supabase Storage if one was selected
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, photoFile)

        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)

        const { data: urlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }

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
      body.fee = fee !== '' ? fee : 0
      if (imageUrl) body.image_url = imageUrl

      const result = await request('/events/create', {
        method: 'POST',
        body,
      })

      // If creating from a group, auto-link the event to that group
      if (groupId && result?.event_id) {
        await addGroupEvent(groupId, result.event_id)
      }

      setMessage('Event created successfully!')
      const redirectTo = groupId ? `/groups/${groupId}` : '/events'
      setTimeout(() => navigate(redirectTo), 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to create event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <MainContent>
        <Heading level={1}>{groupId ? 'Create Group Event' : 'Create Event'}</Heading>
        {groupId && (
          <Text as="p" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
            This event will be linked to your group.
          </Text>
        )}

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

            <Input label="Event Fee ($)" type="number" value={fee as any} onChange={(e) => setFee(e.target.value ? Number(e.target.value) : '')} placeholder="0 for free" />

            <div>
              <label className="input-label">Event Photo (optional)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  border: '2px dashed var(--color-border, #ccc)',
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--color-surface, #fafafa)',
                }}
              >
                {photoPreview ? (
                  <div>
                    <img src={photoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                    <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>{photoFile?.name}</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPhotoFile(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--color-danger, red)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ color: 'var(--color-text-muted)' }}>
                    <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Click or drag & drop an image here</p>
                    <p style={{ fontSize: '0.875rem' }}>PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

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
