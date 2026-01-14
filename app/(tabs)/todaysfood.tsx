import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/FirebaseConfig";

const dateKey = (d = new Date()) => d.toISOString().slice(0, 10);

export function useTodaysMeals() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const auth = getAuth();

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setMeals([]);
        return;
      }

      const uid = user.uid;
      const today = dateKey();

      const q = query(
        collection(db, "users", uid, "entries"),
        where("dateKey", "==", today),
        orderBy("createdAt", "desc")
      );

      const unsubSnap = onSnapshot(
        q,
        (snap) => setMeals(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (err) => console.log("SNAPSHOT ERROR:", err)
      );

      
      return unsubSnap;
    });

    return () => unsubAuth();
  }, []);

  return meals;
}
