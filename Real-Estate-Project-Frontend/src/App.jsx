
// Css
import "./App.css";

// Packages
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Home from "./pages/home/Home";
import Properties from "./pages/properties/Properties";
import SignUp from "./pages/signup/SignUp";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import PropertyDetails from "./pages/properties/PropertyDetails";
import PrivateRoute from "./PrivateRoute";
import AddProperty from "./pages/properties/AddProperty";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import YourProperties from "./pages/properties/YourProperties";
import EditProperty from "./pages/properties/EditProperty";
import YourRequests from "./pages/properties/YourRequests";
import RequestDetails from "./pages/properties/RequestDetails";
import ContactOwner from "./pages/properties/ContactOwner";
import TransactionHistory from "./pages/properties/TransactionHistory";
import ContactRenter from "./pages/properties/ContactRenter";
import Login from "./pages/login/Login";
import Forget from "./pages/forgetpassowrd/Forget";
import Reset from "./pages/resetpassword/reset";

function App() {
  return (
    <div className="w-full">
      {/* Header  */}
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        <Route path="/forget-password" element={<Forget />} />
        <Route path="/reset_password/:id/:token" element={<Reset />} />
        <Route path="/property/:id/:property" element={<PropertyDetails />} />
        <Route path="/property/:id/contact/owner" element={<ContactOwner/>} />
        <Route path="/property/:id/contact/renter" element={<ContactRenter/>} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/your-properties" element={<YourProperties />} />
          <Route path="/your-requests" element={<YourRequests />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/transaction-history" element={<TransactionHistory/>} />
          <Route
            path="/edit-property/:id/:property"
            element={<EditProperty />}
          />
          <Route path="/profile/:name" element={<Profile />} />
          <Route path="/profile/Edit" element={<EditProfile />} />
          <Route
            path="/your-requests/:id/:request"
            element={<RequestDetails />}
          />
        </Route>
      </Routes>

      {/* react-hot-toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* footer */}
      <Footer />
    </div>
  );
}

export default App;
