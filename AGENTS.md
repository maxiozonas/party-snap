# PartySnap - Agent Development Guide

## Build, Lint & Test Commands

### Root (Mono-repo)
```bash
# Run all apps in development
pnpm dev

# Build all apps
pnpm build

# Run linting for all apps
pnpm lint

# Run tests for all apps
pnpm test
```

### Frontend (apps/frontend)
```bash
# Development server with hot reload
pnpm --filter frontend dev

# Build for production
pnpm --filter frontend build

# Preview production build
pnpm --filter frontend preview

# Run ESLint
pnpm --filter frontend lint

# Run ESLint with auto-fix
pnpm --filter frontend lint:fix

# Run TypeScript type checking
pnpm --filter frontend typecheck

# Run tests (Vitest)
pnpm --filter frontend test

# Run single test file
pnpm --filter frontend test <path-to-test-file>

# Run tests in watch mode
pnpm --filter frontend test:watch

# Run tests with coverage
pnpm --filter frontend test:coverage
```

### Backend (apps/backend)
```bash
# Development server
php artisan serve

# Run Laravel tests
php artisan test

# Run single test file
php artisan test --filter <TestClassName>

# Run single test method
php artisan test --filter <TestClassName>::<testMethodName>

# Run tests with coverage
php artisan test --coverage

# Code analysis (Larastan)
./vendor/bin/phpstan analyse

# Format code (Pint)
./vendor/bin/pint

# Check code style (Pint - dry-run)
./vendor/bin/pint --test
```

---

## Available Skills

### When to Use Skills

This repository has access to specialized development skills that provide detailed guidance for writing production-grade code. **Always load the appropriate skill before starting development work**:

**Workflow:**
1. **Before writing React components**: Load `vercel-react-best-practices` + `frontend-design`
2. **Before writing Laravel code**: Load `laravel-specialist`
3. **Before creating UI/styling**: Load `frontend-design` (if not already loaded)
4. **Before performance optimization**: Load `vercel-react-best-practices` (if not already loaded)

**Available Skills:**

**1. Vercel React Best Practices (`vercel-react-best-practices`)**
- **When to load**: Writing React components, implementing data fetching, optimizing performance, refactoring React code
- **What it provides**: 57 rules across 8 categories for React/Next.js optimization
- **Key areas**: Eliminating waterfalls, bundle optimization, server/client performance, re-render optimization
- **Usage**:
  ```bash
  # Load before working on React performance
  skill vercel-react-best-practices
  ```

**2. Frontend Design (`frontend-design`)**
- **When to load**: Creating UI components, designing pages, building views, styling components
- **What it provides**: Guidance for distinctive, production-grade interfaces that avoid generic AI aesthetics
- **Key areas**: Typography, color systems, motion, spatial composition, visual details
- **Usage**:
  ```bash
  # Load before building UI components
  skill frontend-design
  ```

**3. Laravel Specialist (`laravel-specialist`)**
- **When to load**: Building Laravel applications with Eloquent ORM, API resources, queue systems, Livewire components, Sanctum authentication
- **What it provides**: Best practices for Laravel 10+ applications, modern PHP patterns
- **Key areas**: Eloquent relationships, API Resources, Service classes, Form Requests, Queue systems, Horizon queues
- **Usage**:
  ```bash
  # Load before writing backend code
  skill laravel-specialist
  ```

### Applying Skills During Development

**Before Writing React Components:**
```bash
# Load both skills for UI development
skill vercel-react-best-practices
skill frontend-design

# Apply Vercel rules:
- Use async-parallel for independent operations
- Use bundle-dynamic-imports for heavy components
- Use rerender-memo for expensive renders
- Use client-swr-dedup for API calls (already using SWR)

# Apply Frontend Design rules:
- Choose distinctive fonts (Playfair Display for display, avoid Inter/Space Grotesk)
- Commit to bold aesthetic (Elegante Celebration: gold/champagne/black)
- Add creative backgrounds (gradient meshes, noise textures, decorative borders)
- Use framer-motion for animations
```

**Before Writing Backend Code:**
```bash
# Load Laravel specialist skill
skill laravel-specialist

# Follow Laravel best practices from AGENTS.md
- Thin controllers with service layer
- Form Request classes for validation
- API Resources for responses
- Query scopes for common queries
```

---

## Frontend Code Style (React + TypeScript)

**Note**: These guidelines combine best practices from `vercel-react-best-practices` and `frontend-design` skills. Load both skills before writing React code for detailed optimization rules and design patterns.

### Import Order
1. React imports
2. Third-party libraries (external dependencies)
3. Internal aliases (`@/components`, `@/lib`, etc.)
4. Relative imports
5. TypeScript types (if separate)

```typescript
// ✅ Correct
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PhotoCard } from './PhotoCard';
import type { Photo } from '@/types';
```

### Component Guidelines
- Use functional components with hooks
- Prefer composition over prop drilling
- Use TypeScript for all props
- Name components with PascalCase
- Extract reusable logic into custom hooks (`use-*.ts`)
- Keep components under 200 lines; split if larger

```typescript
// ✅ Correct - component with proper typing
interface PhotoCardProps {
  photo: Photo;
  onDelete?: (id: string) => void;
  className?: string;
}

export function PhotoCard({ photo, onDelete, className }: PhotoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('relative group', className)}
    >
      {/* component content */}
    </motion.div>
  );
}
```

### TypeScript Best Practices
- Avoid `any`; use `unknown` if type is truly unknown
- Prefer `interface` for object shapes, `type` for unions/unions
- Use `strict` mode in tsconfig.json
- Export types that are used across modules
- Use readonly for immutable arrays

```typescript
// ✅ Correct
interface Photo {
  id: string;
  url: string;
  guestName?: string; // Optional property
  createdAt: Date;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// ✅ Correct - readonly for immutability
interface PhotoGridProps {
  readonly photos: readonly Photo[];
}
```

### State Management
- Use React Context for global state (theme, auth)
- Use SWR for server state (photos, API calls)
- Keep state local when possible
- Avoid prop drilling with Context or composition

```typescript
// ✅ Correct - SWR for API calls
export function usePhotos() {
  const { data, error, mutate } = useSWR<Photo[]>('/api/photos', fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: false,
  });
  return { photos: data, error, mutate };
}
```

### Error Handling
- Always handle Promise rejections
- Show user-friendly error messages
- Log errors for debugging
- Use error boundaries for React errors
- Implement retry logic for failed uploads

```typescript
// ✅ Correct
const uploadPhoto = async (file: File) => {
  try {
    const compressed = await compressImage(file);
    await api.upload(compressed);
    toast.success('Photo uploaded!');
  } catch (error) {
    console.error('Upload failed:', error);
    toast.error('Failed to upload. Please try again.');
    throw error; // Re-throw for caller to handle
  }
};
```

### Performance Optimization (Vercel React Best Practices)

Apply rules from `vercel-react-best-practices` skill:

**Critical Priority:**
- `async-parallel`: Use `Promise.all()` for independent API calls
- `async-defer-await`: Move `await` into branches where actually used
- `bundle-dynamic-imports`: Use `React.lazy()` for code splitting heavy routes
- `bundle-barrel-imports`: Import directly from files, avoid barrel imports
- `client-swr-dedup`: Use SWR for automatic request deduplication (already configured)

**High Priority:**
- `server-parallel-fetching`: Restructure components to parallelize data fetches
- `rerender-memo`: Extract expensive renders into memoized components
- `rerender-dependencies`: Use primitive dependencies in useEffect/useCallback
- `rerender-move-effect-to-event`: Put interaction logic in event handlers

**Medium Priority:**
- `rerender-defer-reads`: Don't subscribe to state only used in callbacks
- `rerender-functional-setstate`: Use functional setState for stable callbacks
- `rendering-hoist-jsx`: Extract static JSX outside components
- `js-cache-function-results`: Cache expensive function results

```typescript
// ✅ Correct - lazy loading (bundle-dynamic-imports)
const TVMode = lazy(() => import('./views/TVMode'));

// ✅ Correct - memo for expensive renders (rerender-memo)
export const PhotoGrid = memo(function PhotoGrid({ photos }: PhotoGridProps) {
  // heavy rendering logic
});

// ✅ Correct - parallel async operations (async-parallel)
const [photos, stats] = await Promise.all([
  fetchPhotos(),
  fetchStats()
]);

// ✅ Correct - hoist static JSX (rendering-hoist-jsx)
const staticHeader = <header className="fixed top-0">PartySnap</header>;

export function PhotoGrid() {
  return <div>{staticHeader}</div>;
}
```

---

## Backend Code Style (Laravel + PHP)

**Note**: These guidelines follow the `laravel-specialist` skill best practices for Laravel 10+ applications. Load the skill before writing backend code for detailed patterns and examples.

### Naming Conventions
- Classes: PascalCase (`PhotoController`, `CloudinaryService`)
- Methods: camelCase (`uploadPhoto`, `getApprovedPhotos`)
- Variables: snake_case (`$guest_name`, `$secure_url`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `CLOUDINARY_URL`)
- Database tables: snake_case, plural (`photos`, `failed_jobs`)
- Database columns: snake_case (`created_at`, `cloudinary_public_id`)

### Controller Guidelines
- Single responsibility per controller
- Keep controllers thin; move logic to services
- Use Form Request classes for validation
- Return consistent JSON responses
- Use route model binding where possible

```php
// ✅ Correct - thin controller with service layer
class PhotoController extends Controller
{
    public function __construct(
        private CloudinaryService $cloudinary
    ) {}

    public function store(UploadPhotoRequest $request)
    {
        $photo = $this->cloudinary->upload($request->file('photo'));
        
        return response()->json([
            'success' => true,
            'data' => new PhotoResource($photo)
        ], 201);
    }
}
```

### Service Layer
- Extract business logic to service classes
- Use dependency injection
- Keep methods focused and testable
- Handle external API calls here (Cloudinary)

```php
// ✅ Correct - service class
class CloudinaryService
{
    public function upload(UploadedFile $file): Photo
    {
        $uploaded = Cloudinary::upload($file->getRealPath());
        
        return Photo::create([
            'cloudinary_public_id' => $uploaded->getPublicId(),
            'secure_url' => $uploaded->getSecureUrl(),
            // ...
        ]);
    }
}
```

### Validation
- Use Form Request classes for validation
- Keep validation rules organized
- Provide clear error messages
- Validate file types, sizes, and dimensions

```php
// ✅ Correct - Form Request
class UploadPhotoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:8192',
            'guest_name' => 'nullable|string|max:20',
        ];
    }
}
```

### API Responses
- Use Laravel API Resources for consistent responses
- Include HTTP status codes
- Handle errors with proper status codes
- Support pagination for list endpoints

```php
// ✅ Correct - API Resource
class PhotoResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'url' => $this->secure_url,
            'guest_name' => $this->guest_name,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
```

### Database Best Practices
- Use migrations for schema changes
- Use seeders for test data
- Add indexes for frequently queried columns
- Use query scopes for common queries
- Eager load relationships to avoid N+1

```php
// ✅ Correct - migration with indexes
Schema::create('photos', function (Blueprint $table) {
    $table->id();
    $table->string('cloudinary_public_id');
    $table->text('secure_url');
    $table->string('guest_name')->nullable();
    $table->boolean('is_approved')->default(true);
    $table->timestamps();
    
    $table->index('created_at');
    $table->index('is_approved');
});

// ✅ Correct - query scope
class Photo extends Model
{
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }
}
```

---

## UI/UX Guidelines (Frontend Design)

**Note**: Apply principles from `frontend-design` skill before coding. Load the skill to access detailed guidance for creating distinctive, production-grade interfaces.

### Design Thinking

Follow this process from the `frontend-design` skill:

**Design Process:**
1. **Context**: Understand the purpose (party photo app, 50th birthday celebration)
2. **Tone**: Commit to a bold aesthetic - "Elegante Celebration" (gold/champagne/black, refined but festive)
3. **Constraints**: Mobile-first, real-time uploads, TV projection mode
4. **Differentiation**: What makes this UNFORGETTABLE? Distinctive typography, smooth animations, festive atmosphere

**Key Principles:**
- Choose distinctive fonts (avoid Inter/Space Grotesk overuse)
- Use unexpected color combinations and layouts
- Add creative backgrounds (gradient meshes, noise, decorative borders)
- Implement high-impact motion (page load animations, staggered reveals)
- Focus on ONE memorable element per view

### Design System
- Use shadcn/ui components as base
- Extend with custom components for party-specific features
- Maintain consistent spacing using Tailwind scale
- Use CSS variables for theme colors (gold, champagne, cream)

**Typography:**
```typescript
// Use distinctive fonts, not generic ones
font-family: 'Playfair Display', serif;  // Display headings
font-family: 'Geist', sans-serif;         // Body text
```

**Color Palette:**
```css
/* Elegant Celebration theme */
--gold-500: #d4af37;      /* Primary accent */
--champagne: #f7e7ce;     /* Secondary */
--cream: #f5f5dc;         /* Backgrounds */
--black: #0a0a0a;         /* Deep black */
```

**Visual Details:**
- Gradient meshes for backgrounds
- Subtle noise/grain textures
- Decorative borders (gold lines, frames)
- Confetti animations (subtle, not overwhelming)
- Shimmer effects on CTAs

### Accessibility
- Use semantic HTML (`<button>`, `<form>`, `<label>`)
- Include alt text for images
- Support keyboard navigation
- Ensure color contrast WCAG AA compliant
- Use ARIA labels where needed

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Test on real devices before deployment
- Ensure upload button is easily tappable (min 44x44px)

### Animation Guidelines (framer-motion)
- Use framer-motion for complex animations
- Keep animations under 300ms for interactions
- Add entry animations for photo grid (staggered)
- Include exit animations for deletions
- Respect `prefers-reduced-motion` media query

**High-Impact Moments:**
```typescript
// Staggered grid entry (one well-orchestrated animation)
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Shimmer effect on upload button
const shimmer = {
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
  animation: 'shimmer 2s infinite'
};
```

---

## Git Workflow

### Commit Messages
Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `style:` - Formatting, no logic change
- `test:` - Adding tests
- `docs:` - Documentation
- `chore:` - Maintenance tasks

### Branch Naming
- `feature/` - New features (`feature/upload-modal`)
- `fix/` - Bug fixes (`fix/compression-error`)
- `refactor/` - Refactoring (`refactor/api-layer`)
- `release/` - Release preparation

---

## Testing Philosophy

### Frontend Testing
- Unit tests for utility functions
- Component tests for UI interactions
- Integration tests for API calls
- Test hooks with @testing-library/react-hooks
- Aim for 70%+ coverage on core logic

### Backend Testing
- Unit tests for services and utilities
- Feature tests for API endpoints
- Test validation rules thoroughly
- Mock external services (Cloudinary)
- Test database operations with transactions

### General Principles
- Test user behavior, not implementation details
- Keep tests simple and readable
- Use descriptive test names
- One assertion per test when possible
- Avoid testing third-party libraries

---

## Practical Examples: Applying Skills to PartySnap

### Example 1: Building the Photo Upload Component
```bash
# Step 1: Load skills
skill vercel-react-best-practices
skill frontend-design

# Step 2: Apply Vercel optimization rules
# - Use bundle-dynamic-imports for the upload modal
# - Implement async-parallel for compression + upload
# - Add rerender-memo for the photo grid component

# Step 3: Apply Frontend Design rules
# - Design with "Elegante Celebration" aesthetic (gold/champagne)
# - Use Playfair Display for headings
# - Add shimmer animation to upload button
# - Implement staggered entry animation for uploaded photos
```

### Example 2: Creating the PhotoController
```bash
# Step 1: Load Laravel skill
skill laravel-specialist

# Step 2: Follow Laravel best practices
# - Create UploadPhotoRequest for validation
# - Create CloudinaryService for Cloudinary logic
# - Keep PhotoController thin (delegate to service)
# - Return PhotoResource for consistent JSON responses
# - Use query scopes for common queries (approved, recent)
```

### Example 3: Optimizing Photo Grid Performance
```bash
# Step 1: Load React performance skill
skill vercel-react-best-practices

# Step 2: Apply performance rules
# - Wrap PhotoCard in React.memo (rerender-memo)
# - Lazy load TVMode route (bundle-dynamic-imports)
# - Use SWR for data fetching with deduplication (client-swr-dedup)
# - Hoist static JSX outside component (rendering-hoist-jsx)
# - Use functional setState for stable callbacks (rerender-functional-setstate)
```

### Example 4: Designing the TV Mode View
```bash
# Step 1: Load frontend design skill
skill frontend-design

# Step 2: Apply design principles
# - Create immersive fullscreen experience
# - Implement smooth slideshow transitions with framer-motion
# - Add subtle ambient effects (gradient mesh background)
# - Ensure typography is legible from distance (large display font)
# - Add confetti animation for new photo highlights
```

---

## Quick Reference: Skill Commands

```bash
# Available skills in this repository
skill vercel-react-best-practices    # React/Next.js performance (57 rules)
skill frontend-design                 # UI/UX design guidance
skill laravel-specialist              # Laravel 10+ best practices

# Use skills before starting work:
# 1. Load relevant skill(s)
# 2. Follow guidelines in AGENTS.md
# 3. Apply patterns from skill documentation
# 4. Test and iterate
```
