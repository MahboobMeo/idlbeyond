/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { PageView } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BootcampPage } from './pages/BootcampPage';
import { BlueprintModal } from './components/BlueprintModal';
import { GmailHubModal } from './components/GmailHubModal';
import { ClassroomHubModal } from './components/ClassroomHubModal';
import { TasksHubModal } from './components/TasksHubModal';
import { DriveHubModal } from './components/DriveHubModal';
import { ContactsHubModal } from './components/ContactsHubModal';
import { initAuth, googleSignIn } from './services/googleAuth';
import { testFirestoreConnection, syncUserProfileToFirestore } from './services/firestoreService';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals state
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [blueprintIdea, setBlueprintIdea] = useState('Salon & spa booking app with instant UPI deposit');
  const [contactInitialService, setContactInitialService] = useState('Launch Tier Mobile App (Rs. 19,999)');

  // Workspace Hubs State
  const [gmailModalOpen, setGmailModalOpen] = useState(false);
  const [classroomModalOpen, setClassroomModalOpen] = useState(false);
  const [tasksModalOpen, setTasksModalOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [contactsModalOpen, setContactsModalOpen] = useState(false);

  // Initialize Firebase Auth listener and verify Firestore connectivity
  useEffect(() => {
    testFirestoreConnection().catch((err) => {
      console.warn('Firestore connection check completed:', err);
    });

    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        if (user) {
          syncUserProfileToFirestore(user).catch((err) => {
            console.warn('User profile sync notice:', err);
          });
        }
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Sync with browser URL / history for /nocode-bootcamp compatibility
  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.includes('nocode-bootcamp') || search.includes('bootcamp')) {
      setCurrentPage('bootcamp');
    }

    const handlePopState = () => {
      if (window.location.pathname.includes('nocode-bootcamp')) {
        setCurrentPage('bootcamp');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: PageView, hash?: string) => {
    setCurrentPage(page);
    if (page === 'bootcamp') {
      window.history.pushState({}, '', '/nocode-bootcamp');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/');
      if (hash) {
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleOpenBlueprint = (initialIdea?: string) => {
    if (initialIdea) {
      setBlueprintIdea(initialIdea);
    }
    setBlueprintModalOpen(true);
  };

  const handleOpenContact = (serviceTitle?: string) => {
    if (serviceTitle) {
      setContactInitialService(serviceTitle);
    }
    if (currentPage !== 'home') {
      handleNavigate('home', '#contact');
    } else {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBlueprintSendDetails = (details: string) => {
    setBlueprintModalOpen(false);
    handleOpenContact(`Custom Blueprint Consultation`);
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
      }
    } catch (err) {
      console.error('Google Sign In error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenContact={() => handleOpenContact()}
        onOpenBlueprint={() => handleOpenBlueprint()}
        onOpenGmailHub={() => setGmailModalOpen(true)}
        onOpenClassroomHub={() => setClassroomModalOpen(true)}
        onOpenTasksHub={() => setTasksModalOpen(true)}
        onOpenDriveHub={() => setDriveModalOpen(true)}
        onOpenContactsHub={() => setContactsModalOpen(true)}
        currentUser={currentUser}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {currentPage === 'home' ? (
        <HomePage
          onOpenBlueprint={handleOpenBlueprint}
          onOpenContact={handleOpenContact}
          onExploreBootcamp={() => handleNavigate('bootcamp')}
          initialServiceForContact={contactInitialService}
          currentUser={currentUser}
          onUserChange={setCurrentUser}
          onOpenGmailHub={() => setGmailModalOpen(true)}
          onOpenDriveHub={() => setDriveModalOpen(true)}
          onOpenContactsHub={() => setContactsModalOpen(true)}
        />
      ) : (
        <BootcampPage
          onBackToHome={() => handleNavigate('home')}
          onOpenClassroomHub={() => setClassroomModalOpen(true)}
          onOpenTasksHub={() => setTasksModalOpen(true)}
          onOpenDriveHub={() => setDriveModalOpen(true)}
          onOpenGmailHub={() => setGmailModalOpen(true)}
          onOpenContactsHub={() => setContactsModalOpen(true)}
        />
      )}

      <Footer
        onNavigate={handleNavigate}
        onOpenContact={() => handleOpenContact()}
      />

      {/* Interactive Blueprint Drawer / Modal */}
      <BlueprintModal
        isOpen={blueprintModalOpen}
        initialIdea={blueprintIdea}
        onClose={() => setBlueprintModalOpen(false)}
        onOpenContactWithDetails={handleBlueprintSendDetails}
      />

      {/* 1. Gmail Hub Modal */}
      <GmailHubModal
        isOpen={gmailModalOpen}
        onClose={() => setGmailModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      {/* 2. Google Classroom Hub Modal */}
      <ClassroomHubModal
        isOpen={classroomModalOpen}
        onClose={() => setClassroomModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      {/* 3. Google Tasks Hub Modal */}
      <TasksHubModal
        isOpen={tasksModalOpen}
        onClose={() => setTasksModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      {/* 4. Google Drive Hub Modal */}
      <DriveHubModal
        isOpen={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        blueprintContent={`# IDLTech Project Blueprint & Deliverables\n\nPlatform: IDLTech Studio (idltech.idlmatch.com)\nTier: Launch Tier Mobile App (Rs. 19,999 + GST)\nTimeline: 7 Days Delivery Guarantee\n\n## Architecture Blueprint:\n- React 19 Frontend + Tailwind CSS\n- Firebase Firestore & Authentication\n- Google Workspace Integrations: Gmail, Classroom, Tasks, Drive, Contacts\n- 100% Full IP Ownership & Source Code\n\nFaculty Support: idlfxn@gmail.com`}
        blueprintTitle="IDLTech_Project_Blueprint"
      />

      {/* 5. Google Contacts Hub Modal */}
      <ContactsHubModal
        isOpen={contactsModalOpen}
        onClose={() => setContactsModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />
    </div>
  );
}
