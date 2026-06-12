import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import ReferralCapture from "../Referral/ReferralCapture";

const UserLayout = () => {
  return (
    <>
      <ReferralCapture />
      <Navbar />
      <Outlet />
    </>
  );
};

export default UserLayout;
