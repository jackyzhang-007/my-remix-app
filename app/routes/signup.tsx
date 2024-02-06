import { Button, Input } from "@nextui-org/react";
import { Form } from "@remix-run/react";
import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs} from "@remix-run/cloudflare";
import {redirect, json, } from '@remix-run/cloudflare'

interface Env {
    H_B: KVNamespace;
    MY_DB: D1Database;
}


export default function Page() {
  return (
    <Form method="POST">
      <div className="p-12 flex flex-col gap-3">
        <Input label="用户名" name="username" />
        <Input type="password" label="密码" name="password" />
        <Button type="submit" color="primary">
          注册
        </Button>
      </div>
    </Form>
  )
}

export const action = async (c: ActionFunctionArgs) => {
    const env = c.context.env as Env
    const formData = await c.request.formData()
    const username = formData.get("username") as string
    const password = formData.get("password") as string
  
    if (!username) {
        return json({
          success: false,
          errors: {
            slug: "",
            title: "必须填写用户名",
            content: ""
          }
        })
      }
      if (!password) {
        return json({
          success: false,
          errors: {
            slug: "",
            title: "",
            content: "必须填写密码"
          }
        })
      }

    const info = await env.MY_DB.prepare('INSERT INTO User (username, password) VALUES (?1, ?2)')
        .bind(username, password)
        .run();
    console.log(info)
    if(info.success) {
        return redirect("/signin")
    }
  }

