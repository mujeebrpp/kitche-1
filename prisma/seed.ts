import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌴 Seeding Kerala-based snacks data...')

  // Kerala-based ingredients
  const ingredients = await Promise.all([
    // Rice-based ingredients
    prisma.ingredient.upsert({
      where: { name: 'Rice Flour' },
      update: {},
      create: { name: 'Rice Flour', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Raw Rice' },
      update: {},
      create: { name: 'Raw Rice', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Parboiled Rice' },
      update: {},
      create: { name: 'Parboiled Rice', unit: 'kg' },
    }),

    // Coconut products
    prisma.ingredient.upsert({
      where: { name: 'Fresh Coconut' },
      update: {},
      create: { name: 'Fresh Coconut', unit: 'piece' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Coconut Oil' },
      update: {},
      create: { name: 'Coconut Oil', unit: 'litre' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Coconut Milk' },
      update: {},
      create: { name: 'Coconut Milk', unit: 'ml' },
    }),

    // Jaggery and sweeteners
    prisma.ingredient.upsert({
      where: { name: 'Jaggery' },
      update: {},
      create: { name: 'Jaggery', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Sugar' },
      update: {},
      create: { name: 'Sugar', unit: 'kg' },
    }),

    // Spices and flavorings
    prisma.ingredient.upsert({
      where: { name: 'Cardamom' },
      update: {},
      create: { name: 'Cardamom', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Cumin Seeds' },
      update: {},
      create: { name: 'Cumin Seeds', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Black Sesame Seeds' },
      update: {},
      create: { name: 'Black Sesame Seeds', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Salt' },
      update: {},
      create: { name: 'Salt', unit: 'g' },
    }),

    // Lentils and pulses
    prisma.ingredient.upsert({
      where: { name: 'Urad Dal' },
      update: {},
      create: { name: 'Urad Dal', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Chana Dal' },
      update: {},
      create: { name: 'Chana Dal', unit: 'kg' },
    }),

    // Other essentials
    prisma.ingredient.upsert({
      where: { name: 'Banana Leaves' },
      update: {},
      create: { name: 'Banana Leaves', unit: 'piece' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Ghee' },
      update: {},
      create: { name: 'Ghee', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Water' },
      update: {},
      create: { name: 'Water', unit: 'ml' },
    }),
  ])

  console.log('✅ Ingredients seeded')

  // Kerala snack recipes
  const recipes = await Promise.all([
    // 1. Unniyappam (Sweet Rice Fritters)
    prisma.recipe.upsert({
      where: { name: 'Unniyappam' },
      update: {},
      create: {
        name: 'Unniyappam',
        description: 'Traditional Kerala sweet rice fritters made with jaggery and banana',
      },
    }),
    
    // 2. Achappam (Rose Cookies)
    prisma.recipe.upsert({
      where: { name: 'Achappam' },
      update: {},
      create: {
        name: 'Achappam',
        description: 'Crispy rose-shaped cookies made with rice flour and coconut milk',
      },
    }),
    
    // 3. Neyyappam (Ghee Rice Pancakes)
    prisma.recipe.upsert({
      where: { name: 'Neyyappam' },
      update: {},
      create: {
        name: 'Neyyappam',
        description: 'Soft and sweet rice pancakes fried in ghee',
      },
    }),
    
    // 4. Parippu Vada (Dal Fritters)
    prisma.recipe.upsert({
      where: { name: 'Parippu Vada' },
      update: {},
      create: {
        name: 'Parippu Vada',
        description: 'Crispy lentil fritters, a popular tea-time snack',
      },
    }),
    
    // 5. Sukhiyan (Sweet Moong Dal Bondas)
    prisma.recipe.upsert({
      where: { name: 'Sukhiyan' },
      update: {},
      create: {
        name: 'Sukhiyan',
        description: 'Sweet bondas made with green gram and jaggery',
      },
    }),
    
    // 6. Pazham Pori (Banana Fritters)
    prisma.recipe.upsert({
      where: { name: 'Pazham Pori' },
      update: {},
      create: {
        name: 'Pazham Pori',
        description: 'Ripe banana fritters coated in rice flour batter',
      },
    }),
  ])

  console.log('✅ Recipes seeded')

  // Recipe ingredients for each snack
  const recipeIngredients = [
    // Unniyappam ingredients
    { recipe: 'Unniyappam', ingredient: 'Rice Flour', quantity: 1 },
    { recipe: 'Unniyappam', ingredient: 'Jaggery', quantity: 0.5 },
    { recipe: 'Unniyappam', ingredient: 'Coconut Oil', quantity: 0.3 },
    { recipe: 'Unniyappam', ingredient: 'Cardamom', quantity: 10 },
    { recipe: 'Unniyappam', ingredient: 'Fresh Coconut', quantity: 1 },
    
    // Achappam ingredients
    { recipe: 'Achappam', ingredient: 'Rice Flour', quantity: 1 },
    { recipe: 'Achappam', ingredient: 'Coconut Milk', quantity: 200 },
    { recipe: 'Achappam', ingredient: 'Sugar', quantity: 0.2 },
    { recipe: 'Achappam', ingredient: 'Cumin Seeds', quantity: 5 },
    { recipe: 'Achappam', ingredient: 'Coconut Oil', quantity: 0.5 },
    
    // Neyyappam ingredients
    { recipe: 'Neyyappam', ingredient: 'Raw Rice', quantity: 1 },
    { recipe: 'Neyyappam', ingredient: 'Jaggery', quantity: 0.5 },
    { recipe: 'Neyyappam', ingredient: 'Ghee', quantity: 0.2 },
    { recipe: 'Neyyappam', ingredient: 'Cardamom', quantity: 8 },
    { recipe: 'Neyyappam', ingredient: 'Fresh Coconut', quantity: 1 },
    
    // Parippu Vada ingredients
    { recipe: 'Parippu Vada', ingredient: 'Chana Dal', quantity: 1 },
    { recipe: 'Parippu Vada', ingredient: 'Salt', quantity: 20 },
    { recipe: 'Parippu Vada', ingredient: 'Coconut Oil', quantity: 0.3 },
    { recipe: 'Parippu Vada', ingredient: 'Cumin Seeds', quantity: 10 },
    
    // Sukhiyan ingredients
    { recipe: 'Sukhiyan', ingredient: 'Urad Dal', quantity: 0.5 },
    { recipe: 'Sukhiyan', ingredient: 'Jaggery', quantity: 0.3 },
    { recipe: 'Sukhiyan', ingredient: 'Coconut Oil', quantity: 0.2 },
    { recipe: 'Sukhiyan', ingredient: 'Cardamom', quantity: 5 },
    
    // Pazham Pori ingredients
    { recipe: 'Pazham Pori', ingredient: 'Rice Flour', quantity: 0.5 },
    { recipe: 'Pazham Pori', ingredient: 'Sugar', quantity: 0.1 },
    { recipe: 'Pazham Pori', ingredient: 'Coconut Oil', quantity: 0.3 },
    { recipe: 'Pazham Pori', ingredient: 'Salt', quantity: 5 },
  ]

  // Create recipe ingredients
  for (const item of recipeIngredients) {
    const recipe = recipes.find(r => r.name === item.recipe)
    const ingredient = ingredients.find(i => i.name === item.ingredient)
    
    if (recipe && ingredient) {
      await prisma.recipeItem.create({
        data: {
          recipeId: recipe.id,
          ingredientId: ingredient.id,
          quantity: item.quantity,
        },
      })
    }
  }

  console.log('✅ Recipe ingredients seeded')

  // Initial stock for ingredients
  const stockItems = [
    { ingredient: 'Rice Flour', quantity: 10 },
    { ingredient: 'Raw Rice', quantity: 25 },
    { ingredient: 'Parboiled Rice', quantity: 15 },
    { ingredient: 'Fresh Coconut', quantity: 50 },
    { ingredient: 'Coconut Oil', quantity: 5 },
    { ingredient: 'Coconut Milk', quantity: 2000 },
    { ingredient: 'Jaggery', quantity: 8 },
    { ingredient: 'Sugar', quantity: 5 },
    { ingredient: 'Cardamom', quantity: 500 },
    { ingredient: 'Cumin Seeds', quantity: 300 },
    { ingredient: 'Black Sesame Seeds', quantity: 200 },
    { ingredient: 'Salt', quantity: 1000 },
    { ingredient: 'Urad Dal', quantity: 5 },
    { ingredient: 'Chana Dal', quantity: 8 },
    { ingredient: 'Banana Leaves', quantity: 100 },
    { ingredient: 'Ghee', quantity: 3 },
  ]

  // Clear existing stock and create new
  await prisma.stock.deleteMany({})
  for (const item of stockItems) {
    const ingredient = ingredients.find(i => i.name === item.ingredient)
    if (ingredient) {
      await prisma.stock.create({
        data: {
          ingredientId: ingredient.id,
          quantity: item.quantity,
        },
      })
    }
  }

  console.log('✅ Initial stock seeded')

  // Sample purchases
  const purchases = [
    { ingredient: 'Rice Flour', quantity: 5, unitPrice: 45, totalCost: 225 },
    { ingredient: 'Jaggery', quantity: 3, unitPrice: 80, totalCost: 240 },
    { ingredient: 'Coconut Oil', quantity: 2, unitPrice: 180, totalCost: 360 },
    { ingredient: 'Fresh Coconut', quantity: 20, unitPrice: 25, totalCost: 500 },
    { ingredient: 'Cardamom', quantity: 100, unitPrice: 8, totalCost: 800 },
  ]

  for (const purchase of purchases) {
    const ingredient = ingredients.find(i => i.name === purchase.ingredient)
    if (ingredient) {
      await prisma.purchase.create({
        data: {
          ingredientId: ingredient.id,
          quantity: purchase.quantity,
          unitPrice: purchase.unitPrice,
          totalCost: purchase.totalCost,
        },
      })
    }
  }

  console.log('✅ Sample purchases seeded')

  // Sample production records
  const productionRecords = [
    { recipe: 'Unniyappam', quantity: 50, labourCost: 200, overheadCost: 50, packagingCost: 30 },
    { recipe: 'Achappam', quantity: 30, labourCost: 150, overheadCost: 40, packagingCost: 25 },
    { recipe: 'Parippu Vada', quantity: 40, labourCost: 180, overheadCost: 45, packagingCost: 20 },
  ]

  for (const prod of productionRecords) {
    const recipe = recipes.find(r => r.name === prod.recipe)
    if (recipe) {
      await prisma.production.create({
        data: {
          recipeId: recipe.id,
          quantity: prod.quantity,
          labourCost: prod.labourCost,
          overheadCost: prod.overheadCost,
          packagingCost: prod.packagingCost,
        },
      })
    }
  }

  console.log('✅ Sample production records seeded')

  // Sample orders
  const orders = [
    { customerName: 'Anand Sweets', status: 'completed' },
    { customerName: 'Kerala Bakery', status: 'processing' },
    { customerName: 'Tea Shop Junction', status: 'pending' },
  ]

  for (const order of orders) {
    await prisma.order.create({
      data: {
        customerName: order.customerName,
        status: order.status,
        orderItems: {
          create: [
            {
              recipeId: recipes.find(r => r.name === 'Unniyappam')!.id,
              quantity: 20,
              unitPrice: 15,
              totalPrice: 300,
            },
            {
              recipeId: recipes.find(r => r.name === 'Parippu Vada')!.id,
              quantity: 30,
              unitPrice: 12,
              totalPrice: 360,
            },
          ],
        },
      },
    })
  }

  console.log('✅ Sample orders seeded')

  // Create Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: 'System Administrator',
      email: 'admin@kimikitchen.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created')
  console.log('📧 Admin credentials:')
  console.log('   Username: admin')
  console.log('   Password: admin123')
  console.log('   Email: admin@kimikitchen.com')
  console.log('   Role: ADMIN')

  // Create Manager user
  const managerPassword = await bcrypt.hash('manager123', 12)
  
  const managerUser = await prisma.user.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      name: 'Kitchen Manager',
      email: 'manager@kimikitchen.com',
      password: managerPassword,
      role: 'MANAGER',
    },
  })

  console.log('✅ Manager user created')
  console.log('📧 Manager credentials:')
  console.log('   Username: manager')
  console.log('   Password: manager123')
  console.log('   Email: manager@kimikitchen.com')
  console.log('   Role: MANAGER')

  // Create Chef user
  const chefPassword = await bcrypt.hash('chef123', 12)
  
  const chefUser = await prisma.user.upsert({
    where: { username: 'chef' },
    update: {},
    create: {
      username: 'chef',
      name: 'Head Chef',
      email: 'chef@kimikitchen.com',
      password: chefPassword,
      role: 'CHEF',
    },
  })

  console.log('✅ Chef user created')
  console.log('📧 Chef credentials:')
  console.log('   Username: chef')
  console.log('   Password: chef123')
  console.log('   Email: chef@kimikitchen.com')
  console.log('   Role: CHEF')

  // Create Customer user
  const customerPassword = await bcrypt.hash('customer123', 12)
  
  const customerUser = await prisma.user.upsert({
    where: { username: 'customer' },
    update: {},
    create: {
      username: 'customer',
      name: 'Sample Customer',
      email: 'customer@kimikitchen.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  })

  console.log('✅ Customer user created')
  console.log('📧 Customer credentials:')
  console.log('   Username: customer')
  console.log('   Password: customer123')
  console.log('   Email: customer@kimikitchen.com')
  console.log('   Role: CUSTOMER')

  console.log('🌴 Kerala snacks seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
