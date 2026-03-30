import { useAuthContext } from '../context/AuthContext'

export default function AuthDebugBanner() {
  const { user, token } = useAuthContext()

  if (!user) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        background: '#1a1a2e',
        color: '#0f0',
        padding: '8px 14px',
        borderRadius: 8,
        fontSize: 12,
        fontFamily: 'monospace',
        zIndex: 9999,
        opacity: 0.85,
        maxWidth: 320,
        wordBreak: 'break-all',
      }}
    >
      <div><strong>AUTH DEBUG</strong></div>
      <div>user: {user.email}</div>
      <div>id: {user.user_id}</div>
      <div>token: {token?.slice(0, 20)}...</div>
    </div>
  )
}
