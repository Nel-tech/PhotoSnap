import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { clientPromise } from "@/lib/mongodb"; // MongoDB connection
import bcrypt from "bcryptjs"; // Secure password handling

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }
        
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        
        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection("users").findOne({ email });

        if (!user) {
          throw new Error("User not found");
        }

        // Compare hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", 
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
