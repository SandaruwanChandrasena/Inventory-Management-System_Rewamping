import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — fixed, does not scroll with page content */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header — stays visible at the top */}
        <Header />

        {/* Page Content — scrolls independently */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;