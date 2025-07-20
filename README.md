# Kitchen Stock Manager - Recipes & Production Integration Guide

## Overview
This project is a comprehensive kitchen stock management system built with Next.js, TypeScript, and Prisma. It combines recipe management and production tracking into a unified interface for seamless workflow management.

## Features

### 🏗️ **Unified Recipes & Production Interface**
- **Single dashboard** for both recipe management and production tracking
- **Real-time statistics** showing total recipes, production batches, and values
- **Seamless navigation** between recipes and production without page reloads

### 📊 **Dashboard Summary**
- **Total Recipes** count
- **Total Production** batches
- **Items Produced** quantity
- **Total Production Value** in ₹

### 🔄 **Integrated Workflow**
- **One-click production** from any recipe
- **Recipe-based production** with automatic ingredient cost calculation
- **Production history** per recipe
- **Quick production** button for faster batch creation

### 📱 **User Interface**
- **Tab-based navigation** between Recipes and Production
- **Responsive design** for all screen sizes
- **Real-time updates** without page refresh
- **Inline actions** for faster operations

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SQLite (for development)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kitchen-stock-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### 📋 **Managing Recipes**
1. **Navigate to Recipes & Production** via the navigation menu
2. **Create new recipes** using the "Add Recipe" button
3. **View recipe details** by clicking "View Details"
4. **Edit recipes** using the "Edit" button
5. **Start production** directly from any recipe using the "Produce" button

### 🏭 **Managing Production**
1. **Switch to Production tab** in the unified interface
2. **Create new production batches** using the form
3. **Select recipes** from dropdown with real-time ingredient cost calculation
4. **Track production history** with cost breakdowns
5. **Monitor recent productions** on the recipes tab

### 📦 **Stock Management**
1. **Navigate to Stock** via the navigation menu
2. **Manage ingredients** and their stock levels
3. **Track purchases** and unit costs
4. **Monitor inventory** in real-time

### 📊 **Reports & Analytics**
1. **Access reports** via the navigation menu
2. **View production analytics**
3. **Track ingredient usage**
4. **Monitor costs and profitability**

## API Endpoints

### Recipes
- `GET /api/recipes` - List all recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/[id]` - Get recipe details
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe

### Production
- `GET /api/production` - List all productions
- `POST /api/production` - Create new production batch
- `GET /api/production/[id]` - Get production details

### Stock
- `GET /api/stock` - List current stock
- `POST /api/stock` - Update stock levels
- `GET /api/ingredients` - List all ingredients
- `POST /api/ingredients` - Create new ingredient

### Purchases
- `GET /api/purchases` - List all purchases
- `POST /api/purchases` - Record new purchase

## 📋 **ROLE PERMISSION MATRIX**

### **ADMIN (Full Access)**
- ✅ **User Management**: Create, edit, delete, activate/deactivate users
- ✅ **Stock**: Full CRUD including delete ingredients
- ✅ **Recipes**: Full CRUD operations
- ✅ **Production**: Full management and oversight
- ✅ **Orders**: Full management and status changes
- ✅ **Reports**: Full analytics access
- ✅ **System**: All administrative functions

### **MANAGER (Operations Management)**
- ✅ **User Management**: View users, change roles (not status)
- ❌ **Stock**: Cannot delete ingredients
- ✅ **Recipes**: Full CRUD operations
- ✅ **Production**: Full management
- ✅ **Orders**: Full management and status changes
- ✅ **Reports**: Full analytics access
- ❌ **System**: No administrative functions

### **CHEF (Kitchen Operations)**
- ❌ **User Management**: No access
- ❌ **Stock**: Cannot delete ingredients
- ✅ **Recipes**: Full CRUD operations
- ✅ **Production**: Full management
- ❌ **Orders**: View only, cannot change status
- ❌ **Reports**: No access
- ❌ **System**: No administrative functions

### **CUSTOMER (Limited Access)**
- ❌ **User Management**: No access
- ❌ **Stock**: No access
- ❌ **Recipes**: No access
- ❌ **Production**: No access
- ✅ **Orders**: View own orders only
- ❌ **Reports**: No access
- ❌ **System**: No administrative functions

## Database Schema

### Core Models
- **Ingredient** - Raw materials and their units
- **Recipe** - Product recipes with ingredients
- **RecipeItem** - Individual ingredients in recipes
- **Production** - Production batches with costs
- **ProductionCost** - Detailed cost breakdowns
- **Stock** - Current inventory levels
- **Purchase** - Purchase history with costs

## Development

### Adding New Features
1. **Database changes**: Update `prisma/schema.prisma`
2. **API endpoints**: Create/modify files in `src/app/api/`
3. **Frontend components**: Update relevant pages in `src/app/`
4. **Testing**: Test with sample data

### Code Structure
```
src/
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── orders/        # Order management
│   ├── recipes-production/  # Unified interface
│   ├── reports/       # Analytics and reports
│   ├── stock/         # Inventory management
│   └── globals.css    # Global styles
├── components/        # Reusable components
├── lib/              # Utilities and configurations
└── types/            # TypeScript definitions
```

## Troubleshooting

### Common Issues
1. **Database connection errors**: Check DATABASE_URL in .env
2. **Authentication issues**: Ensure NEXTAUTH_SECRET is set
3. **Build errors**: Run `npm run build` to check for issues

### Reset Database
```bash
npx prisma migrate reset
npx prisma db seed
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License - see LICENSE file for details
