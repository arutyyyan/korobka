import PlatformHeader from "@/components/PlatformHeader";
import { Outlet } from "react-router-dom";

const PlatformLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col w-full">
        <div className="bg-white flex flex-col flex-1">
          <PlatformHeader />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default PlatformLayout;

