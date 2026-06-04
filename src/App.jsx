import { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ContentCalendar from './components/Calendar/ContentCalendar';
import BusinessCRM from './components/CRM/BusinessCRM';
import MediaKitGenerator from './components/MediaKit/MediaKitGenerator';
import AnalyticsTracker from './components/Analytics/AnalyticsTracker';
import CaptionLibrary from './components/Library/CaptionLibrary';

export default function App() {
  const [page, setPage] = useState('calendar');
  const [showAddPost, setShowAddPost] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'calendar':
        return (
          <ContentCalendar
            showAddModal={showAddPost}
            setShowAddModal={setShowAddPost}
          />
        );
      case 'crm':
        return <BusinessCRM />;
      case 'mediakit':
        return <MediaKitGenerator />;
      case 'analytics':
        return <AnalyticsTracker />;
      case 'library':
        return <CaptionLibrary />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-kw-black">
      <Sidebar active={page} onNavigate={setPage} />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header
          page={page}
          onAddPost={() => setShowAddPost(true)}
        />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
