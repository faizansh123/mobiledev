import { getAuth } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/FirebaseConfig";

export async function deleteMeal(entryId) {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not logged in");

  const uid = user.uid;
  await deleteDoc(doc(db, "users", uid, "entries", entryId));
}
