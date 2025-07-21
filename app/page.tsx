'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';
import IncidentPlayer from './components/IncidentPlayer';
import IncidentList from './components/IncidentList';
import Navbar from './components/Navbar';

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
  videoUrl?: string;
  camera?: Camera;
}

export default function Home() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [activeCamera, setActiveCamera] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);

    
    const camerasSnap = await getDocs(collection(db, 'cameras'));
    const cameraMap: Record<string, Camera> = {};
    const camerasArr: Camera[] = [];

    camerasSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const camera: Camera = { id: docSnap.id, ...data };
      cameraMap[docSnap.id] = camera;
      camerasArr.push(camera);
    });

    const incidentsSnap = await getDocs(
      query(collection(db, 'incidents'), where('resolved', '==', false))
    );

    const incidentsArr: Incident[] = incidentsSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      const incident: Incident = {
        id: docSnap.id,
        ...data,
        camera: cameraMap[data.cameraId] ?? {
          id: '',
          name: 'Unknown',
          location: '',
        },
      };
      return incident;
    });

    setCameras(camerasArr);
    setIncidents(incidentsArr);
    setActiveIncident(incidentsArr[0] || null);
    setActiveCamera(incidentsArr[0]?.cameraId || '');
    setLoading(false);
  };

  const handleResolve = async (id: string) => {
    setIncidents((prev) => prev.filter((inc) => inc.id !== id));
    const ref = doc(db, 'incidents', id);
    await updateDoc(ref, { resolved: true });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading incidents & cameras…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <IncidentPlayer
          incident={activeIncident}
          cameras={cameras}
          activeCamera={activeCamera}
          onCameraSelect={(id) => setActiveCamera(id)}
        />
        <IncidentList
          incidents={incidents}
          onResolve={handleResolve}
          onSelectIncident={(incident) => {
            setActiveIncident(incident);
            setActiveCamera(incident.cameraId);
          }}
        />
      </div>
    </div>
  );
}
