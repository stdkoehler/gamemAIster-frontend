import { useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE !== "false";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | { displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!USE_FIREBASE) {
      // Demo mode: check for demoUser in localStorage
      const demoUser = localStorage.getItem("demoUser");
      if (demoUser) {
        setUser({ displayName: demoUser });
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
