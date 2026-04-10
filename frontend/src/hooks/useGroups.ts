import { useEffect, useState } from 'react'
import * as groupsService from '../services/groups'
import type { GroupItem } from '../components/groups/GroupCard'

export default function useGroups() {
  const [groups, setGroups] = useState<GroupItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await groupsService.listGroups({ limit: 100 })
        if (!mounted) return

        if (data?.groups && Array.isArray(data.groups)) {
          setGroups(data.groups.map((g: groupsService.Group) => ({
            id: g.id,
            name: g.name,
            members: g.member_count,
            location: g.join_policy === 'open' ? 'Open' : 'Approval',
            description: g.description || '',
            thumbnail: g.image_url || undefined,
            join_policy: g.join_policy,
          })))
        } else {
          console.error('Unexpected /groups response:', data)
          setGroups([])
          setError('Invalid groups response from server')
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Failed to load groups')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return { groups, loading, error }
}
