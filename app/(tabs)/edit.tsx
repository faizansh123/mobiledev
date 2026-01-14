import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/FirebaseConfig";

export async function updateMeal(entryId, { foodName, calories, mealType }) {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not logged in");

  const uid = user.uid;

  await updateDoc(
    doc(db, "users", uid, "entries", entryId),
    {
      foodName: foodName.trim(),
      calories: Number(calories),
      mealType,
      
    }
  );
}
