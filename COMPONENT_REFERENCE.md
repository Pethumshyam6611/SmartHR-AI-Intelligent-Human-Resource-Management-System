# SmartHR AI - Component Quick Reference

A quick reference guide for all available UI components.

## 🎨 Import Components

```tsx
import {
  Button, FAB,
  Card, CardHeader, CardContent,
  Input, Textarea, Select,
  SearchBar,
  Chip,
  Badge,
  Progress, CircularProgress,
  Table,
  Modal,
  Tabs,
  Avatar,
  Divider,
  EmptyState,
  Skeleton, SkeletonCard
} from '@/components/ui';
```

## 📋 Component Cheat Sheet

### Buttons

```tsx
// Primary - Main actions
<button className="btn-primary">Save</button>

// Secondary - Alternative actions
<button className="btn-secondary">Cancel</button>

// Text - Low emphasis
<button className="btn-text">Learn More</button>

// Icon - Single icon
<button className="btn-icon"><Settings size={20} /></button>

// FAB - Floating action
<button className="btn-fab"><Plus size={24} /></button>

// With Component
<Button variant="primary" icon={<Save />} loading={isLoading}>
  Save Changes
</Button>
```

### Cards

```tsx
// Standard Card
<Card>Content</Card>

// Hover Card
<Card hover>Interactive content</Card>

// With Header
<Card>
  <CardHeader
    title="Title"
    subtitle="Subtitle"
    action={<button className="btn-text">Action</button>}
  />
  <CardContent>Body</CardContent>
</Card>
```

### Inputs

```tsx
// Standard Input
<Input
  label="Email"
  placeholder="you@example.com"
  helperText="Helper text"
  error="Error message"
/>

// Floating Label (Google style)
<Input
  floating
  label="Full Name"
  placeholder=" "
/>

// Textarea
<Textarea
  label="Description"
  rows={4}
/>

// Select
<Select
  label="Department"
  options={[
    { value: 'hr', label: 'HR' },
    { value: 'eng', label: 'Engineering' }
  ]}
/>
```

### Search

```tsx
<SearchBar
  placeholder="Search..."
  onChange={(value) => setSearch(value)}
  onSearch={(value) => handleSearch(value)}
/>
```

### Chips

```tsx
<Chip variant="default">Default</Chip>
<Chip variant="primary">Primary</Chip>
<Chip variant="success">Success</Chip>
<Chip variant="warning">Warning</Chip>
<Chip variant="error">Error</Chip>

// With remove
<Chip variant="primary" onRemove={() => handleRemove()}>
  Removable
</Chip>
```

### Badges

```tsx
// Notification badge
<Badge>3</Badge>

// With icon
<button className="btn-icon relative">
  <Bell size={20} />
  <Badge className="absolute -top-1 -right-1">5</Badge>
</button>
```

### Progress

```tsx
// Linear
<Progress value={75} />

// Circular
<CircularProgress value={50} />

// Indeterminate (loading)
<CircularProgress />
```

### Tables

```tsx
<Table
  data={items}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <Chip>{item.status}</Chip>
    }
  ]}
  onRowClick={(item) => console.log(item)}
/>
```

### Modals

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"  // sm, md, lg, xl
  footer={
    <>
      <button className="btn-secondary">Cancel</button>
      <button className="btn-primary">Confirm</button>
    </>
  }
>
  Modal content here
</Modal>
```

### Tabs

```tsx
<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <Content1 />, icon: <Icon1 /> },
    { id: 'tab2', label: 'Tab 2', content: <Content2 /> }
  ]}
  defaultTab="tab1"
  onChange={(tabId) => console.log(tabId)}
/>
```

### Avatars

```tsx
// With name (shows initials)
<Avatar name="John Doe" size="md" />

// With image
<Avatar src="/path/to/image.jpg" alt="John" size="lg" />

// Sizes: sm, md, lg, xl
<Avatar name="John Doe" size="sm" />
```

### Dividers

```tsx
// Standard
<Divider />

// With text
<Divider text="OR" />
```

### Empty States

```tsx
<EmptyState
  icon={<Users size={64} />}
  title="No employees found"
  description="Get started by adding your first employee"
  action={<button className="btn-primary">Add Employee</button>}
/>
```

### Skeletons

```tsx
// Custom skeleton
<Skeleton width="100%" height="20px" variant="rectangular" />
<Skeleton width="40px" height="40px" variant="circular" />
<Skeleton width="200px" variant="text" />

// Skeleton card
<SkeletonCard />
```

## 🎯 Common Patterns

### Form Layout

```tsx
<Card>
  <CardHeader title="Edit Profile" />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-google-4">
    <Input floating label="First Name" placeholder=" " />
    <Input floating label="Last Name" placeholder=" " />
    <div className="md:col-span-2">
      <Textarea label="Bio" rows={4} />
    </div>
  </div>
  <Divider />
  <div className="flex justify-end gap-google-3">
    <button className="btn-secondary">Cancel</button>
    <button className="btn-primary">Save</button>
  </div>
</Card>
```

### List with Actions

```tsx
<Card>
  <CardHeader title="Team Members" />
  <div className="space-y-google-3">
    {members.map(member => (
      <div key={member.id} className="list-item">
        <Avatar name={member.name} size="sm" />
        <div className="flex-1">
          <p className="font-medium">{member.name}</p>
          <p className="text-sm text-text-secondary">{member.role}</p>
        </div>
        <Chip variant="success">Active</Chip>
      </div>
    ))}
  </div>
</Card>
```

### Data Table with Search

```tsx
<Card>
  <CardHeader title="Employees" />
  <div className="mb-google-4">
    <SearchBar placeholder="Search employees..." onChange={setSearch} />
  </div>
  <Table
    data={filteredEmployees}
    columns={columns}
    onRowClick={handleRowClick}
  />
</Card>
```

### Confirmation Dialog

```tsx
<Modal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Confirm Action"
  size="sm"
  footer={
    <>
      <button className="btn-secondary" onClick={() => setShowConfirm(false)}>
        Cancel
      </button>
      <button className="btn-primary" onClick={handleConfirm}>
        Confirm
      </button>
    </>
  }
>
  <p className="text-text-primary">
    Are you sure you want to proceed with this action?
  </p>
</Modal>
```

### Loading States

```tsx
// Button loading
<Button variant="primary" loading={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>

// Content loading
{isLoading ? (
  <div className="space-y-google-4">
    <SkeletonCard />
    <SkeletonCard />
  </div>
) : (
  <div className="space-y-google-4">
    {data.map(item => <Card key={item.id}>{item.content}</Card>)}
  </div>
)}

// Circular progress
{isLoading && (
  <div className="flex justify-center py-google-8">
    <CircularProgress />
  </div>
)}
```

### Empty State with Action

```tsx
{items.length === 0 ? (
  <EmptyState
    icon={<Briefcase size={64} />}
    title="No jobs posted yet"
    description="Start by creating your first job posting"
    action={
      <button className="btn-primary" onClick={() => setShowModal(true)}>
        Post a Job
      </button>
    }
  />
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-google-4">
    {items.map(item => <JobCard key={item.id} job={item} />)}
  </div>
)}
```

## 🎨 Utility Classes

### Spacing

```css
gap-google-2   /* 8px gap */
gap-google-4   /* 16px gap */
gap-google-6   /* 24px gap */

p-google-4     /* 16px padding */
px-google-6    /* 24px horizontal padding */
py-google-3    /* 12px vertical padding */

mb-google-4    /* 16px margin bottom */
mt-google-6    /* 24px margin top */
```

### Layout

```css
space-y-google-4     /* Vertical spacing between children */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  /* Responsive grid */
flex items-center justify-between  /* Flex layout */
```

### Text

```css
text-text-primary    /* Main text color */
text-text-secondary  /* Secondary text color */
text-text-tertiary   /* Tertiary text color */

font-medium          /* Medium font weight (500) */
font-bold            /* Bold font weight (700) */

text-sm             /* 14px */
text-base           /* 16px */
text-lg             /* 18px */
```

### Elevation

```css
elevation-1    /* Small shadow */
elevation-2    /* Medium shadow */
elevation-3    /* Large shadow */
elevation-4    /* Extra large shadow */

shadow-google-sm  /* Small Google shadow */
shadow-google     /* Medium Google shadow */
shadow-google-lg  /* Large Google shadow */
shadow-google-xl  /* Extra large Google shadow */
```

### Borders

```css
border border-border        /* Standard border */
rounded-google              /* 8px border radius */
rounded-google-lg           /* 12px border radius */
rounded-google-xl           /* 16px border radius */
rounded-google-2xl          /* 24px border radius */
```

### Colors

```css
bg-primary-500      /* Primary background */
bg-accent-50        /* Light accent background */
bg-surface-light    /* Light surface */
bg-surface-dark     /* Dark surface */

text-primary-600    /* Primary text */
text-accent-700     /* Accent text */
text-google-red     /* Red text */
```

## 🌟 Dashboard Components

```tsx
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

// Stat Card
<StatCard
  title="Total Employees"
  value={245}
  icon={Users}
  color="blue"  // blue, green, yellow, red
  trend={{ value: 5.2, isPositive: true }}
/>

// Quick Action
<QuickActionCard
  title="Mark Attendance"
  description="Clock in for today"
  icon={Clock}
  color="blue"
  onClick={handleClick}
/>

// Recent Activity
<RecentActivity
  activities={[
    { id: '1', user: 'John', action: 'clocked in', time: '2h ago' }
  ]}
/>
```

## 💡 Tips

1. **Always use Google spacing** (`google-2`, `google-4`, etc.) for consistency
2. **Use Card for content containers** instead of plain divs
3. **Prefer btn-* classes** for buttons instead of custom styles
4. **Use Chip for status indicators** with appropriate variants
5. **Always provide loading states** for async actions
6. **Use EmptyState** when lists are empty
7. **Use Skeleton** for loading placeholders
8. **Follow the grid system** for responsive layouts

## 📱 Responsive Classes

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {/* 1 col on mobile, 2 on tablet, 4 on desktop */}
</div>

// Hide on mobile
<div className="hidden md:block">Desktop only</div>

// Show on mobile only
<div className="block md:hidden">Mobile only</div>

// Responsive spacing
<div className="p-4 md:p-google-6 lg:p-google-8">
  {/* Smaller padding on mobile */}
</div>
```

## 🎯 Best Practices

✅ **DO:**
- Use the component library for all UI elements
- Follow Google spacing scale
- Maintain consistent elevation
- Provide feedback for all actions
- Use loading states
- Handle empty states
- Make it responsive

❌ **DON'T:**
- Create custom shadows
- Mix border radius styles
- Use random spacing values
- Forget loading states
- Ignore mobile users
- Overuse animations

---

**Quick, clean, and Google-style!** 🚀
