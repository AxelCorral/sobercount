import React, { useState } from 'react'
import { getProfile, saveProfile } from '../storage.js'
import { calculateDailyWaterGoal, getSleepThreshold } from '../constants.js'

const SEXE_OPTIONS = [
  { value: 'homme', label: 'Homme' },
  { value: 'femme', label: 'Femme' },
  { value: 'autre', label: 'Autre' },
]

const inputStyle = {
  backgroundColor: '#1a1a1a',
  color: '#f5f5f5',
  border: '1px solid #2a2a2a',
  outline: 'none',
  borderRadius: '12px',
  padding: '10px 14px',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
}

export default function ProfileTab() {
  const saved = getProfile()
  const [prenom, setPrenom] = useState(saved?.prenom || '')
  const [sexe, setSexe] = useState(saved?.sexe || 'homme')
  const [age, setAge] = useState(saved?.age?.toString() || '')
  const [poids, setPoids] = useState(saved?.poids?.toString() || '')
  const [taille, setTaille] = useState(saved?.taille?.toString() || '')
  const [savedOk, setSavedOk] = useState(false)

  const formProfile = {
    prenom: prenom.trim(),
    sexe,
    age: parseInt(age) || null,
    poids: parseInt(poids) || null,
    taille: parseInt(taille) || null,
  }

  const waterGoal = calculateDailyWaterGoal(formProfile.poids ? formProfile : null)
  const glasses = Math.round(waterGoal / 250)
  const sleepThreshold = getSleepThreshold(formProfile.age)

  const handleSave = () => {
    saveProfile(formProfile)
    setSavedOk(true)
    setTimeout(() => setSavedOk(false), 2500)
  }

  return (
    <div className="p-4 pb-6">
      <h2 className="text-xl font-bold mb-1" style={{ color: '#f5f5f5' }}>Mon profil</h2>
      <p className="text-xs mb-5" style={{ color: '#6b7280' }}>
        Personnalise tes objectifs d'hydratation et de sommeil
      </p>

      <div className="flex flex-col gap-4">
        {/* Prénom */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>
            Prénom (optionnel)
          </label>
          <input
            type="text"
            placeholder="Ton prénom"
            value={prenom}
            onChange={e => setPrenom(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Sexe */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>Sexe</label>
          <div className="flex gap-2">
            {SEXE_OPTIONS.map(s => (
              <button
                key={s.value}
                onClick={() => setSexe(s.value)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  backgroundColor: sexe === s.value ? '#1d3a5c' : '#1a1a1a',
                  color: sexe === s.value ? '#60a5fa' : '#6b7280',
                  border: `1px solid ${sexe === s.value ? '#3b82f6' : 'transparent'}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Âge / Poids / Taille */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>Âge</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="ans"
              value={age}
              min="10"
              max="99"
              onChange={e => setAge(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>Poids (kg)</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="kg"
              value={poids}
              min="30"
              max="250"
              onChange={e => setPoids(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#9ca3af' }}>Taille (cm)</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="cm"
              value={taille}
              min="100"
              max="250"
              onChange={e => setTaille(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl text-sm font-bold"
          style={{ backgroundColor: savedOk ? '#15803d' : '#f59e0b', color: '#0f0f0f' }}
        >
          {savedOk ? '✓ Profil sauvegardé !' : 'Sauvegarder mon profil'}
        </button>

        {/* Carte synthèse — objectif eau */}
        {formProfile.poids && (
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#071620', border: '2px solid #06b6d4' }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: '#22d3ee' }}>
              💧 Objectif hydratation
            </p>
            <p className="text-2xl font-bold" style={{ color: '#06b6d4' }}>
              {waterGoal.toLocaleString('fr-FR')} ml / jour
            </p>
            <p className="text-sm mt-0.5" style={{ color: '#0e7490' }}>
              soit {glasses} verres de 25 cl
            </p>
            <p className="text-[10px] mt-2" style={{ color: '#164e63' }}>
              Source : EFSA + National Academy of Medicine
            </p>
          </div>
        )}

        {/* Carte synthèse — sommeil */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: '#130e20', border: '2px solid #8b5cf6' }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: '#c4b5fd' }}>
            😴 Sommeil recommandé
          </p>
          <p className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>
            {sleepThreshold}h minimum / nuit
          </p>
          <p className="text-sm mt-0.5" style={{ color: '#6d28d9' }}>
            {formProfile.age
              ? `Recommandation pour ${formProfile.age} ans`
              : 'Recommandation générale adulte'}
          </p>
          <p className="text-[10px] mt-2" style={{ color: '#3b1f72' }}>
            Source : National Sleep Foundation 2015
          </p>
        </div>
      </div>
    </div>
  )
}
