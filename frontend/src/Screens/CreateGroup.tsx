import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Card, Heading, Input, Button, Text } from '../components/ui'
import * as groupsService from '../services/groups'
import { supabase } from '../services/supabase'

const CreateGroup: React.FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [joinPolicy, setJoinPolicy] = useState('open')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()

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

    if (!name.trim()) {
      setError('Group name is required.')
      return
    }

    setLoading(true)
    try {
      let imageUrl: string | undefined

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

      await groupsService.createGroup({
        name: name.trim(),
        join_policy: joinPolicy,
        description: description.trim() || undefined,
        image_url: imageUrl,
      })

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

            <div>
              <label className="input-label">Group Photo (optional)</label>
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
