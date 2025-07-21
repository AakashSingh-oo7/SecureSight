'use client';

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

interface Props {
  incidents: Incident[];
  onResolve: (id: string) => void;
  onSelectIncident: (incident: Incident) => void;
}

export default function IncidentList({
  incidents,
  onResolve,
  onSelectIncident,
}: Props) {
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
          onClick={() => onSelectIncident(inc)}
          className="flex items-center gap-2 mb-3 bg-[#222] rounded-lg p-2 hover:bg-[#2a2a2a] transition cursor-pointer"
        >
          <img
            src={inc.thumbnailUrl}
            alt=""
            className="w-20 h-16 object-cover rounded-md"
          />

          <div className="flex-1">
            <div className="flex items-center gap-1 text-sm font-medium">
              <span>{inc.type === 'Gun Threat' ? '🔫' : '🚷'}</span>
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
            onClick={(e) => {
              e.stopPropagation();
              onResolve(inc.id);
            }}
            className="text-green-500 text-sm hover:underline"
          >
            Resolve
          </button>
        </div>
      ))}
    </div>
  );
}
