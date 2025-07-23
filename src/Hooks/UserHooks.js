import { useState, useEffect } from "react";
import { getLoggedinUser } from "../helpers/api_helper";

const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
  const userProfileSession = getLoggedinUser();
    console.log('UserHooks - Retrieved user profile:', userProfileSession);
    setUserProfile(userProfileSession);
    setLoading(false);
  }, []);

  return { userProfile, loading };
};

export { useProfile };
