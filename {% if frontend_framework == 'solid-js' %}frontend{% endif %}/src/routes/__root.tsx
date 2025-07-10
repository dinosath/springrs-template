/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'
import type * as Solid from 'solid-js'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'
import { routeTree } from '~/routeTree.gen'

function getRoutes(tree) {
  // If tree is an object with children, flatten recursively
  const routes = []
  function traverse(node) {
    if (node.path) {
      routes.push({
        path: node.path,
        label: node.label || node.path,
      })
    }
    if (node.children) {
      node.children.forEach(traverse)
    }
  }
  traverse(tree)
  return routes
}
export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
            'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function NavLinks() {
  const routes = getRoutes(routeTree)
  return (
      <div class="p-2 flex gap-2 text-lg">
        {routes.map(route => (
            <Link
                to={route.path}
                activeProps={{ class: 'font-bold' }}
                activeOptions={{ exact: route.path === '/' }}
            >
              {route.label}
            </Link>
        ))}
      </div>
  )
}

function RootDocument({ children }: { children: Solid.JSX.Element }) {
  return (
      <>
        <HeadContent />
        <div class="p-2 flex gap-2 text-lg">
          <NavLinks />
        </div>
        <hr />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </>
  )
}
