# PartySnap - Agent Development Guide

## Build, Lint & Test Commands

### Root (Mono-repo)
```bash
pnpm dev          # Run all apps
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm test         # Test all apps
```

### Frontend (React + TypeScript)
```bash
pnpm --filter frontend dev              # Dev server
pnpm --filter frontend build            # Production build (tsc + vite)
pnpm --filter frontend lint             # ESLint with @eslint/js, typescript-eslint
pnpm --filter frontend lint:fix         # ESLint auto-fix
pnpm --filter frontend typecheck        # TypeScript check (tsc --noEmit)
```

### Backend (Laravel + PHP 8.2)
```bash
# Development
php artisan serve                       # Dev server
composer dev                            # Concurrent: serve, queue, logs, vite

# Testing
php artisan test                        # PHPUnit tests
php artisan test --filter <Test>        # Single test class
php artisan test --filter <Test>::<method> # Single test method
php artisan test --coverage             # Coverage report

# Code Quality
./vendor/bin/pint                       # Laravel Pint (format code)
./vendor/bin/pint --test                # Check style only
./vendor/bin/phpstan analyse            # Static analysis
```

---

## Frontend Code Style (React 19 + TypeScript 5.9)

### Import Order
1. React imports
2. Third-party libraries
3. Internal aliases (`@/components`, `@/lib`)
4. Relative imports
5. TypeScript types

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PhotoCard } from './PhotoCard';
import type { Photo } from '@/types';
```

### Component Guidelines
- Functional components with hooks only (no classes)
- PascalCase for components, camelCase for functions
- TypeScript interfaces for props (use `readonly` for immutable props)
- Extract reusable logic to `use-*.ts` hooks
- Keep components under 200 lines
- Use `className` prop with `cn()` utility for styling

```typescript
interface PhotoCardProps {
  readonly photo: Photo;
  onDelete?: (id: string) => void;
  className?: string;
}

export function PhotoCard({ photo, onDelete, className }: PhotoCardProps) {
  return <motion.div className={cn('relative', className)}>...</motion.div>;
}
```

### TypeScript Rules
- Use `interface` for object shapes, `type` for unions
- Avoid `any`; use `unknown` if truly unknown
- Export types used across modules

### State Management & Error Handling
- Use SWR for server state (already configured)
- Keep state local when possible
- Always handle Promise rejections with user-friendly messages
- Implement retry logic for failed uploads

### Performance
- Use `React.memo()` for expensive renders
- Lazy load routes with `React.lazy()`
- Use `Promise.all()` for independent async operations

---

## Backend Code Style (Laravel 12 + PHP 8.2)

### Naming Conventions
- Classes: PascalCase (`PhotoController`, `CloudinaryService`)
- Methods: camelCase (`uploadPhoto`)
- Variables: snake_case (`$guest_name`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- DB tables: snake_case, plural (`photos`)
- DB columns: snake_case (`cloudinary_public_id`)

### Controller Structure
- Thin controllers - delegate logic to services
- Use Form Request classes for validation
- Return JSON with API Resources
- Use route model binding

```php
class PhotoController extends Controller
{
    public function __construct(private CloudinaryService $cloudinary) {}

    public function store(UploadPhotoRequest $request)
    {
        $photo = $this->cloudinary->upload($request->file('photo'));
        return response()->json(['data' => new PhotoResource($photo)], 201);
    }
}
```

### Service Layer & Validation
- Extract business logic to services
- Use dependency injection (constructor property promotion)
- Type hint all parameters and return types
- Form Request classes for all inputs with clear validation rules

### API Responses & Database
- Use Laravel API Resources for consistent JSON responses
- Include proper HTTP status codes
- Use migrations for schema changes
- Add indexes for queried columns
- Eager load relationships (avoid N+1)

---

## UI/UX Guidelines

### Design System
- **Theme**: "Elegante Celebration" - Gold (#d4af37), Champagne (#f7e7ce), Black
- **Fonts**: Playfair Display (headings), system-ui (body)
- **Components**: shadcn/ui as base, extend for party features
- **Animation**: framer-motion (keep under 300ms, respect `prefers-reduced-motion`)

### Accessibility
- Semantic HTML (`<button>`, `<label>`)
- Alt text for images
- WCAG AA contrast ratios
- Min tappable size: 44x44px

---

## Git Workflow

### Commit Messages
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `docs:` - Documentation
- `chore:` - Maintenance

### Branch Naming
- `feature/` - Features (`feature/upload-modal`)
- `fix/` - Bug fixes (`fix/compression-error`)
- `refactor/` - Refactoring (`refactor/api-layer`)

---

## Testing

### Frontend
- Unit tests for utilities
- Component tests for UI
- Test hooks separately
- Aim for 70%+ coverage

### Backend
- Feature tests for endpoints
- Unit tests for services
- Mock external services (Cloudinary)
- Use database transactions

---

## Available Skills

```bash
skill vercel-react-best-practices  # React performance (57 rules)
skill frontend-design               # UI/UX guidance
skill laravel-specialist            # Laravel 10+ best practices
```

**When to use:**
- React components → `vercel-react-best-practices` + `frontend-design`
- Backend code → `laravel-specialist`
- UI/styling → `frontend-design`
- Performance → `vercel-react-best-practices`
