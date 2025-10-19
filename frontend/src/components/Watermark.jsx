import React from 'react'

const PLAN = import.meta.env.VITE_PLAN || (import.meta.env.PLAN) || 'free'
const WATERMARK = (import.meta.env.VITE_WATERMARK ?? 'true').toString() !== 'false'

export function Watermark() {
  if (!WATERMARK) return null
  if (PLAN && PLAN.toLowerCase() !== 'free') return null
  return (
    <div style={{position:'fixed',bottom:8,right:8,opacity:0.75,background:'rgba(0,0,0,0.05)',padding:'6px 10px',borderRadius:8,fontSize:12}}>
      Powered by Telegram Shop · Free plan
    </div>
  )
}
