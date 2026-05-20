# BetterKing Kitchen Website

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-9.3.1-green?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

A comprehensive, multi-language e-commerce platform for kitchen products built with **Next.js 16**, **React 19**, **MongoDB**, and **TypeScript**. Features a complete admin dashboard, product management system, order tracking, and quote generation.

**GitHub Repository:** [https://github.com/Ifteharr001/betterking-kitchen-website](https://github.com/Ifteharr001/betterking-kitchen-website)


## ✨ Features

### Frontend Features
- 🌍 **Multi-language Support** - English, Bengali, Chinese, Spanish, French, and Arabic
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🛍️ **Product Catalog** - Browse products by categories and industries
- 🔍 **Advanced Search** - Filter products by various criteria
- 💬 **Quote System** - Request custom quotes for products
- 📧 **Contact Form** - Easy customer communication
- 📰 **Blog/News Section** - Stay updated with latest news
- 🏢 **Industry Solutions** - Showcase solutions for different industries
- 🚀 **Order Tracking** - Real-time order status tracking
- 📞 **Floating Contact Widget** - Always accessible customer support
- ✍️ **About Us & Privacy Pages** - Complete information about the company

### Admin Dashboard Features
- 🔐 **Secure Authentication** - NextAuth integration with email/password
- 📊 **Dashboard Analytics** - Overview of key metrics
- 🛒 **Product Management** - Create, update, delete products with image uploads
- 📂 **Category Management** - Manage product categories and subcategories
- 🏭 **Industry Management** - Manage industry-specific solutions
- 📰 **News Management** - Create and manage blog posts
- 📦 **Order Management** - View and manage customer orders
- 💼 **Quote Management** - Handle customer quote requests
- 📧 **Message Management** - Manage customer inquiries
- ☁️ **Cloud Image Upload** - Cloudinary integration for image management

### Technical Features
- ⚡ **Server-Side Rendering (SSR)** - Optimized performance with Next.js
- 🔄 **API Routes** - RESTful API endpoints
- 🗄️ **MongoDB** - Flexible document database
- 🔒 **Password Hashing** - bcryptjs for secure authentication
- 🖼️ **Image Optimization** - WebP and AVIF format support
- 🎨 **Component Library** - Radix UI with custom styling
- 🌐 **Internationalization** - next-intl for seamless language switching
- 📱 **Progressive Web App** - Top loader for better UX
- 🧹 **TypeScript** - Full type safety throughout the project

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.1.6
- **UI Library:** React 19.2.3
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4.19
- **UI Components:** Radix UI (Accordion, Dialog, Select, Tabs, Toast, Tooltip, etc.)
- **Icons:** Lucide React
- **Internationalization:** next-intl 4.8.3
- **Animations:** Tailwind CSS Animate

### Backend
- **Runtime:** Node.js with Next.js API Routes
- **Database:** MongoDB 9.3.1 with Mongoose ODM
- **Authentication:** NextAuth.js 4.24.13
- **Image Upload:** Cloudinary with next-cloudinary 6.17.5
- **Password Hashing:** bcryptjs 3.0.3

### Development Tools
- **Build Tool:** Next.js Bundle Analyzer
- **CSS:** PostCSS, Autoprefixer
- **Code Compilation:** Babel React Compiler

---

## 🌐 Supported Languages

The website is available in the following languages:

| Language | Code |
|----------|------|
| English | en |
| Bengali | bn |
| Chinese (Simplified) | zh |
| Spanish | es |
| French | fr |
| Arabic | ar |

Language switching is automatic based on browser locale or user selection.

---

## 📦 Installation

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **MongoDB** instance (cloud)
- **Cloudinary** account for image uploads
- **GitHub account** for authentication setup

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ifteharr001/betterking-kitchen-website.git
   cd betterking-kitchen-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables))

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (if needed for notifications)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### How to Get API Keys

- **MongoDB:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Cloudinary:** [Cloudinary Dashboard](https://cloudinary.com/console)
- **NextAuth Secret:** Generate with: `openssl rand -base64 32`

---

## 🚀 Usage

### Development
```bash
npm run dev
```
Starts the development server with hot-reload on http://localhost:3000

### Build
```bash
npm run build
```
Creates an optimized production build

### Production
```bash
npm start
```
Runs the production server

### Build Analysis
```bash
npm run build -- --analyze
```
Analyzes the bundle size

---

## 📁 Project Structure

```
betterking_kitchen_website/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (admin)/          # Admin routes & pages
│   │   │   │   ├── admin/
│   │   │   │   │   ├── categories/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── industries/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── messages/
│   │   │   │   │   ├── news/
│   │   │   │   │   ├── orders/
│   │   │   │   │   ├── products/
│   │   │   │   │   └── quotes/
│   │   │   │   └── components/
│   │   │   ├── (site)/           # Public site routes
│   │   │   │   ├── about/
│   │   │   │   ├── categories/
│   │   │   │   ├── contact/
│   │   │   │   ├── industries/
│   │   │   │   ├── news/
│   │   │   │   ├── products/
│   │   │   │   ├── projects/
│   │   │   │   ├── solutions/
│   │   │   │   └── components/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── admin/            # Admin API endpoints
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── categories/
│   │   │   ├── contact/
│   │   │   ├── industries/
│   │   │   ├── products/
│   │   │   ├── quote/
│   │   │   └── track-order/
│   │   └── globals.css
│   ├── components/               # Shared components
│   │   ├── ui/                   # Radix UI components
│   │   ├── ImageUpload.tsx
│   │   └── Providers.tsx
│   ├── hooks/                    # Custom React hooks
│   ├── lib/
│   │   ├── db.ts                 # MongoDB connection
│   │   └── utils.ts
│   ├── models/                   # MongoDB schemas
│   │   ├── Admin.ts
│   │   ├── Blog.ts
│   │   ├── Category.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Quote.ts
│   │   └── ...
│   └── middleware.ts             # Next.js middleware
├── messages/                      # i18n translation files
│   ├── en.json
│   ├── bn.json
│   ├── zh.json
│   ├── es.json
│   ├── fr.json
│   └── ar.json
├── public/                        # Static assets
├── i18n.ts                        # i18n configuration
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS config
├── tsconfig.json                  # TypeScript config
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Products
- `GET /api/products` - Fetch all products
- `GET /api/products/[productId]` - Fetch single product
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products` - Update product (admin)
- `DELETE /api/admin/products` - Delete product (admin)

### Categories
- `GET /api/categories` - Fetch all categories
- `POST /api/admin/categories` - Create category (admin)
- `PUT /api/admin/categories` - Update category (admin)
- `DELETE /api/admin/categories` - Delete category (admin)

### Industries
- `GET /api/industries` - Fetch all industries
- `POST /api/admin/industries` - Create industry (admin)
- `PUT /api/admin/industries` - Update industry (admin)

### Orders
- `GET /api/track-order` - Track order
- `POST /api/admin/orders` - Create/manage orders (admin)

### Quotes
- `POST /api/quote` - Submit quote request
- `GET /api/admin/quotes` - View quotes (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Fetch messages (admin)

### News/Blog
- `POST /api/admin/news` - Create news (admin)
- `GET /api/admin/news` - Fetch all news (admin)

---

## 🔐 Authentication

The project uses **NextAuth.js** for authentication with the following features:

- Email/Password authentication
- Secure session management
- Password hashing with bcryptjs
- Admin role-based access control
- Protected API routes and pages

### Login
Navigate to `/admin/login` to access the admin dashboard.

---

## 🌐 Deployment

### Recommended Platforms

#### Vercel (Recommended for Next.js)
1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy with one click

#### Netlify
1. Build: `npm run build`
2. Publish directory: `.next`
3. Add environment variables
4. Deploy

#### Self-Hosted (Docker)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Pre-deployment Checklist
- [ ] Set all environment variables
- [ ] Test admin authentication
- [ ] Verify MongoDB connection
- [ ] Configure Cloudinary API keys
- [ ] Test all API endpoints
- [ ] Run production build locally
- [ ] Update NEXTAUTH_URL for production
- [ ] Set up CDN for static assets

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components from `/src/components/ui`
- Test all new features locally
- Update documentation for new features
- Ensure code is properly formatted

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 📞 Support & Contact

For support, issues, or feature requests:

- **GitHub Issues:** [https://github.com/Ifteharr001/betterking-kitchen-website/issues](https://github.com/Ifteharr001/betterking-kitchen-website/issues)
- **Email:** Contact through the website contact form
- **Website:** Visit the live website for more information

---

## 🎉 Acknowledgments

- **Next.js** - React framework for production
- **Radix UI** - Headless UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB** - NoSQL database
- **Cloudinary** - Cloud image management
- **NextAuth.js** - Authentication for Next.js

---

**Made with ❤️ by [Iftehar Rahat](https://github.com/Ifteharr001)**

Last Updated: April 27, 2026
