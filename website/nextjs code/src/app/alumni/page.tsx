'use client';

import { useEffect, useState } from 'react';
import { getAllAlumni } from '@/app/database/dbops'; // adjust import path as needed
import { AlumniRecord } from '@/lib/types';
// adjust path as needed
// import { Timestamp } from 'firebase/firestore';

export default function AlumniPage() {
    const [alumni, setAlumni] = useState<(AlumniRecord & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAlumni() {
            try {
                const data = await getAllAlumni();
                // Sort by passedOutYear (newest first)
                data.sort((a, b) => b.passedOutYear - a.passedOutYear);
                setAlumni(data);
            } catch (err) {
                console.error('Error fetching alumni:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchAlumni();
    }, []);

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Alumni Directory</h1>

            {loading ? (
                <p className="text-neutral-600">Loading alumni...</p>
            ) : alumni.length === 0 ? (
                <p className="text-neutral-600">No alumni registered yet.</p>
            ) : (
                <div>
                    <div className='m-2 p-2'>
                        Total alumni registered : {alumni.length - 2}
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alumni.map((a) => (
                            <div
                                key={a.id}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                            >
                                <h2 className="text-lg font-semibold text-neutral-900">{a.fullName}</h2>
                                <p className="text-sm text-neutral-700">
                                    {a.joinedYear} - {a.passedOutYear} | {a.joinedClass} - {a.passedOutClass}
                                </p>

                                <div className="mt-2 text-sm text-neutral-700 space-y-1">
                                    <p>
                                        <span className="font-medium">Profession:</span> {a.profession}
                                    </p>
                                    {a.organisationName && (
                                        <p>
                                            <span className="font-medium">Organisation:</span> {a.organisationName}
                                        </p>
                                    )}
                                    <p>
                                        <span className="font-medium">City:</span> {a.currentCity}, {a.currentState}
                                    </p>
                                    <p>
                                        <span className="font-medium">Email:</span> {a.email}
                                    </p>
                                    <p>
                                        <span className="font-medium">Mobile:</span> {a.mobile}
                                    </p>
                                </div>

                                <div className="mt-3">
                                    <span
                                        className={`inline-block px-2 py-1 text-xs rounded-full ${a.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : a.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {a.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
