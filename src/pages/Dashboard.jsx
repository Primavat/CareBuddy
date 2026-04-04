import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/MainContent';
import CareBot from '../components/CareBot';

const Dashboard = () => {
  const [mode, setMode] = useState('personal');
  const [activeSection, setActiveSection] = useState('vitalsSection');
  const [userName, setUserName] = useState('Priyanshu Nimavat');
  const [members, setMembers] = useState(() => {
    return JSON.parse(localStorage.getItem('carebuddy_members') || '[]');
  });
  const [journalEntries, setJournalEntries] = useState(() => {
    return JSON.parse(localStorage.getItem('carebuddy_journal') || '[]');
  });
  const [vaccineCount, setVaccineCount] = useState(0);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('carebuddy_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('carebuddy_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Update vaccine overdue count (Mock logic for now)
  useEffect(() => {
    setVaccineCount(9); // Default from legacy UI
  }, []);

  // Update active section when mode changes
  useEffect(() => {
    if (mode === 'personal') {
      setActiveSection('vitalsSection');
    } else {
      setActiveSection('familyProfiles');
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-bg-main font-sans">
      <Navbar mode={mode} setMode={setMode} userName={userName} />
      <div className="flex pt-20">
        <Sidebar 
          mode={mode} 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          vaccineCount={vaccineCount}
        />
        <MainContent 
          mode={mode} 
          activeSection={activeSection}
          members={members}
          setMembers={setMembers}
          journalEntries={journalEntries}
          setJournalEntries={setJournalEntries}
        />
      </div>
      <CareBot />
    </div>
  );
};

export default Dashboard;
