import { useState } from "react";
import Header from "@/components/layout/Header";
import SAFControlCenter from "@/components/saf/SAFControlCenter";
import SchoolManagement from "@/components/schools/SchoolManagement";
import SchoolUnitsManager from "@/components/schools/SchoolUnitsManager";
import UserAnalytics from "@/components/analytics/UserAnalytics";
import MonitoringPortal from "@/components/monitoring/MonitoringPortal";
import RealAIAssistant from "@/components/ai/RealAIAssistant";
import UserManagement from "@/components/users/UserManagement";
import VoucherManagement from "@/components/saf/VoucherManagement";
import AIKnowledgeBase from "@/components/saf/AIKnowledgeBase";
import ProfileManagement from "@/components/auth/ProfileManagement";
import TicketSystemSAF from "@/components/tickets/TicketSystemSAF";
import ChinookFloating from "@/components/chinook/ChinookFloating";

const Index = () => {
  const [activeSection, setActiveSection] = useState("saf-control");

  const renderContent = () => {
    try {
      switch (activeSection) {
        case "saf-control":
          return <SAFControlCenter onNavigate={setActiveSection} />;
        case "management":
          return <SchoolManagement />;
        case "school-units":
          return <SchoolUnitsManager />;
        case "users":
          return <UserManagement />;
        case "analytics":
          return <UserAnalytics />;
        case "monitoring":
          return <MonitoringPortal />;
        case "ai":
          return <RealAIAssistant />;
        case "vouchers":
          return <VoucherManagement />;
        case "knowledge":
          return <AIKnowledgeBase />;
        case "tickets-saf":
          return <TicketSystemSAF />;
        case "profile":
          return <ProfileManagement />;
        default:
          return <SAFControlCenter />;
      }
    } catch (error) {
      console.error("Erro ao renderizar conteúdo:", error);
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo ao Maple Bear SAF</h2>
            <p className="text-gray-600">Sistema de Atendimento e Franquias</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
      
      {/* Chinook Floating Helper */}
      <ChinookFloating />
    </div>
  );
};

export default Index;
