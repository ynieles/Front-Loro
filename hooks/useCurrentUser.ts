import { AuthService } from "@/services/auth.service";
import { UserProfile } from "@/types/auth.types";
import { useEffect, useState } from "react";

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return {
    user,
  };
};
