import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const stored = (typeof window !== "undefined" && localStorage.getItem("ag-theme")) as "light" | "dark" | null;
        const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setTheme(initial);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try { localStorage.setItem("ag-theme", theme); } catch { }
    }, [theme]);

    return { theme, toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")) };
}



import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getServerConfig } from "../config.server";

// Example createServerFn. Server-side handler invoked from the client:
//   const result = await getGreeting({ data: { name: "Ada" } })
// The .handler body runs server-only — imports used only inside it (like
// .server.ts modules) are tree-shaken from the client bundle. Module-level
// code here still ships to the client; for truly server-only helpers, put
// them in a .server.ts file. Use this pattern instead of Supabase Edge
// Functions for server logic.

export const getGreeting = createServerFn({ method: "POST" })
    .inputValidator(z.object({ name: z.string().min(1) }))
    .handler(async ({ data }) => {
        const config = getServerConfig();
        return {
            greeting: `Hello, ${data.name}!`,
            mode: config.nodeEnv ?? "unknown",
        };
    });



import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
    return {
        nodeEnv: process.env.NODE_ENV,
        // Add server-only values here, e.g.:
        //   databaseUrl: process.env.DATABASE_URL,
        //   stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    };
}




// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;

function record(error: unknown) {
    lastCapturedError = { error, at: Date.now() };
}

if (typeof globalThis.addEventListener === "function") {
    globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
    globalThis.addEventListener("unhandledrejection", (event) =>
        record((event as PromiseRejectionEvent).reason),
    );
}

export function consumeLastCapturedError(): unknown {
    if (!lastCapturedError) return undefined;
    if (Date.now() - lastCapturedError.at > TTL_MS) {
        lastCapturedError = undefined;
        return undefined;
    }
    const { error } = lastCapturedError;
    lastCapturedError = undefined;
    return error;
}




export function renderErrorPage(): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}




import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}




/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'

const IndexRoute = IndexRouteImport.update({
    id: '/',
    path: '/',
    getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
    '/': typeof IndexRoute
}
export interface FileRoutesByTo {
    '/': typeof IndexRoute
}
export interface FileRoutesById {
    __root__: typeof rootRouteImport
    '/': typeof IndexRoute
}
export interface FileRouteTypes {
    fileRoutesByFullPath: FileRoutesByFullPath
    fullPaths: '/'
    fileRoutesByTo: FileRoutesByTo
    to: '/'
    id: '__root__' | '/'
    fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
    IndexRoute: typeof IndexRoute
}

declare module '@tanstack/react-router' {
    interface FileRoutesByPath {
        '/': {
            id: '/'
            path: '/'
            fullPath: '/'
            preLoaderRoute: typeof IndexRouteImport
            parentRoute: typeof rootRouteImport
        }
    }
}

const rootRouteChildren: RootRouteChildren = {
    IndexRoute: IndexRoute,
}
export const routeTree = rootRouteImport
    ._addFileChildren(rootRouteChildren)
    ._addFileTypes<FileRouteTypes>()




import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
    fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
    if (!serverEntryPromise) {
        serverEntryPromise = import("@tanstack/react-start/server-entry").then(
            (m) => (m.default ?? m) as ServerEntry,
        );
    }
    return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
    if (response.status < 500) return response;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return response;

    const body = await response.clone().text();
    if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
        return response;
    }

    console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
    return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
    });
}

export default {
    async fetch(request: Request, env: unknown, ctx: unknown) {
        try {
            const handler = await getServerEntry();
            const response = await handler.fetch(request, env, ctx);
            return await normalizeCatastrophicSsrResponse(response);
        } catch (error) {
            console.error(error);
            return new Response(renderErrorPage(), {
                status: 500,
                headers: { "content-type": "text/html; charset=utf-8" },
            });
        }
    },
};





import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
    try {
        return await next();
    } catch (error) {
        if (error != null && typeof error === "object" && "statusCode" in error) {
            throw error;
        }
        console.error(error);
        return new Response(renderErrorPage(), {
            status: 500,
            headers: { "content-type": "text/html; charset=utf-8" },
        });
    }
});

export const startInstance = createStart(() => ({
    requestMiddleware: [errorMiddleware],
}));





