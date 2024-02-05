import type { MetaFunction, LoaderFunctionArgs} from "@remix-run/cloudflare";
import { useLoaderData, Link, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/cloudflare"
import { Button, Input, Textarea, Pagination } from "@nextui-org/react";

interface Env {
  H_B: KVNamespace;
  MY_DB: D1Database;
}

const PAGE_SIZE = 3

export const loader = async ({
  context,
  params,
  request,
}: LoaderFunctionArgs) => {
  // Bindings are accessible on context.env
  let env = context.env as Env
  const search = new URL(request.url).searchParams
  const page = Number(search.get('page') || 1)
  const limit = PAGE_SIZE
  const offset = page === 1 ? 0 : PAGE_SIZE * (page -1)
  const stmt = env.MY_DB.prepare('SELECT * from Post ORDER BY created_at DESC LIMIT ?1 OFFSET ?2').bind(limit, offset);
  const sfmt_total = env.MY_DB.prepare('SELECT  COUNT(*) AS total from Post');
  const {total} = await sfmt_total.first();
  const {results = []} = await stmt.all();
  return json(
    // await env.H_B.get<{ name: string }>(`product-13`, {
    //   type: "json",
    // })
    // await env
    {
      posts: results,
      pageCount:  Math.ceil(total / PAGE_SIZE),
    }
  );
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};



export default function Index() {
  const {posts, pageCount} = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)
  if (!posts) throw new Response(null, { status: 404 })
  return (
    <div className="p-12 flex flex-col gap-4">
        {posts.map(post => {
          return (
            <div key={post.id}>
              <Link to={`/posts/${post.id}`} className="text-xl">
                {post.title}
              </Link>
              <div className="text-sm text-gray-400">
                {post.created_at}
              </div>
            </div>
          )
        })}
         <Pagination page={page} total={pageCount} onChange={page => {
          const newSearchParams = new URLSearchParams(searchParams)
          newSearchParams.set('page', String(page))
          setSearchParams(newSearchParams)
        }} />
      </div>
  );
}
