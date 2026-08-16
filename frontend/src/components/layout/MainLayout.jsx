import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-border bg-white">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-lg font-semibold text-text-primary">
              Inventory Management System
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;