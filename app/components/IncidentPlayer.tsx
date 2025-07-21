'use client';

import React from 'react';

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
}

interface IncidentPlayerProps {
  incident: Incident | null;
  cameras: Camera[];
  activeCamera: string;
  onCameraSelect: (id: string) => void;
}

export default function IncidentPlayer({
  incident,
  cameras,
  activeCamera,
  onCameraSelect,
}: IncidentPlayerProps) {
  const fallbackImage = '/incident1.jpg';

  return (
    <div className="flex-1 bg-black p-4 text-white relative">
      <h2 className="text-xl font-semibold mb-2">Incident Player</h2>


      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden rounded-lg border border-gray-700">
        {incident?.videoUrl ? (
          <video controls className="w-full h-full object-cover">
            <source src={incident.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={incident?.thumbnailUrl || fallbackImage}
            alt="Incident"
            className="w-full h-full object-cover"
          />
        )}

     
        <div className="absolute bottom-2 right-2 flex gap-3 bg-black/70 p-2 rounded-lg">
          {cameras.map((cam) => (
            <div
              key={cam.id}
              onClick={() => onCameraSelect(cam.id)}
              className={`cursor-pointer bg-gray-800 text-white w-28 h-16 flex items-center justify-center text-center text-xs p-1 rounded shadow ${
                activeCamera === cam.id
                  ? 'ring-2 ring-blue-400'
                  : 'hover:ring-2 hover:ring-gray-500'
              }`}
            >
              {cam.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
