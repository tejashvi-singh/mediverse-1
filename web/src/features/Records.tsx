// web/src/features/Records.tsx
import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  serverTimestamp,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Records() {
  const [records, setRecords] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(collection(db, "records"), where("user", "==", uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setRecords(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  async function addRecord() {
    if (!notes && !file) {
      alert("Enter notes or attach a file");
      return;
    }

    let fileUrl = "";
    if (file) {
      const uid = auth.currentUser?.uid;
      const path = `records/${uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "records"), {
      text: notes,
      fileUrl,
      user: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    });

    setNotes("");
    setFile(null);
    (document.getElementById("record-file-input") as HTMLInputElement | null)?.value && ((document.getElementById("record-file-input") as HTMLInputElement).value = "");
  }

  return (
    <div>
      <h3>Medical Records</h3>

      <div style={{ marginBottom: 12 }}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Short notes about this record"
          style={{ width: "100%", padding: 8, minHeight: 80 }}
        />

        <div style={{ marginTop: 8 }}>
          <input id="record-file-input" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>

        <div style={{ marginTop: 8 }}>
          <button onClick={addRecord}>Save Record</button>
        </div>
      </div>

      <ul>
        {records.map((r) => (
          <li key={r.id} style={{ padding: "8px 0", borderBottom: "1px solid #f6f6f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{r.text || "(No notes)"}</div>
                {r.fileUrl && (
                  <div>
                    <a href={r.fileUrl} target="_blank" rel="noreferrer">
                      View attachment
                    </a>
                  </div>
                )}
              </div>
              <div style={{ color: "#999", fontSize: 12 }}>{new Date(r.createdAt?.seconds ? r.createdAt.seconds * 1000 : r.createdAt?.toMillis ? r.createdAt.toMillis() : Date.now()).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}