import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs} from "@remix-run/cloudflare";
import {redirect, json, } from '@remix-run/cloudflare'
import { Form, useActionData, useNavigation,useLoaderData } from "@remix-run/react";
import crypto, { createHmac,  } from 'node:crypto';
import {Buffer} from 'node:buffer'


interface Env {
    H_B: KVNamespace;
    MY_DB: D1Database;
}
  

export const action = async (c: ActionFunctionArgs) => {
    // 使用 `formData()` 获取表单数据
    const postId = c.params.postId as string;
    const env = c.context.env as Env
    if (c.request.method === 'POST') {

        const headers = c.request.headers
        const secret = env.LEMON_SECRET as string;
    
        const body = await c.request.text()
        const jsonBody = JSON.parse(body)
        // const {data } = jsonBody
        console.log(jsonBody)
        const hmac = createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(body).digest('hex'), 'utf8');
        const signature = Buffer.from(headers.get('X-Signature') || '', 'utf8');

        if (!crypto.subtle.timingSafeEqual(digest, signature)) {
          throw new Response("Inavlid Signature", {
            status: 400
          })
        }


        // 判断商品 product id
        if (data.attributes?.first_order_item?.product_id !== env.LEMON_PRODUCT_ID) {
            throw new Response('商品ID不一致', {
                status: 404
            })
        }
        console.log(data.attributes?.first_order_item)
    
    }
    
    // const info = await env.MY_DB.prepare('DELETE FROM Post WHERE ID = ?').bind(postId)
    //     .run();
    // console.log(info)
    // if(info.success) {
    //     return redirect(`/`)
    // }
}