import { useNavigate } from "react-router-dom";

const meetings = [
  { id: "m1", title: "Sprint Planning" },
];

export default function MeetingsList() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-lg">
      {meetings.map((m) => (
        <div
          key={m.id}
          onClick={() => navigate(`/meetings/${m.id}`)}
          className="p-4 cursor-pointer hover:bg-gray-50"
        >
          {m.title}
        </div>
      ))}
    </div>
  );
}