import { createCookieSessionStorage } from "@remix-run/cloudflare";

export type UserSessionData = {
  username: string
}

export const userSessionStorage = (env: any) =>
  createCookieSessionStorage<UserSessionData>(
    {
      cookie: {
        name: "__session",
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 过期时间，这里为一天
        path: "/",
        sameSite: "lax",
        // 加密密钥
        secrets: [env.SESSION_SECRET as string],
        secure: true,
      },
    }
  );

  export const auth = async (request: Request, env: any) => {
    const session = await userSessionStorage(env).getSession(request.headers.get("Cookie"));
    return {
      username: session.get("username"),
    } as UserSessionData
  }