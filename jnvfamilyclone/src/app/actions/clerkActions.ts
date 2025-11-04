'use server';

import { clerkClient } from '@clerk/nextjs/server';

// In-memory cache for profile images
const profileImageCache = new Map<string, string | null>();

export async function getUserProfileImageByEmail(email: string): Promise<string | null> {
    // Check cache first
    if (profileImageCache.has(email)) {
        return profileImageCache.get(email) || null;
    }

    try {
        // Use Clerk's server-side client to get user by email
        const client = await clerkClient();
        const users = await client.users.getUserList({
            emailAddress: [email],
        });

        let imageUrl: string | null = null;
        if (users.data && users.data.length > 0) {
            const user = users.data[0];
            imageUrl = user.imageUrl || null;
        }

        // Cache the result (including null values to prevent repeated API calls)
        profileImageCache.set(email, imageUrl);

        return imageUrl;
    } catch (error) {
        console.error('Error fetching user profile image:', error);
        // Cache null to prevent repeated failed API calls
        profileImageCache.set(email, null);
        return null;
    }
}





export async function getMultipleUserProfileImages(emails: string[]): Promise<Record<string, string | null>> {
    try {
        const result: Record<string, string | null> = {};

        // Filter out emails that are already cached
        const uncachedEmails = emails.filter(email => !profileImageCache.has(email));

        // For cached emails, get from cache
        emails.forEach(email => {
            if (profileImageCache.has(email)) {
                result[email] = profileImageCache.get(email) || null;
            }
        });

        // Only fetch uncached emails
        if (uncachedEmails.length > 0) {
            const promises = uncachedEmails.map(async (email) => {
                const profileImage = await getUserProfileImageByEmail(email);
                return { email, profileImage };
            });

            const results = await Promise.all(promises);

            results.forEach(({ email, profileImage }) => {
                result[email] = profileImage;
            });
        }

        return result;
    } catch (error) {
        console.error('Error fetching multiple user profile images:', error);
        return {};
    }
}

// Function to clear cache (useful for testing or when cache gets too large)
export async function clearProfileImageCache(): Promise<void> {
    profileImageCache.clear();
}

// Function to get cache size (for monitoring)
export async function getProfileImageCacheSize(): Promise<number> {
    return profileImageCache.size;
} 