import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import AppFeedbackButton from "@/components/AppFeedbackButton";

import Splash from "@/pages/Splash";
import RoleSelect from "@/pages/RoleSelect";
import CustomerLogin from "@/pages/CustomerLogin";
import OwnerLogin from "@/pages/OwnerLogin";
import CustomerHome from "@/pages/CustomerHome";
import Menu from "@/pages/Menu";
import CreateOrder from "@/pages/CreateOrder";
import OwnerDashboard from "@/pages/OwnerDashboard";
import NotFound from "@/pages/NotFound";

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/role" element={<RoleSelect />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/customer/home" element={<CustomerHome />} />
          <Route path="/customer/menu" element={<Menu />} />
          <Route path="/customer/create-order" element={<CreateOrder />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AppFeedbackButton />
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
