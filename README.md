# APEX Fragrances - Luxury E-commerce Website

A complete Next.js + TypeScript e-commerce website for luxury perfumes with modern design, comprehensive features, and production-ready architecture.

## 🚀 Features

### Core Functionality
- **Complete E-commerce Flow**: Product browsing, cart management, checkout process
- **User Authentication**: Sign up, login, account management with persistent sessions
- **Advanced Product Filtering**: Filter by category, price, notes, longevity, sillage
- **Search Functionality**: Client-side fuzzy search across products and notes
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Dark/Light Theme**: System-aware theme with manual toggle and localStorage persistence

### Technical Features
- **State Management**: Zustand for cart, theme, and authentication
- **Form Validation**: react-hook-form + zod for robust form handling
- **SEO Optimized**: JSON-LD schema, meta tags, Open Graph support
- **Performance**: Code-splitting with React.lazy, optimized images
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **TypeScript**: Fully typed for better development experience

### UI/UX
- **Luxury Design**: Premium aesthetic with careful attention to typography and spacing
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Toast Notifications**: User feedback for actions like adding to cart
- **Modal System**: Reusable modal components for various interactions
- **Loading States**: Skeleton loaders and loading indicators

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Next.js (App Router)** - File-based routing, server components, and RSC
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework with custom theme

### State & Forms
- **Zustand** - Lightweight state management
- **react-hook-form** - Performant forms with easy validation
- **zod** - TypeScript-first schema validation

### UI & Icons
- **Lucide React** - Beautiful, customizable icons
- **Custom Components** - Reusable UI components with consistent design

## 📁 Project Structure

```
src/
├── app/                # Next.js App Router pages and layouts
├── components/         # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Modal, etc.)
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── commerce/       # E-commerce specific components
├── stores/             # Zustand stores (cart, theme, auth)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
├── data/               # Mock data (products.json)
└── assets/             # Static assets
```

Note: The project has fully migrated to Next.js App Router. Any previous references to Vite or React Router are legacy and have been removed from the codebase.

## 🎨 Design System

### Colors
- **Primary**: Dark charcoal (#0B0B0C) with tints
- **Accent**: Luxury gold (#C9A227) for highlights
- **Neutral**: Off-white (#F7F7F8) for backgrounds
- **Status Colors**: Success, warning, error states

### Typography
- **Font**: Inter - Clean, modern sans-serif
- **Headings**: Generous letter-spacing for luxury feel
- **Body**: Optimized line-height (150%) for readability

### Components
- **8px Grid System**: Consistent spacing throughout
- **Rounded Corners**: Subtle border-radius for modern look
- **Shadows**: Layered shadow system for depth
- **Animations**: Smooth transitions and hover effects

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apex-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check

## 🛍 Demo Data

The application includes comprehensive mock data for:

### Products (20+ items)
- **Men's Collection**: Woody, spicy, and fresh fragrances
- **Women's Collection**: Floral, sweet, and elegant scents
- **Unisex Collection**: Versatile, sophisticated fragrances
- **Solid Perfumes**: Portable, concentrated versions

### Product Features
- **Detailed Information**: Notes (top/heart/base), longevity, sillage
- **Performance Metrics**: Realistic duration and projection data
- **Pricing**: Various price points from $65-$220
- **Stock Management**: Inventory tracking
- **Badges**: New arrivals, bestsellers, sale items

## 🔐 Authentication

### Demo Account
- **Email**: demo@apex.com
- **Password**: password123

### Features
- **Form Validation**: Email format, password strength
- **Session Persistence**: User data stored in localStorage
- **Protected Routes**: Account page requires authentication
- **Mock System**: Simulates real authentication flow

## 🛒 E-commerce Features

### Shopping Cart
- **Persistent Storage**: Cart contents saved in localStorage
- **Quantity Management**: Increase/decrease/remove items
- **Price Calculation**: Subtotal, tax (8%), shipping
- **Free Shipping**: Threshold at $100
- **Drawer Interface**: Slide-out cart with quick actions

### Checkout Process
- **Form Validation**: Comprehensive shipping address validation
- **Payment Interface**: Mock payment form (no real processing)
- **Order Summary**: Detailed breakdown of costs
- **Security Indicators**: Trust signals throughout process

### Product Discovery
- **Advanced Filters**: Category, price range, fragrance notes, performance
- **Sort Options**: Popularity, price, rating, newest
- **Search**: Real-time search across names, descriptions, and notes
- **SEO**: JSON-LD product schema for search engines

## 🎨 Customization

### Theme Configuration
The design system can be customized in `tailwind.config.js`:

```javascript
colors: {
  primary: { /* Your brand colors */ },
  accent: { /* Accent colors */ },
  neutral: { /* Neutral palette */ }
}
```

### Adding Products
Update `src/data/products.json` with new product data following the established schema.

### Component Styling
All components use Tailwind classes with consistent patterns:
- Responsive design (`sm:`, `md:`, `lg:` prefixes)
- Dark mode support (`dark:` prefix)
- Hover states and transitions
- Accessibility considerations

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (single column, mobile navigation)
- **Tablet**: 768px - 1024px (adjusted grid layouts)
- **Desktop**: > 1024px (full feature set)

### Mobile Optimizations
- Touch-friendly buttons and inputs
- Collapsible navigation menu
- Optimized product cards
- Streamlined checkout flow

## 🔍 SEO & Performance

### SEO Features
- **Meta Tags**: Comprehensive meta information
- **Open Graph**: Social media sharing optimization
- **JSON-LD Schema**: Product markup for search engines
- **Semantic HTML**: Proper heading hierarchy and structure

### Performance Optimizations
- **Code Splitting**: Lazy-loaded route components
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Optimized imports and dependencies
- **Caching**: Browser caching for static assets

## 🎯 Future Enhancements

### Potential Additions
- **User Reviews**: Product rating and review system
- **Wishlist**: Save products for later
- **Recommendation Engine**: AI-powered product suggestions
- **Real Payment Integration**: Stripe or PayPal integration
- **Inventory Management**: Real-time stock updates
- **Email Notifications**: Order confirmations and updates
- **Multi-currency**: International pricing support
- **Advanced Analytics**: User behavior tracking

### Scalability Considerations
- **API Integration**: Ready for backend API integration
- **Database Schema**: Designed for easy database migration
- **State Management**: Scalable Zustand store structure
- **Component Architecture**: Modular, reusable components

## 📄 License

This project is created for demonstration purposes. The APEX brand and design are fictional.

## 🤝 Contributing

This is a demo project, but contributions for improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions about this demo project, please refer to the code comments and documentation within the source files.