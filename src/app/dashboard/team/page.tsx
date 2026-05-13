'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import type { TeamMember } from '@/types'

export default function TeamPage() {
  const { user, userDoc } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isEnterprise = userDoc?.subscription?.plan === 'enterprise'
  const isOwner = isEnterprise && !userDoc?.teamId

  const fetchMembers = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const token = await auth!.currentUser!.getIdToken()
      const res = await fetch('/api/team', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setMembers(data.members || [])
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setActionLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = await auth!.currentUser!.getIdToken()
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '초대에 실패했습니다.')

      setSuccess(`${email} 사용자를 팀원으로 초대했습니다.`)
      setEmail('')
      fetchMembers()
    } catch (err) {
      setError(String(err))
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemove = async (memberUid: string) => {
    if (!confirm('정말 이 팀원을 삭제하시겠습니까?')) return
    setActionLoading(true)
    try {
      const token = await auth!.currentUser!.getIdToken()
      const res = await fetch(`/api/team?memberUid=${memberUid}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('삭제에 실패했습니다.')
      fetchMembers()
    } catch (err) {
      alert(err)
    } finally {
      setActionLoading(false)
    }
  }

  if (!isEnterprise && !userDoc?.teamId) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-5xl mb-4">🔒</span>
        <h1 className="text-2xl font-bold text-white mb-2">Enterprise 기능입니다</h1>
        <p className="text-white/40 max-w-md">
          팀 관리 기능은 Enterprise 플랜에서만 제공됩니다. <br />
          플랜을 업그레이드하고 팀원과 함께 공고를 분석해보세요.
        </p>
        <a 
          href="/#pricing" 
          className="mt-6 px-6 py-3 rounded-xl font-bold text-white transition-all"
          style={{ background: '#006B7A' }}
        >
          플랜 확인하기
        </a>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">팀 관리</h1>
        <p className="text-white/40 text-sm mt-1">
          {isOwner ? '팀원을 초대하고 권한을 관리할 수 있습니다.' : '소속된 팀의 멤버 목록입니다.'}
        </p>
      </div>

      {isOwner && (
        <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-semibold mb-4">새 팀원 초대</h2>
          <form onSubmit={handleInvite} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="초대할 팀원의 이메일 주소"
              className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#006B7A] transition-colors"
              required
            />
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-50"
              style={{ background: '#006B7A' }}
            >
              {actionLoading ? '처리 중...' : '초대 보내기'}
            </button>
          </form>
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          {success && <p className="text-green-400 text-xs mt-3">{success}</p>}
        </div>
      )}

      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-bottom border-white/10 bg-white/5 flex items-center justify-between">
          <span className="text-white font-semibold text-sm">팀원 목록</span>
          <span className="text-white/40 text-xs">{members.length}명</span>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="py-20 text-center text-white/20">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-sm">아직 팀원이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {members.map((member) => (
              <div key={member.uid} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {member.photoURL ? (
                    <Image src={member.photoURL} alt="" width={40} height={40} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#006B7A] flex items-center justify-center font-bold text-white">
                      {member.displayName?.[0] || member.email[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">{member.displayName || '이름 없음'}</p>
                    <p className="text-white/30 text-xs">{member.email}</p>
                  </div>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleRemove(member.uid)}
                    className="text-white/20 hover:text-red-400 transition-colors text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-400/10"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
