# PartySnap - Agent Development Guide

## Build, Lint & Test Commands

### Root (Mono-repo)
```bash
pnpm dev          # Run all apps
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm test         # Test all apps
```

### Frontend (apps/frontend)
```bash
pnpm --filter frontend dev         # Dev server
pnpm --filter frontend build       # Production build
pnpm --filter frontend lint        # ESLint
pnpm --filter frontend lint:fix    # ESLint auto-fix
pnpm --filter frontend typecheck   # TypeScript check
pnpm --filter frontend test        # Run all tests
pnpm --filter frontend test <path> # Run single test file
pnpm --filter frontend test:watch  # Watch mode
pnpm --filter frontend test:coverage # Coverage report
```

### Backend (apps/backend)
```bash
php artisan serve                  # Dev server
php artisan test                   # All tests
php artisan test --filter <Test>   # Single test class
php artisan test --filter <Test>::<method> # Single test method
php artisan test --coverage        # Coverage
./vendor/bin/phpstan analyse       # Static analysis
./vendor/bin/pint                  # Format code
./vendor/bin/pint --test           # Check style only
```

---

## Frontend Code Style (React + TypeScript)

### Import Order
1. React imports
2. Third-party libraries
3. Internal aliases (`@/components`, `@/lib`)
4. Relative imports
5. TypeScript types

```typescript
// ✅ Correct
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PhotoCard } from './PhotoCard';
import type { Photo } from '@/types';
```

### Component Guidelines
- Functional components with hooks only
- TypeScript for all props (interfaces preferred)
- PascalCase for components, camelCase for functions
- Extract reusable logic to `use-*.ts` hooks
- Keep components under 200 lines
- Use `className` prop for flexibility with `cn()`

```typescript
// ✅ Correct
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
- Use `readonly` for immutable props
- Export types used across modules

### State Management
- Use SWR for server state (already configured)
- Keep state local when possible
- Avoid prop drilling (use composition)

### Error Handling
- Always handle Promise rejections
- Show user-friendly error messages
- Log errors for debugging
- Implement retry for failed uploads

### Performance (Vercel Best Practices)
- Use `React.memo()` for expensive renders
- Lazy load routes with `React.lazy()`
- Use `Promise.all()` for independent async operations
- Hoist static JSX outside components

---

## Backend Code Style (Laravel + PHP)

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
// ✅ Correct
class PhotoController extends Controller
{
    public function __construct(
        private CloudinaryService $cloudinary
    ) {}

    public function store(UploadPhotoRequest $request)
    {
        $photo = $this->cloudinary->upload($request->file('photo'));
        return response()->json(['data' => new PhotoResource($photo)], 201);
    }
}
```

### Service Layer
- Extract business logic to services
- Use dependency injection (constructor property promotion)
- Type hint all parameters and return types

### Validation
- Form Request classes for all inputs
- Clear validation rules and error messages
- Validate file types, sizes, dimensions

### API Responses
- Use Laravel API Resources
- Include proper HTTP status codes
- Consistent response structure

### Database
- Use migrations for schema changes
- Add indexes for queried columns
- Use query scopes for common queries
- Eager load relationships (avoid N+1)

---

## UI/UX Guidelines

### Design System
- **Theme**: "Elegante Celebration" - Gold (#d4af37), Champagne (#f7e7ce), Black
- **Fonts**: Playfair Display (headings), system-ui (body)
- **Components**: shadcn/ui as base, extend for party features
- **Spacing**: Tailwind scale (4px base unit)

### Animation (framer-motion)
- Keep interactions under 300ms
- Staggered grid entries for photos
- Smooth transitions for modals
- Respect `prefers-reduced-motion`

### Accessibility
- Semantic HTML (`<button>`, `<label>`)
- Alt text for images
- Keyboard navigation support
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
- Test validation thoroughly
- Use database transactions

---

## Available Skills

```bash
# Load skills before development
skill vercel-react-best-practices  # React performance (57 rules)
skill frontend-design               # UI/UX guidance
skill laravel-specialist            # Laravel 10+ best practices
```

**When to use:**
- React components → `vercel-react-best-practices` + `frontend-design`
- Backend code → `laravel-specialist`
- UI/styling → `frontend-design`
- Performance → `vercel-react-best-practices`
