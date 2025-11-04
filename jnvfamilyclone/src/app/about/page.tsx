import React from 'react';
import GoBackButton from "../../components/GoBackButton";

export default function About() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <GoBackButton />
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-green-700">About JNV Alumni</h1>
        <p className="text-lg max-w-2xl text-center text-gray-700 mb-6">
          Welcome to the <span className="text-yellow-600 font-semibold">JNV Alumni Network</span>! This platform connects alumni from <span className="text-green-600 font-semibold">Jawahar Navodaya Vidyalaya</span>, fostering lifelong relationships, sharing memories, and building a strong community. Stay connected, share your journey, and contribute to the legacy of <span className="text-red-500 font-semibold">JNV</span>.
        </p>
        <div className="mt-4 p-4 bg-yellow-50 rounded-xl shadow text-center max-w-lg">
          <span className="text-green-700 font-medium">Together, we grow stronger!</span>
        </div>
      </div>
    </main>
  );
} 