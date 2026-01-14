import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/FirebaseConfig";

const dateKey = (d = new Date()) => d.toISOString().slice(0, 10);

export async function addMeal({ foodName, calories, mealType }) {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not logged in");

  const uid = user.uid;

  await addDoc(collection(db, "users", uid, "entries"), {
    foodName: foodName.trim(),
    calories: Number(calories),
    mealType,
    dateKey: dateKey(),
    createdAt: serverTimestamp(),
  });
}
