# Text Truncation Guide

This guide explains how to handle long text content consistently across the application to maintain a clean, professional UI.

## 🎯 Problem

Long text content (emails, usernames, titles, URLs, etc.) can break UI layouts, especially in:
- Dropdowns and menus
- Cards and lists
- Mobile responsive designs
- Navigation components

## ✅ Solution

We've implemented a comprehensive text truncation system with two approaches:

### 1. React Components (Recommended)

Use the `TruncatedText` component family for dynamic content:

```tsx
import { TruncatedEmail, TruncatedUsername, TruncatedTitle } from '@/components/ui/truncated-text';

// For emails
<TruncatedEmail email={user.email} />

// For usernames
<TruncatedUsername username={user.name} />

// For titles
<TruncatedTitle title={post.title} />

// Custom truncation
<TruncatedText maxWidth="max-w-[300px]" className="text-blue-600">
  {longText}
</TruncatedText>
```

### 2. CSS Utility Classes

Use utility classes for static content or when you need more control:

```tsx
// Email addresses
<p className="truncate-email" title={email}>{email}</p>

// Responsive truncation
<h2 className="truncate-responsive">{title}</h2>

// Mobile-specific
<span className="truncate-email-mobile md:truncate-email">{email}</span>
```

## 📚 Available Components

### `<TruncatedEmail>`
- **Use for**: Email addresses
- **Max width**: 200px
- **Styling**: Small text
- **Tooltip**: Shows full email on hover

### `<TruncatedUsername>`
- **Use for**: User display names
- **Max width**: 150px
- **Styling**: Medium font weight
- **Tooltip**: Shows full name on hover

### `<TruncatedTitle>`
- **Use for**: Post titles, page headings
- **Max width**: 250px
- **Styling**: Semibold font
- **Tooltip**: Shows full title on hover

### `<TruncatedDescription>`
- **Use for**: Descriptions, summaries
- **Max width**: 300px
- **Styling**: Muted foreground, small text
- **Tooltip**: Shows full description on hover

### `<TruncatedText>` (Base Component)
- **Use for**: Custom truncation needs
- **Configurable**: maxWidth, className, tooltip
- **Flexible**: Handles any content type

## 🎨 Available CSS Classes

### Email Classes
```css
.truncate-email          /* 200px max, small text */
.truncate-email-mobile   /* 150px max, small text */
```

### Username Classes
```css
.truncate-username       /* 150px max, medium weight */
```

### Title Classes
```css
.truncate-title          /* 250px max, semibold */
.truncate-title-mobile   /* 180px max, semibold */
```

### Description Classes
```css
.truncate-description         /* 300px max, muted, small */
.truncate-description-mobile  /* 200px max, muted, small */
```

### Utility Classes
```css
.truncate-url            /* 200px max, blue text */
.truncate-filename       /* 180px max, monospace */
```

### Responsive Classes
```css
.truncate-responsive     /* 200px → 250px → 300px */
.truncate-responsive-sm  /* 150px → 200px → 250px */
```

## 🛠️ Implementation Examples

### Dropdown Menu
```tsx
<DropdownMenuContent>
  <div className="px-3 py-2">
    <TruncatedEmail email={user.email} />
    <p className="text-xs text-muted-foreground">
      Signed in via {provider}
    </p>
  </div>
</DropdownMenuContent>
```

### User Card
```tsx
<Card>
  <CardHeader>
    <TruncatedUsername username={user.name} />
    <TruncatedEmail email={user.email} className="text-muted-foreground" />
  </CardHeader>
</Card>
```

### Mobile Navigation
```tsx
<div className="space-y-2">
  <TruncatedEmail 
    email={user.email} 
    className="truncate-email-mobile md:truncate-email" 
  />
</div>
```

### File List
```tsx
{files.map(file => (
  <div key={file.id} className="flex items-center space-x-2">
    <span className="truncate-filename" title={file.name}>
      {file.name}
    </span>
  </div>
))}
```

## 📱 Responsive Considerations

### Breakpoint Strategy
- **Mobile (< 640px)**: Tighter truncation (150-180px)
- **Tablet (640px+)**: Medium truncation (200-250px)  
- **Desktop (768px+)**: Generous truncation (250-300px)

### Implementation
```tsx
// Component approach
<TruncatedText 
  maxWidth="max-w-[150px] sm:max-w-[200px] md:max-w-[250px]"
  className="text-sm"
>
  {content}
</TruncatedText>

// CSS class approach
<p className="truncate-responsive-sm">{content}</p>
```

## ✨ Best Practices

### 1. Always Provide Tooltips
```tsx
// ✅ Good - tooltip shows full content
<TruncatedEmail email={user.email} />

// ❌ Bad - no way to see full content
<p className="truncate">{user.email}</p>
```

### 2. Choose Appropriate Max Widths
```tsx
// ✅ Good - appropriate for content type
<TruncatedEmail email={email} />        // 200px
<TruncatedUsername username={name} />   // 150px
<TruncatedTitle title={title} />        // 250px

// ❌ Bad - one size fits all
<p className="truncate max-w-[100px]">{anyContent}</p>
```

### 3. Consider Context
```tsx
// ✅ Good - smaller in sidebar
<TruncatedEmail 
  email={email} 
  maxWidth="max-w-[120px]" 
  className="text-xs" 
/>

// ✅ Good - larger in main content
<TruncatedEmail email={email} />
```

### 4. Test with Long Content
Always test with realistic long content:
- `verylongusername@extremelylongdomainname.com`
- `This is a very long title that might break the layout`
- `Super Long Company Name That Goes On Forever Inc.`

## 🔧 Customization

### Extending the System
Add new utility classes in `globals.css`:

```css
@layer utilities {
  .truncate-company-name {
    @apply truncate max-w-[220px] font-medium text-gray-700;
  }
  
  .truncate-product-name {
    @apply truncate max-w-[180px] font-semibold text-blue-600;
  }
}
```

### Creating New Components
```tsx
export function TruncatedCompanyName({ name, className }: { name: string; className?: string }) {
  return (
    <TruncatedText 
      className={cn('font-medium text-gray-700', className)} 
      maxWidth="max-w-[220px]"
      tooltipText={name}
    >
      {name}
    </TruncatedText>
  );
}
```

## 🎯 Migration Guide

### Replacing Manual Truncation
```tsx
// ❌ Before - manual implementation
<p className="text-sm font-medium truncate max-w-[200px]" title={user.email}>
  {user.email}
</p>

// ✅ After - using component
<TruncatedEmail email={user.email} />
```

### Updating Existing Code
1. Find manual truncation patterns
2. Replace with appropriate component or utility class
3. Test responsive behavior
4. Verify tooltip functionality

This system ensures consistent, accessible, and maintainable text truncation across the entire application.
