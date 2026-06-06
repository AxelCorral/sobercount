import React, { useState } from 'react'
import BottomNav from './components/BottomNav.jsx'
import HomeTab from './components/HomeTab.jsx'
import HistoryTab from './components/HistoryTab.jsx'
import StatsTab from './components/StatsTab.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="app-container">
      <div className="tab-content">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'stats' && <StatsTab />}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
