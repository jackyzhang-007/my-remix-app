import type { MetaFunction, LoaderArgs} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/cloudflare"

interface Env {
  PRODUCTS_KV: KVNamespace;
}

export const loader = async ({
  context,
  params,
}) => {
  // Bindings are accessible on context.env
  let env = context.env as Env
  return json(
    await env.PRODUCTS_KV.get<{ name: string }>(`memory_date`, {
      type: "json",
    })
  );
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};



export default function Index() {
  const product = useLoaderData<typeof loader>();

  if (!product) throw new Response(null, { status: 404 })
  console.log(product)
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
