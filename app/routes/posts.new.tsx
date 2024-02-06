import { Button, Input, Textarea } from "@nextui-org/react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { MetaFunction, LoaderArgs, ActionFunctionArgs } from "@remix-run/cloudflare";
import {redirect, json, } from '@remix-run/cloudflare'

interface Env {
    H_B: KVNamespace;
    MY_DB: D1Database;
}

export const action = async (c: ActionFunctionArgs) => {
    // 使用 `formData()` 获取表单数据
    const env = c.context.env as Env
    const formData = await c.request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
  
    if (!title) {
        return json({
          success: false,
          errors: {
            slug: "",
            title: "必须填写标题",
            content: ""
          }
        })
      }
      if (!content) {
        return json({
          success: false,
          errors: {
            slug: "",
            title: "",
            content: "必须填写内容"
          }
        })
      }

    const info = await env.MY_DB.prepare('INSERT INTO Post (title, content) VALUES (?1, ?2)')
        .bind(title, content)
        .run();
    if(info.success) {
        return redirect("/")
    }
}

export default function Page() {
    const actionData = useActionData<typeof action>()
    const navigation = useNavigation()
    const errors = actionData?.errors
    return (
        <div>
        <Form method="POST">
            <div className="flex flex-col gap-3 p-12">
            <h1 className="text-xl font-black">发布文章</h1>
            <Input isInvalid={!!errors?.title} errorMessage={errors?.title} name="title" label="文章标题" />
            <Textarea isInvalid={!!errors?.content} errorMessage={errors?.content} name="content" label="内容" />
            <Button isLoading={navigation.state === 'submitting'} type="submit" color="primary">
                发布
            </Button>
            </div>
        </Form>
        </div>
    )
}