import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async signIn(params) {
      if (!params.user.email || !params.user.name || !params.user.image) {
        return false;
      }
      const user = await prisma.user.findUnique({
        where: {
          email: params.user.email,
        },
      });

      if (user) {
        return true;
      }

      await prisma.user.create({
        data: {
          email: params.user.email,
          name: params.user.name,
          image: params.user.image,
        },
      });
      return true;
    },
  },
});

export { handler as GET, handler as POST };
