import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Card, Heading, Input, Button, Text } from '../components/ui'
import * as groupsService from '../services/groups'

const CreateGroup: React.FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [joinPolicy, setJoinPolicy] = useState('open')
  const [photo, setPhoto] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleCreate = async () => {
    setError('')
    setMessage('')

    if (!name.trim()) {
      setError('Group name is required.')
      return
    }

    setLoading(true)
    try {
      const body: Record<string, any> = {
        name: name.trim(),
        join_policy: joinPolicy,
      }
      if (description.trim()) body.description = description.trim()
      if (photo.trim()) body.image_url = photo.trim()

      await groupsService.createGroup(body)

      setMessage('Group created successfully!')
      setTimeout(() => navigate('/groups'), 1500)
    } catch (err: any) {
      setError(err?.message || 'Failed to create group.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <MainContent>
        <Heading level={1}>Create Group</Heading>

        <Card className="card section-card mt-2">
          <div className="form-stack">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Group Name" />

            <div>
              <label className="input-label" htmlFor="description">Description</label>
              <textarea id="description" className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this group about?" />
            </div>

            <div>
              <label className="input-label" htmlFor="join-policy">Join Policy</label>
              <select id="join-policy" className="input" value={joinPolicy} onChange={(e) => setJoinPolicy(e.target.value)}>
                <option value="open">Open — anyone can join</option>
                <option value="approval">Approval Required</option>
              </select>
            </div>

            <Input label="Photo URL (optional)" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://example.com/photo.jpg" />

            <div className="section-actions">
              <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
              <Button onClick={handleCreate} disabled={loading}>{loading ? 'Creating...' : 'Create Group'}</Button>
            </div>

            {error ? <Text as="p" className="status-error">{error}</Text> : null}
            {message ? <Text as="p" className="status-active">{message}</Text> : null}
          </div>
        </Card>
      </MainContent>
    </PageWrapper>
  )
}

export default CreateGroup
