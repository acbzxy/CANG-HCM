# Development Guide

## Bắt Đầu Phát Triển

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Khởi động development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại http://localhost:3000

### 3. Build production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

## Cấu Trúc Dự Án

```
src/
├── components/          # React components
│   ├── layout/         # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── ui/             # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── NotificationContainer.tsx
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── hooks/              # Custom hooks
│   └── useAuth.ts
├── pages/              # Page components
│   ├── WelcomePage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── PaymentPage.tsx
│   ├── AccountPage.tsx
│   ├── PasswordPage.tsx
│   ├── GuidePage.tsx
│   └── ReceiptLookupPage.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   └── mockApi.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Quy Ước Code

### 1. Naming Conventions
- **Components**: PascalCase (UserProfile.tsx)
- **Files**: camelCase hoặc kebab-case
- **Variables/Functions**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Types/Interfaces**: PascalCase

### 2. Component Structure
```tsx
import React from 'react'
import { SomeIcon } from '@heroicons/react/24/outline'

interface ComponentProps {
  title: string
  onClick?: () => void
}

const ComponentName: React.FC<ComponentProps> = ({ title, onClick }) => {
  return (
    <div className="component-class">
      <h1>{title}</h1>
    </div>
  )
}

export default ComponentName
```

### 3. Styling
- Sử dụng Tailwind CSS classes
- Tránh inline styles
- Sử dụng CSS variables cho themes
- Responsive design với mobile-first approach

### 4. State Management
- Sử dụng React Context cho global state
- useState cho local component state
- Custom hooks cho logic tái sử dụng

## Testing

### 1. Unit Tests
```bash
# Thêm testing framework
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### 2. E2E Tests
```bash
# Thêm Playwright hoặc Cypress
npm install --save-dev @playwright/test
```

## Deployment

### 1. Vercel
```bash
npm install -g vercel
vercel --prod
```

### 2. Netlify
```bash
npm run build
# Upload dist/ folder
```

### 3. GitHub Pages
```bash
npm run build
# Configure GitHub Pages to serve from dist/
```

## Environment Variables

Tạo file `.env.local` với các biến môi trường:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_ENV=development
VITE_ENABLE_DEV_TOOLS=true
```

## Best Practices

### 1. Performance
- Sử dụng React.memo() cho components có expensive renders
- Lazy loading cho routes
- Code splitting với dynamic imports
- Optimize images và assets

### 2. Accessibility
- Sử dụng semantic HTML
- Thêm ARIA labels
- Keyboard navigation support
- Color contrast compliance

### 3. Security
- Validate inputs client và server side
- Sanitize user data
- Implement CSRF protection
- Use HTTPS in production

### 4. Error Handling
- Error boundaries cho React components
- Global error handling
- User-friendly error messages
- Logging và monitoring

## Troubleshooting

### Common Issues

1. **Node modules conflict**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript errors**
   ```bash
   npm run type-check
   ```

3. **Build failures**
   ```bash
   npm run build --verbose
   ```

### Debug Tools
- React Developer Tools
- Redux DevTools (nếu sử dụng Redux)
- Browser DevTools
- Vite dev server logs

## Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Submit Pull Request

## Code Review Checklist

- [ ] Code follows naming conventions
- [ ] Components are properly typed
- [ ] No console.log statements
- [ ] Responsive design tested
- [ ] Accessibility compliance
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Tests added/updated
- [ ] Documentation updated
