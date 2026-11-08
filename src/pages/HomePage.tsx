import React from 'react';
import { Hero } from '../components/Hero';
import { ChaosVsOrder } from '../components/ChaosVsOrder';
import { ShowcaseSimulator } from '../components/ShowcaseSimulator';
import { Deliverables } from '../components/Deliverables';
import { ProcessRoadmap } from '../components/ProcessRoadmap';
import { AgencyComparison } from '../components/AgencyComparison';
import { PricingSection } from '../components/PricingSection';
import { ContactSection } from '../components/ContactSection';
import { FAQSection } from '../components/FAQSection';
import { User } from 'firebase/auth';
import { PricingPlan } from '../types';

interface HomePageProps {
  onOpenBlueprint: (initialIdea?: string) => void;
  onOpenContact: (initialService?: string) => void;
  onExploreBootcamp: () => void;
  initialServiceForContact?: string;
  currentUser?: User | null;
  onUserChange?: (user: User | null) => void;
  onOpenGmailHub?: () => void;
  onOpenDriveHub?: () => void;
  onOpenContactsHub?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenBlueprint,
  onOpenContact,
  onExploreBootcamp,
  initialServiceForContact,
  currentUser,
  onUserChange,
  onOpenGmailHub,
  onOpenDriveHub,
  onOpenContactsHub,
}) => {
  const handleSelectPlan = (plan: PricingPlan) => {
    onOpenContact(`${plan.name} (${plan.priceFormatted})`);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (categoryTitle: string) => {
    onOpenBlueprint(`Custom Mobile Application for ${categoryTitle}`);
  };

  return (
    <main>
      <Hero
        onOpenBlueprint={onOpenBlueprint}
        onOpenContact={() => onOpenContact()}
        onExploreBootcamp={onExploreBootcamp}
      />
      <ChaosVsOrder />
      <ShowcaseSimulator onSelectCategory={handleSelectCategory} />
      <Deliverables onOpenContact={() => onOpenContact()} />
      <ProcessRoadmap onOpenContact={() => onOpenContact()} />
      <AgencyComparison />
      <PricingSection onSelectPlan={handleSelectPlan} />
      <ContactSection
        initialService={initialServiceForContact}
        currentUser={currentUser}
        onUserChange={onUserChange}
        onOpenGmailHub={onOpenGmailHub}
      />
      <FAQSection />
    </main>
  );
};
