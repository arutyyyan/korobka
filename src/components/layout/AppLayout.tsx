import Header from "@/components/Header";
import PlatformHeader from "@/components/PlatformHeader";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const AppLayout = () => {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  return (
    <div className={`min-h-screen flex flex-col ${isAuthenticated ? 'bg-gray-50' : 'bg-background'}`}>
      {isAuthenticated ? (
        <div className="flex-1 flex flex-col w-full">
          <div className="bg-white flex flex-col flex-1">
            <PlatformHeader />
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
        </>
      )}
    </div>
  );
};

export default AppLayout;

