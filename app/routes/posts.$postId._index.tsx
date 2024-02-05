import type { MetaFunction, LoaderFunctionArgs} from "@remix-run/cloudflare";
import {redirect, json, } from '@remix-run/cloudflare'
import ReactMarkdown from 'react-markdown'
import { Form, useActionData, useNavigation,useLoaderData, Link } from "@remix-run/react";


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
  const loaderData = useLoaderData<typeof loader>()
  console.log(loaderData,32)
  return (
    <div className="p-12">
      <div className="mb-3">
        <Link to="edit" className="underline">编辑</Link>
      </div>
      <div className="prose">
        <h1>{loaderData.title}</h1>
        <ReactMarkdown>{loaderData.content}</ReactMarkdown>
      </div>
    </div>
  )
}