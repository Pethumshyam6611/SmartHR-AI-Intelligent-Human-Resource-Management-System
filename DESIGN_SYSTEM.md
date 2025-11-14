# SmartHR AI - Design System Documentation

This document describes the complete Google Material Design-inspired UI system for SmartHR AI.

## Design Philosophy

SmartHR AI follows Google's Material You and Jules UI design principles:

- **Clean & Spacious**: Generous whitespace and clear visual hierarchy
- **Friendly & Modern**: Rounded corners, soft shadows, and smooth animations
- **Accessible**: High contrast ratios, clear typography, readable font sizes
- **Consistent**: Unified design language across all components

## Color Palette

### Primary Colors (Google Blue)

Based on Google's signature blue (#1A73E8):

```
primary-50:  #E8F0FE  (Lightest - backgrounds)
primary-100: #D2E3FC  (Light - hover states)
primary-200: #AECBFA
primary-300: #8AB4F8
primary-400: #669DF6
primary-500: #1A73E8  (Base - primary actions)
primary-600: #185ABC  (Darker - pressed states)
primary-700: #1967D2
primary-800: #1558B0
primary-900: #0D47A1  (Darkest)
```

### Accent Colors (Google Green)

```
accent-500: #34A853  (Success states, positive actions)
```

### Google Brand Colors

```
google-blue:   #1A73E8
google-green:  #34A853
google-yellow: #FBBC04
google-red:    #EA4335
```

### Surface Colors

```
Light Mode:
- surface-light: #FFFFFF (Cards, panels)
- surface:       #F9FAFB (Page background)
- surface-dark:  #F1F3F4 (Hover states)

Dark Mode:
- surface-dark-1: #202124 (Background)
- surface-dark-2: #292A2D (Cards)
- surface-dark-3: #35363A (Elevated)
```

### Text Colors

```
text-primary:   #202124 (Headlines, body)
text-secondary: #5F6368 (Supporting text)
text-tertiary:  #80868B (Hints, labels)
text-inverse:   #FFFFFF (On dark backgrounds)
```

### Border Colors

```
border-light: #DADCE0
border:       #E8EAED (Default)
border-dark:  #3C4043 (Dark mode)
```

## Typography

### Font Family

**Roboto** - Google's signature font

```css
font-family: 'Roboto', system-ui, -apple-system, sans-serif;
```

### Font Weights

- Light: 300
- Regular: 400
- Medium: 500
- Bold: 700

### Type Scale

```
text-xs:   12px (Captions, labels)
text-sm:   14px (Body text, buttons)
text-base: 16px (Body text)
text-lg:   18px (Subtitles)
text-xl:   20px (Section headers)
text-2xl:  24px (Card titles)
text-3xl:  30px (Page titles)
```

## Spacing System

Google-style spacing scale:

```
google-1:  4px
google-2:  8px
google-3:  12px
google-4:  16px
google-5:  20px
google-6:  24px
google-8:  32px
google-10: 40px
google-12: 48px
```

## Border Radius

```
google:     8px  (Standard cards, buttons)
google-lg:  12px (Large cards)
google-xl:  16px (Modals)
google-2xl: 24px (Search bars, special elements)
rounded-full: 9999px (Circular elements)
```

## Shadows (Elevation)

Google Material Design elevation system:

```css
/* Small - Buttons, small cards */
shadow-google-sm: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
                  0 1px 3px 1px rgba(60, 64, 67, 0.15);

/* Medium - Cards, dropdowns */
shadow-google: 0 1px 3px 0 rgba(60, 64, 67, 0.3),
               0 4px 8px 3px rgba(60, 64, 67, 0.15);

/* Large - Elevated cards, FAB */
shadow-google-lg: 0 2px 6px 2px rgba(60, 64, 67, 0.15),
                  0 8px 24px 4px rgba(60, 64, 67, 0.15);

/* Extra Large - Modals, sheets */
shadow-google-xl: 0 8px 12px 6px rgba(60, 64, 67, 0.15),
                  0 4px 16px 0px rgba(60, 64, 67, 0.3);
```

## Components

### Buttons

#### Primary Button
- **Use**: Main actions, CTAs
- **Style**: Filled, primary-500 background
- **Class**: `btn-primary`

```jsx
<button className="btn-primary">
  Get Started
</button>
```

#### Secondary Button
- **Use**: Alternative actions
- **Style**: Outlined, border
- **Class**: `btn-secondary`

```jsx
<button className="btn-secondary">
  Cancel
</button>
```

#### Text Button
- **Use**: Low emphasis actions
- **Style**: No background, primary text
- **Class**: `btn-text`

```jsx
<button className="btn-text">
  Learn More
</button>
```

#### Icon Button
- **Use**: Single icon actions
- **Style**: Circular hover, no background
- **Class**: `btn-icon`

```jsx
<button className="btn-icon">
  <Settings size={20} />
</button>
```

#### FAB (Floating Action Button)
- **Use**: Primary screen action
- **Style**: Floating, rounded, shadowed
- **Class**: `btn-fab`

```jsx
<button className="btn-fab">
  <Plus size={24} />
</button>
```

### Cards

#### Standard Card
```jsx
<Card>
  <CardHeader title="Card Title" subtitle="Subtitle" />
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

#### Hover Card
```jsx
<Card hover>
  Interactive card content
</Card>
```

### Input Fields

#### Standard Input
```jsx
<Input
  label="Email"
  placeholder="you@example.com"
  helperText="We'll never share your email"
/>
```

#### Floating Label Input (Google Style)
```jsx
<Input
  floating
  label="Full Name"
  placeholder=" "
/>
```

#### Textarea
```jsx
<Textarea
  label="Description"
  rows={4}
  placeholder="Enter description..."
/>
```

#### Select
```jsx
<Select
  label="Department"
  options={[
    { value: 'hr', label: 'Human Resources' },
    { value: 'eng', label: 'Engineering' },
  ]}
/>
```

### Chips

```jsx
<Chip variant="primary">Active</Chip>
<Chip variant="success">Approved</Chip>
<Chip variant="warning">Pending</Chip>
<Chip variant="error">Rejected</Chip>
```

### Tables

```jsx
<Table
  data={employees}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <Chip>{item.status}</Chip>
    },
  ]}
  onRowClick={(item) => console.log(item)}
/>
```

### Search Bar

```jsx
<SearchBar
  placeholder="Search..."
  onChange={(value) => setSearch(value)}
  onSearch={(value) => handleSearch(value)}
/>
```

### Modals

```jsx
<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Modal Title"
  size="md"
  footer={
    <>
      <button className="btn-secondary">Cancel</button>
      <button className="btn-primary">Save</button>
    </>
  }
>
  Modal content
</Modal>
```

### Progress Indicators

```jsx
{/* Linear Progress */}
<Progress value={75} />

{/* Circular Progress */}
<CircularProgress value={50} />

{/* Indeterminate */}
<CircularProgress />
```

### Avatars

```jsx
<Avatar
  name="John Doe"
  src="/path/to/image.jpg"
  size="md"
/>
```

### Badges

```jsx
<Badge>3</Badge>
```

### Tabs

```jsx
<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', content: <Overview /> },
    { id: 'details', label: 'Details', content: <Details /> },
  ]}
/>
```

### Empty States

```jsx
<EmptyState
  icon={<Users size={64} />}
  title="No employees found"
  description="Get started by adding your first employee"
  action={
    <button className="btn-primary">Add Employee</button>
  }
/>
```

### Skeletons

```jsx
<Skeleton width="100%" height="20px" />
<SkeletonCard />
```

## Layout Components

### Dashboard Widgets

#### Stat Card
```jsx
<StatCard
  title="Total Employees"
  value={245}
  icon={Users}
  color="blue"
  trend={{ value: 5.2, isPositive: true }}
/>
```

#### Quick Action Card
```jsx
<QuickActionCard
  title="Mark Attendance"
  description="Clock in for today"
  icon={Clock}
  color="blue"
  onClick={handleClick}
/>
```

## Responsive Breakpoints

```
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
2xl: 1536px  (Extra large)
```

## Dark Mode

Toggle dark mode by adding `dark` class to `<html>` element:

```js
document.documentElement.classList.add('dark');
```

Dark mode automatically applies:
- Dark backgrounds
- Light text
- Adjusted borders and shadows
- Inverted card styles

## Animation Guidelines

### Transitions

```css
transition-all duration-200  /* Standard transitions */
transition-colors            /* Color-only transitions */
transition-shadow            /* Shadow transitions */
```

### Hover Effects

- Buttons: Scale (105%) or shadow
- Cards: Elevated shadow
- Icons: Background color change

### Loading States

Use CircularProgress for loading indicators:

```jsx
<button className="btn-primary" disabled={loading}>
  {loading && <CircularProgress size={16} />}
  {loading ? 'Loading...' : 'Submit'}
</button>
```

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

### Focus States

All interactive elements have visible focus rings:

```css
focus-visible:ring-2
focus-visible:ring-primary-300
focus-visible:ring-offset-2
```

### Keyboard Navigation

- All components support keyboard navigation
- Modal traps focus
- Proper tab order maintained

## Best Practices

### Do's

✅ Use spacious layouts with proper whitespace
✅ Maintain consistent spacing (use google-* scale)
✅ Use elevation to show hierarchy
✅ Provide clear visual feedback for interactions
✅ Use icons to enhance understanding
✅ Keep action buttons at bottom-right (primary actions)
✅ Use chips for status indicators
✅ Provide loading states for async actions

### Don'ts

❌ Don't use too many colors
❌ Don't create custom shadows (use google-* shadows)
❌ Don't mix sharp and rounded corners
❌ Don't use small touch targets (<44px)
❌ Don't hide important actions
❌ Don't overuse animations
❌ Don't ignore mobile responsiveness

## Component Examples

### Employee Card

```jsx
<Card hover>
  <div className="flex items-center gap-google-4">
    <Avatar name="John Doe" size="lg" />
    <div className="flex-1">
      <h3 className="font-medium text-text-primary">John Doe</h3>
      <p className="text-sm text-text-secondary">Software Engineer</p>
    </div>
    <Chip variant="success">Active</Chip>
  </div>
</Card>
```

### Search with Filters

```jsx
<div className="space-y-google-4">
  <SearchBar placeholder="Search employees..." />
  <div className="flex gap-google-2">
    <Chip variant="primary" onRemove={() => {}}>
      Engineering
    </Chip>
    <Chip variant="default" onRemove={() => {}}>
      Full-time
    </Chip>
  </div>
</div>
```

### Form Layout

```jsx
<Card>
  <CardHeader title="Personal Information" />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-google-4">
    <Input floating label="First Name" placeholder=" " />
    <Input floating label="Last Name" placeholder=" " />
    <Input floating label="Email" placeholder=" " type="email" />
    <Input floating label="Phone" placeholder=" " type="tel" />
    <div className="md:col-span-2">
      <Textarea label="Address" rows={3} />
    </div>
  </div>
  <Divider />
  <div className="flex justify-end gap-google-3">
    <button className="btn-secondary">Cancel</button>
    <button className="btn-primary">Save Changes</button>
  </div>
</Card>
```

## File Structure

```
frontend/src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   └── ...
│   └── dashboard/       # Domain-specific components
│       ├── StatCard.tsx
│       └── ...
├── styles/
│   └── index.css        # Global styles & utilities
└── tailwind.config.js   # Design system configuration
```

## Resources

- [Material Design 3](https://m3.material.io/)
- [Google Fonts - Roboto](https://fonts.google.com/specimen/Roboto)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**SmartHR AI Design System** - Built with Google Material Design principles
