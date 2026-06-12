import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { saveReferralFromQuery } from "../../helper/ReferralStorage";

export default function ReferralCapture() {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    saveReferralFromQuery(params, currentUser?.referralCode);
  }, [location.search, currentUser?.referralCode]);

  return null;
}
