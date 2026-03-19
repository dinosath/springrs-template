# SolidJS Admin Dashboard

A modern admin dashboard built with SolidJS, Tailwind CSS, and BasecoatUI for CRUD operations.

## Features

- 🚀 **SolidJS** - Fast, reactive UI framework
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **BasecoatUI** - Headless UI components
- 📊 **TanStack Query** - Powerful data fetching and caching
- 🔐 **Authentication** - JWT/OIDC support
- 📝 **CRUD Operations** - Full create, read, update, delete functionality
- 🌙 **Dark Mode** - Built-in theme toggle
- 📱 **Responsive** - Mobile-friendly design

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

## Project Structure

```
src/
├── components/
│   ├── crud/         # CRUD operation components
│   ├── layout/       # Layout components (Sidebar, Header)
│   └── ui/           # UI primitives (Button, Input, Table, etc.)
├── lib/
│   ├── auth.ts       # Authentication provider
│   ├── dataProvider.ts # API data provider
│   └── utils.ts      # Utility functions
├── pages/            # Page components
├── App.tsx           # Main app component
├── index.css         # Global styles
└── index.tsx         # Entry point
```

## API Integration

The admin dashboard expects a REST API with the following endpoints:

- `GET /api/{resource}` - List items
- `GET /api/{resource}/:id` - Get single item
- `POST /api/{resource}` - Create item
- `PUT /api/{resource}/:id` - Update item
- `DELETE /api/{resource}/:id` - Delete item

### Query Parameters

- `page` - Page number (1-based)
- `per_page` - Items per page
- `sort` - Sort field
- `order` - Sort order (asc/desc)
- `search` - Search query

## License

MIT
