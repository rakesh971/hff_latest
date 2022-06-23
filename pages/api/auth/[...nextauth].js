import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Api } from "../../../Common/Api";
import https from "https";
import http from "http";

const httpsAgent = new https.Agent({
  	rejectUnauthorized: false,
});
const httpAgent = new http.Agent({
  	rejectUnauthorized: false,
});

export default NextAuth({
	session: {
		jwt: true,
	},
	providers: [
		CredentialsProvider({
			name: "Login",
			id: "login-domain",
			async authorize(credentials) {
				const res = await fetch(Api.baseurl('auth/login', ''), {
				method: "POST",
				body: JSON.stringify({
					username: credentials.username,
					password: credentials.password,
				}),
				headers: {	
					"Content-Type": "application/json" },
					agent: httpAgent,
				});
				const user = await res.json();
				if (user.error === 1) {
					return {
						...user.data,
						...user.token,
					};
				}
				if (user) {
					throw new Error(user.msg);
				}
				throw new Error("Something went wrong!");
			},
		}),
		CredentialsProvider({
			name: "Register",
			id: "signup-domain",
			async authorize(credentials) {
				const user = JSON.parse(credentials.data);
				return {
				...user.data,
				...user.token,
				};
			},
		}),
		CredentialsProvider({
			name: "Refresh",
			id: "refresh-domain",
			async authorize(credentials) {
				const user = JSON.parse(credentials.data);
				let token = user.user.token;
				return {
				...user.user,
				token,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			token.user = user || token.user;
			return token;
		},
		async session({ session, token }) {
			session.user = token.user || session.user;
			return session;
		},
	},
});
