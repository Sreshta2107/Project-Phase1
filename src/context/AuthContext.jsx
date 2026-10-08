import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getData, removeData, setData } from '../utils/storage';

const AuthContext = createContext(null);
const USERS_KEY = 'artGalleryUsers';
const CURRENT_USER_KEY = 'artGalleryCurrentUser';

const sampleUsers = [
  {
    id: 'sample-visitor',
    name: 'Gallery Visitor',
    email: 'visitor@example.com',
    password: 'visitor123',
    role: 'visitor',
    createdAt: '2026-01-01T00:00:00.000Z',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'I enjoy discovering original art and supporting independent artists.',
    followersCount: 0,
  },
  {
    id: 'sample-artist',
    name: 'Gallery Artist',
    email: 'artist@example.com',
    password: 'artist123',
    role: 'artist',
    createdAt: '2026-01-01T00:00:00.000Z',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    bio: 'I create expressive works inspired by color, movement, and memory.',
    followersCount: 0,
  },
  {
    id: 'sample-admin',
    name: 'Gallery Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'I help keep the gallery welcoming for artists and collectors.',
    followersCount: 0,
  },
];

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const storedUsers = getData(USERS_KEY);
    if (Array.isArray(storedUsers)) return storedUsers;
    setData(USERS_KEY, sampleUsers);
    return sampleUsers;
  });
  const [currentUser, setCurrentUser] = useState(() => getData(CURRENT_USER_KEY));

  useEffect(() => {
    setData(USERS_KEY, users);
  }, [users]);

  const login = useCallback((email, password) => {
    const matchingUser = users.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password
    );

    if (!matchingUser) return { success: false, error: 'Email or password is incorrect.' };

    setCurrentUser(matchingUser);
    setData(CURRENT_USER_KEY, matchingUser);
    return { success: true };
  }, [users]);

  const register = useCallback((userDetails) => {
    const email = userDetails.email.trim().toLowerCase();
    if (!['visitor', 'artist'].includes(userDetails.role)) {
      return { success: false, error: 'Choose Visitor or Artist as your account role.' };
    }
    if (users.some((user) => user.email.toLowerCase() === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: createId(),
      name: userDetails.name.trim(),
      email,
      password: userDetails.password,
      role: userDetails.role,
      createdAt: new Date().toISOString(),
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: userDetails.role === 'artist' ? 'New artist at the Online Art Gallery.' : 'Art enthusiast and gallery visitor.',
      followersCount: 0,
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);
    setCurrentUser(newUser);
    setData(CURRENT_USER_KEY, newUser);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    removeData(CURRENT_USER_KEY);
    setCurrentUser(null);
  }, []);

  const value = useMemo(() => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    register,
    logout,
  }), [currentUser, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;