import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs} from "@remix-run/cloudflare";
import {redirect, json, } from '@remix-run/cloudflare'
import { Form, useActionData, useNavigation,useLoaderData } from "@remix-run/react";
import { Button, Input, Textarea, Pagination } from "@nextui-org/react";

interface Env {
    H_B: KVNamespace;
    MY_DB: D1Database;
}
  

export const action = async (c: ActionFunctionArgs) => {
    // 使用 `formData()` 获取表单数据
    const postId = c.params.postId as string;
    const env = c.context.env as Env

    const info = await env.MY_DB.prepare('DELETE FROM Post WHERE ID = ?').bind(postId)
        .run();
    console.log(info)
    if(info.success) {
        return redirect(`/`)
    }
}