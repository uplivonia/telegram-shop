import React from 'react'
import { API } from '../config.js'

export function PrivacyPage() {
  return (
    <div style={{padding:16}}>
      <a href="#home">← Back</a>
      <h2>Privacy Policy</h2>
      <p>No personal data is stored in this demo beyond mock orders saved locally on the server.</p>
      <p>When used inside Telegram, basic user details can be provided via initData.</p>
    </div>
  )
}