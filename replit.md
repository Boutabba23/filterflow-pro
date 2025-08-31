# Filter Management System

## Overview

This project is a comprehensive filter management system designed for construction or industrial equipment maintenance. The application provides a modern web interface for managing filters, engines, preventive maintenance schedules, and system configuration. Built with React and Express.js, it features a full-stack architecture with PostgreSQL database integration through Drizzle ORM.

The system enables users to track filter inventory, monitor engine maintenance schedules, manage preventive maintenance programs, and configure system settings through an intuitive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built using React with TypeScript and follows a modern component-based architecture:

- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system featuring construction industry color palette (steel blue, concrete gray, construction orange)
- **Component Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **Build Tool**: Vite for fast development and optimized production builds

The application uses a responsive design approach with mobile-first considerations, implementing custom responsive components and hooks for different screen sizes.

### Backend Architecture

The backend follows a RESTful API pattern using Express.js:

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js for HTTP server and middleware
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Development**: Custom Vite integration for hot module replacement in development
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

The server implements middleware for request logging, JSON parsing, and error handling, with separate route registration and storage abstraction.

### Data Storage Solutions

The system uses PostgreSQL as the primary database:

- **Database**: PostgreSQL via Neon serverless database
- **ORM**: Drizzle ORM with Zod schema validation
- **Migration**: Drizzle Kit for database schema management
- **Connection**: Neon serverless with WebSocket support for real-time capabilities

Database schema includes user management with username/password authentication. The storage layer is abstracted to allow for different implementations (currently in-memory for development).

### Authentication and Authorization

Basic user authentication system is implemented:

- **User Model**: Username and password-based authentication
- **Storage**: User data stored in PostgreSQL with unique username constraints
- **Session Management**: Prepared for session-based authentication (connect-pg-simple dependency present)

The system includes CRUD operations for user management through the storage interface.

### Design System and Theming

The application implements a comprehensive design system:

- **Theme**: Light/dark mode support with system preference detection
- **Color Palette**: Professional construction industry theme with steel blue primary, concrete gray secondary, and construction orange accent colors
- **Typography**: Tailwind CSS typography with custom font weights and sizes
- **Spacing**: Consistent spacing scale using Tailwind CSS utilities
- **Components**: Fully accessible components using Radix UI primitives

The theme provider manages theme state with localStorage persistence and CSS custom properties for dynamic color switching.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database with WebSocket support for real-time features
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect

### UI and Styling
- **Radix UI**: Comprehensive primitive components for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library based on Radix UI

### Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

### State Management and Data Fetching
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for form data and API responses

### Utility Libraries
- **clsx**: Conditional className utility
- **tailwind-merge**: Tailwind CSS class merging utility
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation

The application is configured for deployment on Replit with specific plugins and development tools for the Replit environment.