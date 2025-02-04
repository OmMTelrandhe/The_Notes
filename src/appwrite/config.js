import {Client, Databases, Account, ID} from "appwrite";

// import { OAuthProvider } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_ENDPOINT)
    .setProject(import.meta.env.VITE_PROJECT_ID);

const databases = new Databases(client);
const account = new Account(client);

const collections = [
  {
    name: "notes",
    id: import.meta.env.VITE_COLLECTION_NOTES_ID,
    dbId: import.meta.env.VITE_DATABASE_ID,
  },
  {
    name: "users",
    id: import.meta.env.VITE_COLLECTION_USERS_ID,
    dbId: import.meta.env.VITE_DATABASE_ID,
  }
];

// Authentication methods
const authService = {
  async signup(email, password, name) {
    try {
      // Validate inputs
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // Password strength validation
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Create account
      const newUser = await account.create(ID.unique(), email, password, name);
      
      // Optionally, create a session after signup
      await account.createEmailPasswordSession(email, password);
      
      return newUser;
    } catch (error) {
      console.error("Signup error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // More specific error handling
      if (error.code === 409) {
        throw new Error("An account with this email already exists");
      } else if (error.code === 400) {
        throw new Error("Invalid signup details. Please check your inputs.");
      }
      
      throw error;
    }
  },


  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // List and delete all existing sessions before creating a new one
      try {
        const sessions = await account.listSessions();
        for (const session of sessions.sessions) {
          await account.deleteSession(session.$id);
        }
      } catch (sessionError) {
        console.warn("Error managing existing sessions:", sessionError);
      }
      
      // Explicitly use createEmailPasswordSession
      const session = await account.createEmailPasswordSession(email, password);
      console.log("Login successful:", session);
      return session;
    } catch (error) {
      console.error("Login error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw error;
    }
  },

  async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  async createUserAfterGoogleSignup(user) {
    try {
      // Validate user object more thoroughly
      if (!user || !user.$id || !user.email) {
        throw new Error("Invalid user data for database creation");
      }

      // Ensure we have the users collection ID
      const usersCollection = collections.find(col => col.name === 'users');
      if (!usersCollection) {
        throw new Error("Users collection not configured");
      }

      // Check if user document already exists to prevent duplicates
      const existingUsers = await databases.listDocuments(
        usersCollection.dbId,
        usersCollection.id,
        [`email == "${user.email}"`]
      );

      // If user already exists, return existing document
      if (existingUsers.documents.length > 0) {
        return existingUsers.documents[0];
      }

      // Create new user document
      const userDocument = await databases.createDocument(
        usersCollection.dbId,
        usersCollection.id,
        user.$id,
        {
          userId: user.$id,
          email: user.email,
          name: user.name || user.email.split('@')[0], // Fallback name if not provided
          provider: 'google',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        // Add read and write permissions for the user
        [
          `user:${user.$id}`
        ]
      );

      return userDocument;
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  },
};

// const OAuth = new OAuthProvider(
//   client,
//   "google",
//   "https://accounts.google.com",
//   "https://accounts.google.com/.well-known/openid-configuration",
//   // "https://accounts.google.com/o/oauth2/v2/auth",
//   // "https://oauth2.googleapis.com/token",
//   // "https://openidconnect.googleapis.com",
//   // "https://accounts.google.com/.well-known/openid-configuration",
//   // "googleusercontent.com"
//   "https://accounts.google.com/o/oauth2/auth",
//   "https://accounts.google.com/o/oauth2/token"
// );

export {
  client,
  databases,
  collections,
  account,
  authService,
  // OAuth,
  ID,
};