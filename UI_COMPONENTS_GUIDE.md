# UI Components Library - Complete Guide ??

## Overview
The FoodBridge application now includes a complete UI component library based on the Tailwind admin dashboard template. All components are fully styled, responsive, and support dark mode.

## Available Components

### 1. Button Component

**Location:** `src/components/ui/Button.jsx`

**Usage:**
```jsx
import { Button } from '../components/ui';

// Primary button
<Button variant="primary" onClick={handleClick}>
 Click Me
</Button>

// Secondary button
<Button variant="secondary" size="sm">
  Cancel
</Button>

// Danger button
<Button variant="danger" disabled>
  Delete
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset'
- `onClick`: function
- `className`: string (additional Tailwind classes)

---

### 2. Card Component

**Location:** `src/components/ui/Card.jsx`

**Usage:**
```jsx
import { Card } from '../components/ui';

<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Without padding
<Card padding={false}>
  Custom content
</Card>

// Without shadow
<Card shadow={false}>
  Flat card
</Card>
```

**Props:**
- `padding`: boolean (default: true)
- `shadow`: boolean (default: true)
- `className`: string

---

### 3. Badge Component

**Location:** `src/components/ui/Badge.jsx`

**Usage:**
```jsx
import { Badge } from '../components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="danger" size="sm">Inactive</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="info">New</Badge>
```

**Props:**
- `variant`: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'gray'
- `size`: 'sm' | 'md' | 'lg'
- `className`: string

---

### 4. Alert Component

**Location:** `src/components/ui/Alert.jsx`

**Usage:**
```jsx
import { Alert } from '../components/ui';

<Alert variant="success" title="Success!">
  Your changes have been saved.
</Alert>

<Alert 
  variant="danger"
 title="Error"
  onClose={() => console.log('closed')}
>
  Something went wrong.
</Alert>
```

**Props:**
- `variant`: 'success' | 'danger' | 'warning' | 'info'
- `title`: string (optional)
- `onClose`: function (shows close button if provided)
- `className`: string

---

### 5. Input Component

**Location:** `src/components/ui/Input.jsx`

**Usage:**
```jsx
import { Input } from '../components/ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
icon={
    <svg className="h-5 w-5" /* email icon */>
      {/* SVG path */}
    </svg>
  }
/>

<Input
  label="Password"
  type="password"
  error="Password is required"
/>
```

**Props:**
- `label`: string
- `type`: string (default: 'text')
- `placeholder`: string
- `error`: string (shows error message)
- `icon`: React node (displayed on left side)
- `required`: boolean
- `disabled`: boolean
- `className`: string
- `containerClassName`: string

---

### 6. Modal Component

**Location:** `src/components/ui/Modal.jsx`

**Usage:**
```jsx
import { useState } from 'react';
import { Modal, Button } from '../components/ui';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
   Open Modal
</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
 size="md"
   >
  <p>Modal content goes here</p>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => setIsOpen(false)}>Close</Button>
          <Button variant="primary">Save</Button>
        </div>
      </Modal>
    </>
  );
}
```

**Props:**
- `isOpen`: boolean (required)
- `onClose`: function (required)
- `title`: string (required)
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean (default: true)
- `className`: string

**Features:**
- Closes on Escape key
- Closes on backdrop click
- Prevents body scroll when open
- Smooth animations

---

### 7. Table Component

**Location:** `src/components/ui/Table.jsx`

**Usage:**
```jsx
import { Table, Badge } from '../components/ui';

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { 
    header: 'Status', 
    accessor: 'status',
    render: (value) => (
   <Badge variant={value === 'active' ? 'success' : 'danger'}>
        {value}
      </Badge>
    )
  },
  {
    header: 'Actions',
    accessor: 'id',
    render: (id) => (
      <button onClick={() => handleEdit(id)}>Edit</button>
    )
  }
];

const data = [
  { name: 'John Doe', email: 'john@example.com', status: 'active', id: 1 },
  { name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', id: 2 },
];

<Table
  columns={columns}
  data={data}
  striped
  hoverable
/>
```

**Props:**
- `columns`: array of column objects (required)
  - `header`: string (column header)
  - `accessor`: string (data key)
  - `render`: function (custom cell renderer)
  - `headerClassName`: string
  - `cellClassName`: string
- `data`: array (required)
- `striped`: boolean (alternating row colors)
- `hoverable`: boolean (hover effect on rows)
- `className`: string

---

### 8. Dropdown Component

**Location:** `src/components/ui/Dropdown.jsx`

**Usage:**
```jsx
import { Dropdown, Button } from '../components/ui';

<Dropdown
  trigger={
  <Button variant="ghost">Options</Button>
  }
  position="bottom-right"
>
  <Dropdown.Item 
    icon={<svg>...</svg>}
    onClick={() => console.log('Edit')}
  >
    Edit
  </Dropdown.Item>
  <Dropdown.Item onClick={() => console.log('Delete')}>
    Delete
  </Dropdown.Item>
</Dropdown>
```

**Props:**
- `trigger`: React node (required - element that opens dropdown)
- `position`: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
- `className`: string

**Dropdown.Item Props:**
- `icon`: React node
- `onClick`: function
- `className`: string

**Features:**
- Closes on outside click
- Keyboard accessible
- Multiple positioning options

---

## Component Examples

### Complete Form Example

```jsx
import { Card, Input, Button, Alert } from '../components/ui';
import { useState } from 'react';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    setSuccess(true);
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      
      {success && (
        <Alert variant="success" title="Success!" onClose={() => setSuccess(false)}>
    Your message has been sent.
        </Alert>
  )}

      <form onSubmit={handleSubmit} className="space-y-4">
  <Input
     label="Name"
          required
    value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          error={errors.name}
        />
        
        <Input
   label="Email"
 type="email"
          required
      value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
     error={errors.email}
        />
        
        <div className="flex gap-3">
    <Button type="submit" variant="primary">Send</Button>
          <Button type="button" variant="ghost">Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
```

### Data Table with Actions Example

```jsx
import { Table, Badge, Button, Modal } from '../components/ui';
import { useState } from 'react';

function DonationsTable() {
  const [selectedDonation, setSelectedDonation] = useState(null);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Donor', accessor: 'donor' },
    { header: 'Amount', accessor: 'amount', render: (value) => `$${value}` },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value) => (
<Badge variant={value === 'completed' ? 'success' : 'warning'}>
          {value}
</Badge>
      )
    },
  {
      header: 'Actions',
      accessor: 'id',
    render: (id, row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setSelectedDonation(row)}>
 View
          </Button>
  <Button size="sm" variant="danger">Delete</Button>
        </div>
      )
  }
  ];

  const donations = [
    { id: 1, donor: 'John Doe', amount: 100, status: 'completed' },
    { id: 2, donor: 'Jane Smith', amount: 250, status: 'pending' },
];

  return (
    <>
   <Table columns={columns} data={donations} striped hoverable />
      
      {selectedDonation && (
     <Modal
          isOpen={!!selectedDonation}
       onClose={() => setSelectedDonation(null)}
        title="Donation Details"
        >
       <p>Donor: {selectedDonation.donor}</p>
  <p>Amount: ${selectedDonation.amount}</p>
        <p>Status: {selectedDonation.status}</p>
        </Modal>
      )}
    </>
  );
}
```

---

## Styling Customization

### Using Tailwind Classes

All components accept a `className` prop for additional Tailwind classes:

```jsx
<Button className="w-full mt-4">
  Full Width Button
</Button>

<Card className="hover:shadow-xl transition-shadow">
  Card with custom hover effect
</Card>
```

### Custom Variants

Components use `tailwind-merge` to properly merge classes. You can override defaults:

```jsx
<Badge className="bg-purple-100 text-purple-700">
  Custom Color Badge
</Badge>
```

---

## Dark Mode Support

All components automatically support dark mode using Tailwind's `dark:` variant:

```jsx
// Automatically adjusts for dark mode
<Card>Content</Card>
<Button variant="primary">Button</Button>
<Input label="Name" />
```

---

## Responsive Design

Components are mobile-first and responsive:

```jsx
// Responsive button
<Button className="w-full sm:w-auto">
  Button
</Button>

// Responsive grid of cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

---

## Icons

For icons, you can use inline SVG or icon libraries:

### Using Inline SVG

```jsx
<Button>
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
  </svg>
  Add New
</Button>
```

### Using Heroicons (Recommended)

```bash
npm install @heroicons/react
```

```jsx
import { PlusIcon } from '@heroicons/react/24/outline';

<Button>
  <PlusIcon className="w-5 h-5 mr-2" />
  Add New
</Button>
```

---

## Best Practices

### 1. Component Composition

```jsx
// Good - Compose components
<Card>
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">Title</h3>
    <Badge variant="success">Active</Badge>
  </div>
  <p>Content...</p>
</Card>
```

### 2. Form Validation

```jsx
// Good - Show errors with Input component
<Input
  label="Email"
  error={errors.email}
  onChange={handleChange}
/>
```

### 3. Loading States

```jsx
// Good - Disable button during loading
<Button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### 4. Accessibility

```jsx
// Good - Use proper labels and ARIA attributes
<Input
  label="Search"
  placeholder="Search donations..."
  aria-label="Search donations"
/>
```

---

## Build & Deploy

The UI components are included in the build:

```bash
npm run build
```

**Build Output:**
```
dist/assets/index-*.css   26.94 kB ? gzip: 6.02 kB ?
dist/assets/index-*.js   301.32 kB ? gzip: 97.42 kB ?
```

---

## Next Steps

1. **Add more components as needed:**
   - Tabs
   - Accordion
   - Tooltip
   - Toast notifications
   - Pagination
   - Date picker

2. **Create page-specific components:**
   - DonationCard
   - RequestCard
   - OrganizationProfile

3. **Enhance existing components:**
   - Add loading states
   - Add animation variants
   - Add more size options

---

## Troubleshooting

### Styles Not Applying

1. **Check Tailwind config** includes component paths:
```js
content: [
  "./src/**/*.{js,jsx}",
],
```

2. **Restart dev server:**
```bash
npm run dev
```

### Import Errors

1. **Use named imports:**
```jsx
import { Button, Card } from '../components/ui';
```

2. **Or individual imports:**
```jsx
import Button from '../components/ui/Button';
```

---

## Component Checklist

? Button - Multiple variants and sizes  
? Card - Container with shadow and border  
? Badge - Status indicators  
? Alert - Success, error, warning, info  
? Input - Text input with label and error  
? Modal - Dialog with overlay  
? Table - Data table with custom cells  
? Dropdown - Context menu  

---

**All components are production-ready and fully styled!** ??

Use these components throughout your application for a consistent, professional look.
