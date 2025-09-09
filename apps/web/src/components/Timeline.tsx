'use client';

const times = [
  '6:00 AM - 7:00 AM',
  '7:00 AM - 8:00 AM',
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
  '8:00 PM - 9:00 PM',
  '9:00 PM - 10:00 PM',
];

export default function Timeline() {
  return (
    <div className="flex flex-col space-y-2 p-4 max-w-4xl mx-auto">
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">
          No routines scheduled for today.
        </p>
      </div>
      {times.map((time) => (
        <div
          key={time}
          className="border border-gray-300 p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="text-sm font-medium text-gray-900">{time}</div>
          <div className="h-16 bg-gray-50 rounded mt-2 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Empty slot</span>
          </div>
        </div>
      ))}
    </div>
  );
}
