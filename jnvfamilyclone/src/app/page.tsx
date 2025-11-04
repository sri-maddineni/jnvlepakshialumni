"use client"
import Link from "next/link";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import AlumniSuggestionModal from "../components/Modals/AlumniSuggestionModal";
import NetworkStats from "../components/NetworkStats";

export default function Home() {
  // const { isSignedIn } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const { user, isSignedIn } = useUser();

  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  // Check if the current user is a registered alumni
  React.useEffect(() => {
    async function checkRegistration() {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
        setIsRegistered(false);
        return;
      }
      const { isUserRegisteredAlumni } = await import("../firebase/firebaseops");
      const registered = await isUserRegisteredAlumni(user.primaryEmailAddress.emailAddress);
      setIsRegistered(registered);
    }
    checkRegistration();
  }, [isSignedIn, user?.primaryEmailAddress?.emailAddress]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-fit bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-4 text-center">Welcome to <br /> <span className="text-blue-500">JNV Alumni Network</span></h1>
        <p className="text-lg text-gray-700 max-w-xl text-center mb-8">
          Connect, share, and grow with fellow alumni from Jawahar Navodaya Vidyalaya. Discover stories, stay updated, and be part of a vibrant community that celebrates our shared legacy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full justify-center">
          {!isRegistered
            && <Link href="/alumni/register" className=" bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-green-700 transition text-center font-semibold">Register</Link>}
          <Link href="/" onClick={() => {
            if (isSignedIn) {
              setModalOpen(true);
            } else {
              alert("Please sign in to suggest an alumni.");
            }
          }}
            className=" bg-green-600 text-white px-4 py-3 rounded-lg shadow hover:bg-yellow-500 transition text-center font-semibold">Suggest an Alumni</Link>
          <Link href="/contact" className=" bg-red-500 text-white px-5 py-3 rounded-lg shadow hover:bg-red-600 transition text-center font-semibold">Contact</Link>
        </div>
        {/* {(
          <button
            className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
            onClick={() => {
              if (isSignedIn) {
                setModalOpen(true);
              } else {
                alert("Please sign in to suggest an alumni.");
              }
            }}
          >
            Suggest an Alumni
          </button>
        )} */}
        <div className="w-full bg-yellow-400 p-6 rounded-xl shadow text-center">
          <h2 className="text-2xl font-semibold mb-2 text-red-800">Join the Network</h2>
          <p className="text-gray-800 mb-4">Are you a JNV alumnus? Stay connected and help us build a stronger community. Share your journey, achievements, and memories with us!</p>
          <Link href="/alumni" className="inline-block bg-red-400 text-gray-900 px-5 py-2 rounded-lg hover:bg-green-700 transition font-semibold">View Alumni Directory</Link>
        </div>
      </div>
      <AlumniSuggestionModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {/* <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
        <NetworkStats />
      </div> */}
      <NetworkStats />

    </main >
  );
}
