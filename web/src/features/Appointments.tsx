// web/src/features/Appointments.tsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "appointments"),
      where("user", "==", uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  async function addAppointment() {
    if (!title || !when) {
      alert("Please enter title and date/time.");
      return;
    }
    await addDoc(collection(db, "appointments"), {
      title,
      when,
      user: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setWhen("");
  }

  async function deleteAppointment(id: string) {
    if (!confirm("Delete this appointment?")) return;
    await deleteDoc(doc(db, "appointments", id));
  }

  return (
    <div>
      <h3>Appointments</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <input
          placeholder="Reason / title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          style={{ padding: 8 }}
        />
        <button onClick={addAppointment} style={{ padding: "8px 12px" }}>
          Add
        </button>
      </div>

      <ul>
        {appointments.map((a) => (
          <li key={a.id} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{a.title}</div>
                <div style={{ color: "#666", fontSize: 13 }}>{a.when}</div>
              </div>
              <div>
                <button onClick={() => deleteAppointment(a.id)} style={{ color: "#b00" }}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}