import React, { useState, useCallback } from 'react'
import BottomNav from './components/BottomNav.jsx'
import HomeTab from './components/HomeTab.jsx'
import HistoryTab from './components/HistoryTab.jsx'
import StatsTab from './components/StatsTab.jsx'
import ProfileTab from './components/ProfileTab.jsx'
import { getEvents } from './storage.js'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [events, setEvents] = useState(() => getEvents())

  const refreshEvents = useCallback(() => setEvents(getEvents()), [])

  return (
    <div className="app-container">
      <div className="tab-content">
        {activeTab === 'home' && (
          <HomeTab onNavigate={setActiveTab} events={events} onEventsChange={refreshEvents} />
        )}
        {activeTab === 'history' && <HistoryTab events={events} />}
        {activeTab === 'stats' && (
          <StatsTab events={events} onEventsChange={refreshEvents} />
        )}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
