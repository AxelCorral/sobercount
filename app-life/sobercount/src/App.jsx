import React, { useState } from 'react'
import BottomNav from './components/BottomNav.jsx'
import HomeTab from './components/HomeTab.jsx'
import HistoryTab from './components/HistoryTab.jsx'
import StatsTab from './components/StatsTab.jsx'
import ProfileTab from './components/ProfileTab.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="app-container">
      <div className="tab-content">
        {activeTab === 'home' && <HomeTab onNavigate={setActiveTab} />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
