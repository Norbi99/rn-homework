
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    bio: string;
    profilePicture: string;
    birthday: Date;
    preferences: {
        emailNotifications: boolean;
        pushNotifications: boolean;
    };
}

let mockUser: UserProfile = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software Developer',
    profilePicture: 'https://i.pravatar.cc/150?img=12',
    birthday: new Date(1995, 5, 15),
    preferences: {
        emailNotifications: true,
        pushNotifications: true,
    },
};

// API-simulation delay helper function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock APIs
export const fetchProfile = async (): Promise<UserProfile> => {
    await delay(1000);
    return mockUser;
};

export const updateProfile = async (updatedData: Partial<UserProfile>): Promise<UserProfile> => {
    await delay(1000);

    const isSuccess = Math.random() < 0.9;
    if (!isSuccess) throw new Error('Failed to update profile. Try again.');

    mockUser = {
        ...mockUser,
        ...updatedData,
    };

    return mockUser;
};

export const uploadProfilePicture = async (
    uri: string,
    onProgress?: (progress: number) => void): Promise<string> => {
    let progress = 0;
    while (progress < 100) {
        await delay(100);
        progress += 10;
        onProgress?.(progress);
    }

    mockUser.profilePicture = uri;
    return uri;
};
