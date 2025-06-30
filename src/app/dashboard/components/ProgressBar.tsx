"use client";
export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div
        className="bg-primary h-4 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 