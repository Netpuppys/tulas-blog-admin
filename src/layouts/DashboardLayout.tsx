import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const DashboardLayout = () => {
  return (
    <div>
      <Navigation />
      <div className="pb-11">
        <div className="p-5 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
