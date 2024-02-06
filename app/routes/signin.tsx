import { Button, Input } from "@nextui-org/react";
import { Form , useActionData} from "@remix-run/react";
import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs} from "@remix-run/cloudflare";
import {redirect, json, } from '@remix-run/cloudflare'

import {userSessionStorage} from '../session.server'

interface Env {
    H_B: KVNamespace;
    MY_DB: D1Database;
}

export default function Page() {
    const actionData = useActionData<typeof action>()
    const errors = actionData?.errors
    return (
      <Form method="POST">
        <div className="p-12 flex flex-col gap-3">
          <Input isInvalid={!!errors?.username} errorMessage={errors?.username} label="用户名" name="username" />
          <Input type="password" label="密码" name="password" />
          <Button type="submit" color="primary">
            登录
          </Button>
        </div>
      </Form>
    )
}

export const action = async (c: ActionFunctionArgs) => {
    const formData = await c.request.formData();
  
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const env = c.context.env as Env
    console.log(env)
    const stmt = env.MY_DB.prepare('SELECT * from User WHERE username = ?').bind(username);

    const user = await stmt.first()


  
    if (!user || user.password !== password) {
      return json({
        success: false,
        errors: {
          username: "用户名密码不正确"
        }
      })
    }

    const session = await userSessionStorage(env).getSession(c.request.headers.get('Cookie'))  
    session.set("username", username) 

    return redirect("/", {
        headers: {
            'Set-Cookie': await userSessionStorage(env).commitSession(session)
        }
    })


  }