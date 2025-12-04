# UI/UX Guidelines - Bankard 2.0

## Design Philosophy

### Core Principles

1. **Mobile-First Design**
   - Design and build for mobile screens first
   - Progressively enhance for larger screens
   - Touch-friendly interactions

2. **Simplicity & Clarity**
   - Clean, uncluttered interfaces
   - Clear visual hierarchy
   - Easy-to-understand actions

3. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation support
   - Screen reader friendly

4. **Performance**
   - Fast loading times
   - Smooth animations
   - Responsive interactions

## Mobile-First Responsive Design

### Breakpoint Strategy

```css
/* Mobile-first approach */
.element {
  /* Base styles for mobile (320px+) */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Tablet portrait (640px+) */
@media (min-width: 640px) {
  .element {
    flex-direction: row;
    gap: 1rem;
  }
}

/* Tablet landscape (768px+) */
@media (min-width: 768px) {
  .element {
    gap: 1.5rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .element {
    gap: 2rem;
  }
}
```

### Tailwind Breakpoints

```typescript
// Mobile-first examples
<div className="
  w-full              /* Mobile: full width */
  sm:w-1/2            /* Tablet: half width */
  lg:w-1/3            /* Desktop: one-third */
">

<div className="
  text-sm             /* Mobile: small text */
  sm:text-base        /* Tablet: normal text */
  lg:text-lg          /* Desktop: large text */
">

<div className="
  p-4                 /* Mobile: padding 16px */
  sm:p-6              /* Tablet: padding 24px */
  lg:p-8              /* Desktop: padding 32px */
">
```

### Responsive Grid Patterns

```typescript
// Card Grid
<div className="
  grid
  grid-cols-1         /* Mobile: 1 column */
  sm:grid-cols-2      /* Tablet: 2 columns */
  lg:grid-cols-3      /* Desktop: 3 columns */
  xl:grid-cols-4      /* Large: 4 columns */
  gap-4
">
  {cards.map(card => <CardItem key={card.id} card={card} />)}
</div>

// List with Side Panel
<div className="
  flex
  flex-col            /* Mobile: vertical stack */
  lg:flex-row         /* Desktop: horizontal */
  gap-4
">
  <main className="flex-1">
    {/* Main content */}
  </main>
  <aside className="
    w-full            /* Mobile: full width */
    lg:w-80           /* Desktop: fixed 320px */
  ">
    {/* Sidebar */}
  </aside>
</div>
```

## Layout Components

### App Shell Structure

```typescript
// __root.tsx
function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Logo />
          <Navigation />
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background lg:hidden">
        <MobileNav />
      </nav>
    </div>
  );
}
```

### Container Patterns

```typescript
// Full-width container
<div className="w-full px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Centered container with max width
<div className="container mx-auto max-w-7xl px-4">
  {/* Content */}
</div>

// Card container
<div className="rounded-lg border bg-card p-4 sm:p-6">
  {/* Card content */}
</div>
```

## Component Patterns

### Card Component

```typescript
interface CardProps {
  card: Card;
  onSelect?: (card: Card) => void;
}

export function CardItem({ card, onSelect }: CardProps) {
  return (
    <div
      onClick={() => onSelect?.(card)}
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        bg-gradient-to-br from-primary to-primary/80
        p-6
        text-primary-foreground
        transition-transform
        hover:scale-105
        cursor-pointer

        /* Mobile optimizations */
        min-h-[200px]
        touch-manipulation

        /* Tablet & Desktop */
        sm:min-h-[220px]
        lg:min-h-[240px]
      "
    >
      {/* Card Number */}
      <div className="mb-8 font-mono text-lg sm:text-xl tracking-wider">
        {formatCardNumber(card.number)}
      </div>

      {/* Card Details */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-primary-foreground/70 mb-1">
            Nome do Titular
          </p>
          <p className="font-medium text-sm sm:text-base">
            {card.holderName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-primary-foreground/70 mb-1">
            Validade
          </p>
          <p className="font-medium text-sm sm:text-base">
            {formatExpiry(card.expiryDate)}
          </p>
        </div>
      </div>

      {/* Card Badge */}
      <div className="absolute top-4 right-4">
        <CardTypeBadge type={card.type} />
      </div>
    </div>
  );
}
```

### List Component

```typescript
export function CardList() {
  const { cards, isLoading } = useCard();

  if (isLoading) {
    return <CardListSkeleton />;
  }

  if (!cards?.length) {
    return <EmptyState message="Nenhum cartão encontrado" />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">Meus Cartões</h2>
        <Button size="sm" className="sm:size-default">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Novo Cartão</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-4
        sm:gap-6
      ">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
```

### Form Component

```typescript
export function CreateCardForm() {
  const form = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Form Field */}
      <div className="space-y-2">
        <Label htmlFor="holderName">Nome do Titular</Label>
        <Input
          id="holderName"
          {...form.register('holderName')}
          className="
            h-10           /* Mobile-friendly touch target */
            sm:h-11        /* Slightly larger on tablet */
            text-base      /* Prevent zoom on iOS */
          "
        />
        {form.formState.errors.holderName && (
          <p className="text-sm text-destructive">
            {form.formState.errors.holderName.message}
          </p>
        )}
      </div>

      {/* Select Field */}
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Cartão</Label>
        <Select {...form.register('type')}>
          <SelectTrigger className="h-10 sm:h-11">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit">Crédito</SelectItem>
            <SelectItem value="debit">Débito</SelectItem>
            <SelectItem value="prepaid">Pré-pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="
        flex
        flex-col-reverse    /* Mobile: Cancel on top */
        sm:flex-row         /* Desktop: side by side */
        gap-3
        sm:justify-end
      ">
        <Button type="button" variant="outline" className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Criar Cartão
        </Button>
      </div>
    </form>
  );
}
```

### Dialog/Modal Component

```typescript
export function CreateCardDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Cartão</Button>
      </DialogTrigger>
      <DialogContent className="
        /* Mobile: Full screen modal */
        w-full
        h-full
        max-w-none
        m-0
        rounded-none

        /* Tablet+: Regular modal */
        sm:h-auto
        sm:max-w-lg
        sm:rounded-lg
        sm:m-4
      ">
        <DialogHeader>
          <DialogTitle>Criar Novo Cartão</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo cartão.
          </DialogDescription>
        </DialogHeader>
        <CreateCardForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
```

## Touch Interactions

### Touch Targets

Minimum touch target sizes (WCAG 2.5.5):

```typescript
// Buttons - minimum 44x44px
<Button className="min-h-[44px] min-w-[44px] px-4">
  Click me
</Button>

// Icon buttons - minimum 44x44px
<Button size="icon" className="h-11 w-11">
  <Icon className="h-5 w-5" />
</Button>

// Links with adequate spacing
<a className="inline-block py-3 px-4 touch-manipulation">
  Link text
</a>
```

### Swipe Gestures

```typescript
// Use touch-action CSS for better mobile interaction
<div className="
  overflow-x-auto
  touch-pan-x        /* Allow horizontal scrolling */
  [-webkit-overflow-scrolling:touch]  /* iOS momentum scrolling */
">
  {/* Scrollable content */}
</div>

// Prevent pull-to-refresh conflicts
<div className="overscroll-none">
  {/* Content */}
</div>
```

## Loading States

### Skeleton Screens

```typescript
export function CardSkeleton() {
  return (
    <div className="
      rounded-xl
      border
      bg-card
      p-6
      min-h-[200px]
      sm:min-h-[220px]
      lg:min-h-[240px]
      animate-pulse
    ">
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex justify-between mt-8">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function CardListSkeleton() {
  return (
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      gap-4
    ">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
```

### Loading Spinners

```typescript
// Inline spinner
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Carregando...
    </>
  ) : (
    'Salvar'
  )}
</Button>

// Full page spinner
export function PageSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
```

## Empty States

```typescript
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="
      flex
      flex-col
      items-center
      justify-center
      text-center
      py-12
      px-4
    ">
      {Icon && <Icon className="h-16 w-16 text-muted-foreground mb-4" />}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>
      {action}
    </div>
  );
}

// Usage
<EmptyState
  icon={CreditCard}
  title="Nenhum cartão encontrado"
  description="Você ainda não possui cartões cadastrados. Crie seu primeiro cartão agora."
  action={
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Criar Cartão
    </Button>
  }
/>
```

## Error States

```typescript
export function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="flex-1">{message}</span>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry}>
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

## Feedback & Notifications

### Toast Notifications

```typescript
// Success toast
toast({
  title: 'Sucesso!',
  description: 'Cartão criado com sucesso.',
  duration: 3000,
});

// Error toast
toast({
  title: 'Erro',
  description: 'Não foi possível criar o cartão.',
  variant: 'destructive',
  duration: 5000,
});

// Loading toast (with manual dismiss)
const loadingToast = toast({
  title: 'Processando...',
  description: 'Aguarde enquanto criamos seu cartão.',
  duration: Infinity,
});

// Later dismiss
loadingToast.dismiss();
```

## Accessibility

### ARIA Labels

```typescript
// Button with icon only
<Button aria-label="Fechar diálogo">
  <X className="h-4 w-4" />
</Button>

// Form inputs
<div>
  <Label htmlFor="cardNumber">Número do Cartão</Label>
  <Input
    id="cardNumber"
    type="text"
    aria-describedby="cardNumber-help"
    aria-invalid={!!errors.cardNumber}
  />
  <p id="cardNumber-help" className="text-sm text-muted-foreground">
    Digite os 16 dígitos do cartão
  </p>
</div>
```

### Keyboard Navigation

```typescript
// Clickable card with keyboard support
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  onClick={handleClick}
  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
>
  {/* Card content */}
</div>
```

### Focus States

```typescript
// Custom focus styles
<Button className="
  focus:outline-none
  focus:ring-2
  focus:ring-primary
  focus:ring-offset-2
">
  Click me
</Button>

// Skip to main content link (accessibility)
<a
  href="#main-content"
  className="
    sr-only
    focus:not-sr-only
    focus:absolute
    focus:z-50
    focus:p-4
    focus:bg-primary
    focus:text-primary-foreground
  "
>
  Pular para o conteúdo principal
</a>
```

## Theme Support

### Dark/Light Mode

```typescript
// Using next-themes
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Alternar tema"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

### Theme-Aware Colors

```typescript
// Always use semantic color tokens
<div className="bg-background text-foreground">
  <div className="bg-card text-card-foreground">
    <Button className="bg-primary text-primary-foreground">
      Primary Action
    </Button>
    <Button className="bg-secondary text-secondary-foreground">
      Secondary Action
    </Button>
  </div>
</div>
```

## Animation Guidelines

### Smooth Transitions

```typescript
// Hover effects
<div className="transition-all hover:scale-105 duration-200">
  {/* Content */}
</div>

// Color transitions
<Button className="transition-colors duration-150">
  Click me
</Button>

// Fade in
<div className="animate-in fade-in duration-300">
  {/* Content */}
</div>
```

### Reduced Motion

```typescript
// Respect user preferences
<div className="
  transition-transform
  duration-300
  hover:scale-105
  motion-reduce:transition-none
  motion-reduce:hover:scale-100
">
  {/* Content */}
</div>
```

## Typography

### Font Scales

```typescript
// Headings - responsive sizes
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Page Title
</h1>

<h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
  Section Title
</h2>

<h3 className="text-lg sm:text-xl font-semibold">
  Subsection Title
</h3>

// Body text
<p className="text-sm sm:text-base text-muted-foreground">
  Body text content
</p>

// Small text
<span className="text-xs sm:text-sm text-muted-foreground">
  Helper text
</span>
```

## Spacing System

### Consistent Spacing

```typescript
// Section spacing
<section className="space-y-6 sm:space-y-8">
  {/* Sections */}
</section>

// Card spacing
<div className="space-y-4">
  {/* Card content */}
</div>

// Form spacing
<form className="space-y-4 sm:space-y-6">
  {/* Form fields */}
</form>

// Container padding
<div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
  {/* Content */}
</div>
```

## Summary

- **Always design mobile-first** with Tailwind breakpoints
- **Touch targets minimum 44x44px** for mobile usability
- **Use skeleton screens** for loading states
- **Provide clear feedback** with toasts and alerts
- **Support dark/light themes** with semantic tokens
- **Ensure accessibility** with ARIA labels and keyboard nav
- **Smooth animations** with respect for reduced motion
- **Consistent spacing** using Tailwind's spacing scale
