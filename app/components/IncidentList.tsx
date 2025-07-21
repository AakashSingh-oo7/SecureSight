'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';

interface Camera {
  id: string;
  name: string;
  location: string;
}

interface Incident {
  id: string;
  type: string;
  cameraId: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
  camera?: Camera; 
}

export default function IncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    
    const camerasSnap = await getDocs(collection(db, 'cameras'));
    const cameraMap: Record<string, Camera> = {};
    camerasSnap.forEach((doc) => {
      const data = doc.data() as Camera;
      cameraMap[doc.id] = { id: doc.id, ...data };
    });

    
    const incidentsSnap = await getDocs(
      query(collection(db, 'incidents'), where('resolved', '==', false))
    );

    const results: Incident[] = incidentsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        camera: cameraMap[data.cameraId], 
      } as Incident;
    });

    setIncidents(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolve = async (id: string) => {
    setIncidents((prev) => prev.filter((inc) => inc.id !== id));
    const ref = doc(db, 'incidents', id);
    await updateDoc(ref, { resolved: true });
  };

  if (loading) {
    return <div className="p-4 text-white">Loading incidents...</div>;
  }

  return (
    <div className="w-1/3 bg-[#181818] text-white p-4 overflow-y-auto rounded shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-red-500">⚠️</span>
        {incidents.length} Unresolved Incidents
      </h2>

      {incidents.length === 0 && (
        <div className="text-gray-400 text-center">
          🎉 All incidents resolved!
        </div>
      )}

      {incidents.map((inc) => (
        <div
          key={inc.id}
          className="flex items-center gap-2 mb-3 bg-[#222] rounded-lg p-2 hover:bg-[#2a2a2a] transition"
        >
          
          <img
            src={inc.thumbnailUrl}
            alt=""
            className="w-20 h-16 object-cover rounded-md"
          />

         
          <div className="flex-1">
            <div className="flex items-center gap-1 text-sm font-medium">
              <span>
                {inc.type === 'Gun Threat' ? '🔫' : '🚷'}
              </span>
              {inc.type}
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              📷 {inc.camera?.name || inc.cameraId}
            </div>
            <div className="text-xs text-gray-500">
              {inc.tsStart} – {inc.tsEnd}
            </div>
          </div>

          
          <button
            onClick={() => handleResolve(inc.id)}
            className="text-green-500 text-sm hover:underline"
          >
            Resolve
          </button>
        </div>
      ))}
    </div>
  );
}
