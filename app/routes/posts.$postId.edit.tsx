import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs} from "@remix-run/cloudflare";
import {redirect, json, } from '@remix-run/cloudflare'
import ReactMarkdown from 'react-markdown'
import { Form, useActionData, useNavigation,useLoaderData } from "@remix-run/react";
import { Button, Input, Textarea, Pagination } from "@nextui-org/react";


interface Env {
    H_B: KVNamespace;
    MY_DB: D1Database;
  }
  

export const loader = async (c: LoaderFunctionArgs) => {
    const postId = c.params.postId as string;
    const env = c.context.env as Env
    const stmt = env.MY_DB.prepare('SELECT * from Post WHERE ID = ?').bind(postId);
    const post = await stmt.first()
    console.log(post)

    if (!post) {
      throw new Response("找不到文章", {
        status: 404
      })
    }
  
    return json(post)
}

export default function Page() {
    const loaderData: {id: string, title: string, content: string} = useLoaderData<typeof loader>()
  
    return (
      <div className="p-12">
        <Form method="POST">
          <div className="flex flex-col gap-3">
            <Input label="slug" name="slug" defaultValue={loaderData.id} />
            <Input label="标题" name="title" defaultValue={loaderData.title} />
            <Textarea minRows={10} label="正文" name="content" defaultValue={loaderData.content} />
            <Button type="submit" color="primary">更新</Button>
          </div>
        </Form>
      </div>
    )
}


export const action = async (c: ActionFunctionArgs) => {
    // 使用 `formData()` 获取表单数据
    const postId = c.params.postId as string;
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

    const info = await env.MY_DB.prepare('UPDATE Post SET title = ?1, content = ?2 WHERE ID = ?3').bind(title, content, postId)
        .run();
    if(info.success) {
        return redirect(`/posts/${postId}`)
    }
}