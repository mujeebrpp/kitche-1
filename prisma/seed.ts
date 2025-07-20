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

    // Vegetables and fresh ingredients
    prisma.ingredient.upsert({
      where: { name: 'Onion' },
      update: {},
      create: { name: 'Onion', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Green Chili' },
      update: {},
      create: { name: 'Green Chili', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Ginger' },
      update: {},
      create: { name: 'Ginger', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Curry Leaves' },
      update: {},
      create: { name: 'Curry Leaves', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Fennel Seeds' },
      update: {},
      create: { name: 'Fennel Seeds', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Black Pepper' },
      update: {},
      create: { name: 'Black Pepper', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Nendran Banana' },
      update: {},
      create: { name: 'Nendran Banana', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Ripe Banana' },
      update: {},
      create: { name: 'Ripe Banana', unit: 'kg' },
    }),

    // Flours and binding agents
    prisma.ingredient.upsert({
      where: { name: 'Gram Flour' },
      update: {},
      create: { name: 'Gram Flour', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Maida' },
      update: {},
      create: { name: 'Maida', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Turmeric Powder' },
      update: {},
      create: { name: 'Turmeric Powder', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Chili Powder' },
      update: {},
      create: { name: 'Chili Powder', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Baking Soda' },
      update: {},
      create: { name: 'Baking Soda', unit: 'g' },
    }),

    // Protein ingredients
    prisma.ingredient.upsert({
      where: { name: 'Eggs' },
      update: {},
      create: { name: 'Eggs', unit: 'piece' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Chicken Boneless' },
      update: {},
      create: { name: 'Chicken Boneless', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Potato' },
      update: {},
      create: { name: 'Potato', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Mixed Vegetables' },
      update: {},
      create: { name: 'Mixed Vegetables', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Sweet Potato' },
      update: {},
      create: { name: 'Sweet Potato', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Raw Peanuts' },
      update: {},
      create: { name: 'Raw Peanuts', unit: 'kg' },
    }),

    // Additional spices and seasonings
    prisma.ingredient.upsert({
      where: { name: 'Ginger Garlic Paste' },
      update: {},
      create: { name: 'Ginger Garlic Paste', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Garam Masala' },
      update: {},
      create: { name: 'Garam Masala', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Yogurt' },
      update: {},
      create: { name: 'Yogurt', unit: 'ml' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Lemon Juice' },
      update: {},
      create: { name: 'Lemon Juice', unit: 'ml' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Bread Crumbs' },
      update: {},
      create: { name: 'Bread Crumbs', unit: 'g' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Tomato' },
      update: {},
      create: { name: 'Tomato', unit: 'kg' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Parotta' },
      update: {},
      create: { name: 'Parotta', unit: 'piece' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Coriander Leaves' },
      update: {},
      create: { name: 'Coriander Leaves', unit: 'g' },
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

  // Kerala snack recipes - 15 Standard Recipe Sheets
  const recipes = await Promise.all([
    // 1. Parippu Vada
    prisma.recipe.upsert({
      where: { name: 'Parippu Vada' },
      update: {},
      create: {
        name: 'Parippu Vada',
        description: 'Portion: 1 pc (~50g), Yield: ~25 vadas/kg dal. Soak dal 3–4h, grind coarsely, mix with ingredients, shape, fry crisp. Selling Price: ₹20',
      },
    }),

    // 2. Uzhunnu Vada
    prisma.recipe.upsert({
      where: { name: 'Uzhunnu Vada' },
      update: {},
      create: {
        name: 'Uzhunnu Vada',
        description: 'Portion: 1 pc (~50g), Yield: ~20 vadas/kg urad dal. Soak dal 3–4h, grind fluffy, mix, shape with hole, fry golden. Selling Price: ₹20–25',
      },
    }),

    // 3. Ulli Vada
    prisma.recipe.upsert({
      where: { name: 'Ulli Vada' },
      update: {},
      create: {
        name: 'Ulli Vada',
        description: 'Portion: 1 pc (~50g), Yield: ~15 vadas/kg onion. Mix onion with flours, spices, minimal water, pinch vadas, fry crisp. Selling Price: ₹20–25',
      },
    }),

    // 4. Pazham Pori
    prisma.recipe.upsert({
      where: { name: 'Pazham Pori' },
      update: {},
      create: {
        name: 'Pazham Pori',
        description: 'Portion: 1 pc (~60g), Yield: ~15 pcs/1.5 kg banana. Peel & slice banana lengthwise, dip in batter, fry golden. Selling Price: ₹20–30',
      },
    }),

    // 5. Egg Bajji
    prisma.recipe.upsert({
      where: { name: 'Egg Bajji' },
      update: {},
      create: {
        name: 'Egg Bajji',
        description: 'Portion: 1 pc (half egg coated), Yield: 10 bajjis/5 eggs. Boil eggs, halve, coat in batter, fry crisp. Selling Price: ₹30–40',
      },
    }),

    // 6. Egg Puffs
    prisma.recipe.upsert({
      where: { name: 'Egg Puffs' },
      update: {},
      create: {
        name: 'Egg Puffs',
        description: 'Portion: 1 pc (~80g), Yield: 10 puffs/10 eggs. Make flaky dough, stuff with egg+masala, bake/fry. Selling Price: ₹30–40',
      },
    }),

    // 7. Mutta Roast with Parotta
    prisma.recipe.upsert({
      where: { name: 'Mutta Roast with Parotta' },
      update: {},
      create: {
        name: 'Mutta Roast with Parotta',
        description: 'Portion: 1 egg + small parotta, Yield: 10 servings. Boil eggs, cook onion tomato masala, coat eggs, serve with parotta. Selling Price: ₹40–50',
      },
    }),

    // 8. Chicken Cutlet
    prisma.recipe.upsert({
      where: { name: 'Chicken Cutlet' },
      update: {},
      create: {
        name: 'Chicken Cutlet',
        description: 'Portion: 1 pc (~50g), Yield: ~20 pcs/kg chicken. Cook chicken, mix with mashed potato & masala, shape, coat crumb, fry. Selling Price: ₹40–50',
      },
    }),

    // 9. Chicken Kebab
    prisma.recipe.upsert({
      where: { name: 'Chicken Kebab' },
      update: {},
      create: {
        name: 'Chicken Kebab',
        description: 'Portion: 1 skewer (~50g), Yield: ~20 skewers/kg. Marinate overnight, skewer, grill/fry. Selling Price: ₹40–50',
      },
    }),

    // 10. Vegetable Cutlet
    prisma.recipe.upsert({
      where: { name: 'Vegetable Cutlet' },
      update: {},
      create: {
        name: 'Vegetable Cutlet',
        description: 'Portion: 1 pc (~50g), Yield: ~20 pcs/1 kg veg. Mix vegetables, shape, crumb coat, fry crisp. Selling Price: ₹20–30',
      },
    }),

    // 11. Unniyappam
    prisma.recipe.upsert({
      where: { name: 'Unniyappam' },
      update: {},
      create: {
        name: 'Unniyappam',
        description: 'Portion: 2 pcs (~50g), Yield: ~30 pcs/1 kg batter. Mix batter smooth, pour into unniyappam pan, fry golden. Selling Price: ₹20–30',
      },
    }),

    // 12. Neyyappam
    prisma.recipe.upsert({
      where: { name: 'Neyyappam' },
      update: {},
      create: {
        name: 'Neyyappam',
        description: 'Portion: 2 pcs (~50g), Yield: ~30 pcs/1 kg batter. Mix batter, pour in pan, fry till golden & soft inside. Selling Price: ₹20–30',
      },
    }),

    // 13. Sweet Potato Roast
    prisma.recipe.upsert({
      where: { name: 'Sweet Potato Roast' },
      update: {},
      create: {
        name: 'Sweet Potato Roast',
        description: 'Portion: ~100g, Yield: ~10 servings/kg. Boil or roast slices, sauté with curry leaves. Selling Price: ₹20–30',
      },
    }),

    // 14. Banana Chips
    prisma.recipe.upsert({
      where: { name: 'Banana Chips' },
      update: {},
      create: {
        name: 'Banana Chips',
        description: 'Portion: 50g pack, Yield: ~20 packs/1 kg banana. Peel, slice thin, soak in salt water, fry crisp, pack. Selling Price: ₹20–30',
      },
    }),

    // 15. Peanut Masala
    prisma.recipe.upsert({
      where: { name: 'Peanut Masala' },
      update: {},
      create: {
        name: 'Peanut Masala',
        description: 'Portion: 50g cup, Yield: ~20 cups/kg. Roast peanuts, mix with chopped veg, spices, lemon. Selling Price: ₹20–30',
      },
    }),
  ])

  console.log('✅ Recipes seeded')

  // Recipe ingredients for each snack (10 pieces serving)
  const recipeIngredients = [
    // 1. Parippu Vada ingredients (10 pcs)
    { recipe: 'Parippu Vada', ingredient: 'Chana Dal', quantity: 0.4 },
    { recipe: 'Parippu Vada', ingredient: 'Onion', quantity: 0.1 },
    { recipe: 'Parippu Vada', ingredient: 'Green Chili', quantity: 2 },
    { recipe: 'Parippu Vada', ingredient: 'Ginger', quantity: 10 },
    { recipe: 'Parippu Vada', ingredient: 'Curry Leaves', quantity: 5 },
    { recipe: 'Parippu Vada', ingredient: 'Salt', quantity: 5 },
    { recipe: 'Parippu Vada', ingredient: 'Fennel Seeds', quantity: 5 },
    { recipe: 'Parippu Vada', ingredient: 'Coconut Oil', quantity: 0.2 },

    // 2. Uzhunnu Vada ingredients (10 pcs)
    { recipe: 'Uzhunnu Vada', ingredient: 'Urad Dal', quantity: 0.5 },
    { recipe: 'Uzhunnu Vada', ingredient: 'Onion', quantity: 0.05 },
    { recipe: 'Uzhunnu Vada', ingredient: 'Green Chili', quantity: 2 },
    { recipe: 'Uzhunnu Vada', ingredient: 'Curry Leaves', quantity: 5 },
    { recipe: 'Uzhunnu Vada', ingredient: 'Black Pepper', quantity: 5 },
    { recipe: 'Uzhunnu Vada', ingredient: 'Salt', quantity: 5 },
    { recipe: 'Uzhunnu Vada', ingredient: 'Coconut Oil', quantity: 0.2 },

    // 3. Ulli Vada ingredients (10 pcs)
    { recipe: 'Ulli Vada', ingredient: 'Onion', quantity: 0.7 },
    { recipe: 'Ulli Vada', ingredient: 'Gram Flour', quantity: 0.15 },
    { recipe: 'Ulli Vada', ingredient: 'Rice Flour', quantity: 0.05 },
    { recipe: 'Ulli Vada', ingredient: 'Green Chili', quantity: 2 },
    { recipe: 'Ulli Vada', ingredient: 'Curry Leaves', quantity: 5 },
    { recipe: 'Ulli Vada', ingredient: 'Salt', quantity: 5 },
    { recipe: 'Ulli Vada', ingredient: 'Turmeric Powder', quantity: 2 },
    { recipe: 'Ulli Vada', ingredient: 'Coconut Oil', quantity: 0.2 },

    // 4. Pazham Pori ingredients (10 pcs)
    { recipe: 'Pazham Pori', ingredient: 'Nendran Banana', quantity: 0.67 },
    { recipe: 'Pazham Pori', ingredient: 'Maida', quantity: 0.2 },
    { recipe: 'Pazham Pori', ingredient: 'Rice Flour', quantity: 0.05 },
    { recipe: 'Pazham Pori', ingredient: 'Sugar', quantity: 0.015 },
    { recipe: 'Pazham Pori', ingredient: 'Salt', quantity: 2 },
    { recipe: 'Pazham Pori', ingredient: 'Turmeric Powder', quantity: 1 },
    { recipe: 'Pazham Pori', ingredient: 'Coconut Oil', quantity: 0.2 },

    // 5. Egg Bajji ingredients (10 pcs)
    { recipe: 'Egg Bajji', ingredient: 'Eggs', quantity: 5 },
    { recipe: 'Egg Bajji', ingredient: 'Gram Flour', quantity: 0.1 },
    { recipe: 'Egg Bajji', ingredient: 'Rice Flour', quantity: 0.05 },
    { recipe: 'Egg Bajji', ingredient: 'Chili Powder', quantity: 5 },
    { recipe: 'Egg Bajji', ingredient: 'Turmeric Powder', quantity: 2 },
    { recipe: 'Egg Bajji', ingredient: 'Salt', quantity: 5 },
    { recipe: 'Egg Bajji', ingredient: 'Baking Soda', quantity: 1 },
    { recipe: 'Egg Bajji', ingredient: 'Coconut Oil', quantity: 0.2 },

    // 6. Egg Puffs ingredients (10 pcs)
    { recipe: 'Egg Puffs', ingredient: 'Eggs', quantity: 10 },
    { recipe: 'Egg Puffs', ingredient: 'Maida', quantity: 0.5 },
    { recipe: 'Egg Puffs', ingredient: 'Onion', quantity: 0.2 },
    { recipe: 'Egg Puffs', ingredient: 'Black Pepper', quantity: 5 },
    { recipe: 'Egg Puffs', ingredient: 'Chili Powder', quantity: 3 },
    { recipe: 'Egg Puffs', ingredient: 'Garam Masala', quantity: 3 },
    { recipe: 'Egg Puffs', ingredient: 'Coconut Oil', quantity: 0.05 },

    // 7. Mutta Roast with Parotta ingredients (10 servings)
    { recipe: 'Mutta Roast with Parotta', ingredient: 'Eggs', quantity: 10 },
    { recipe: 'Mutta Roast with Parotta', ingredient: 'Onion', quantity: 0.3 },
    { recipe: 'Mutta Roast with Parotta', ingredient: 'Tomato', quantity: 0.2 },
    { recipe: 'Mutta Roast with Parotta', ingredient: 'Ginger Garlic Paste', quantity: 20 },
    { recipe: 'Mutta Roast with Parotta', ingredient: 'Chili Powder', quantity: 5 },
    { recipe: 'Mutta Roast with Parotta', ingredient: 'Garam Masala', quantity: 3 },
    { recipe: 'Mutta Roast with Parotta', ingredient: 'Turmeric Powder', quantity: 2 },
    { recipe: 'Mutta Roast with Parotta', ingredient: 'Coconut Oil', quantity: 0.05 },
    { recipe: 'Mutta Roast with Parotta', ingredient: 'Parotta', quantity: 10 },

    // 8. Chicken Cutlet ingredients (10 pcs)
    { recipe: 'Chicken Cutlet', ingredient: 'Chicken Boneless', quantity: 0.5 },
    { recipe: 'Chicken Cutlet', ingredient: 'Potato', quantity: 0.2 },
    { recipe: 'Chicken Cutlet', ingredient: 'Onion', quantity: 0.1 },
    { recipe: 'Chicken Cutlet', ingredient: 'Ginger Garlic Paste', quantity: 20 },
    { recipe: 'Chicken Cutlet', ingredient: 'Green Chili', quantity: 2 },
    { recipe: 'Chicken Cutlet', ingredient: 'Garam Masala', quantity: 5 },
    { recipe: 'Chicken Cutlet', ingredient: 'Bread Crumbs', quantity: 0.2 },
    { recipe: 'Chicken Cutlet', ingredient: 'Eggs', quantity: 1 },
    { recipe: 'Chicken Cutlet', ingredient: 'Coconut Oil', quantity: 0.1 },

    // 9. Chicken Kebab ingredients (10 skewers)
    { recipe: 'Chicken Kebab', ingredient: 'Chicken Boneless', quantity: 0.5 },
    { recipe: 'Chicken Kebab', ingredient: 'Ginger Garlic Paste', quantity: 20 },
    { recipe: 'Chicken Kebab', ingredient: 'Yogurt', quantity: 50 },
    { recipe: 'Chicken Kebab', ingredient: 'Chili Powder', quantity: 5 },
    { recipe: 'Chicken Kebab', ingredient: 'Turmeric Powder', quantity: 2 },
    { recipe: 'Chicken Kebab', ingredient: 'Garam Masala', quantity: 3 },
    { recipe: 'Chicken Kebab', ingredient: 'Lemon Juice', quantity: 15 },
    { recipe: 'Chicken Kebab', ingredient: 'Coconut Oil', quantity: 0.015 },

    // 10. Vegetable Cutlet ingredients (10 pcs)
    { recipe: 'Vegetable Cutlet', ingredient: 'Mixed Vegetables', quantity: 0.5 },
    { recipe: 'Vegetable Cutlet', ingredient: 'Onion', quantity: 0.1 },
    { recipe: 'Vegetable Cutlet', ingredient: 'Green Chili', quantity: 2 },
    { recipe: 'Vegetable Cutlet', ingredient: 'Ginger Garlic Paste', quantity: 10 },
    { recipe: 'Vegetable Cutlet', ingredient: 'Garam Masala', quantity: 5 },
    { recipe: 'Vegetable Cutlet', ingredient: 'Bread Crumbs', quantity: 0.2 },
    { recipe: 'Vegetable Cutlet', ingredient: 'Eggs', quantity: 1 },
    { recipe: 'Vegetable Cutlet', ingredient: 'Coconut Oil', quantity: 0.1 },

    // 11. Unniyappam ingredients (10 pcs)
    { recipe: 'Unniyappam', ingredient: 'Rice Flour', quantity: 0.2 },
    { recipe: 'Unniyappam', ingredient: 'Ripe Banana', quantity: 0.1 },
    { recipe: 'Unniyappam', ingredient: 'Jaggery', quantity: 0.1 },
    { recipe: 'Unniyappam', ingredient: 'Cardamom', quantity: 2 },
    { recipe: 'Unniyappam', ingredient: 'Fresh Coconut', quantity: 0.02 },
    { recipe: 'Unniyappam', ingredient: 'Ghee', quantity: 0.05 },

    // 12. Neyyappam ingredients (10 pcs)
    { recipe: 'Neyyappam', ingredient: 'Rice Flour', quantity: 0.2 },
    { recipe: 'Neyyappam', ingredient: 'Jaggery', quantity: 0.1 },
    { recipe: 'Neyyappam', ingredient: 'Cardamom', quantity: 2 },
    { recipe: 'Neyyappam', ingredient: 'Fresh Coconut', quantity: 0.02 },
    { recipe: 'Neyyappam', ingredient: 'Ghee', quantity: 0.05 },

    // 13. Sweet Potato Roast ingredients (10 servings)
    { recipe: 'Sweet Potato Roast', ingredient: 'Sweet Potato', quantity: 1 },
    { recipe: 'Sweet Potato Roast', ingredient: 'Salt', quantity: 5 },
    { recipe: 'Sweet Potato Roast', ingredient: 'Coconut Oil', quantity: 0.03 },
    { recipe: 'Sweet Potato Roast', ingredient: 'Curry Leaves', quantity: 5 },

    // 14. Banana Chips ingredients (10 packs)
    { recipe: 'Banana Chips', ingredient: 'Nendran Banana', quantity: 1 },
    { recipe: 'Banana Chips', ingredient: 'Salt', quantity: 10 },
    { recipe: 'Banana Chips', ingredient: 'Coconut Oil', quantity: 0.5 },

    // 15. Peanut Masala ingredients (10 cups)
    { recipe: 'Peanut Masala', ingredient: 'Raw Peanuts', quantity: 0.5 },
    { recipe: 'Peanut Masala', ingredient: 'Onion', quantity: 0.05 },
    { recipe: 'Peanut Masala', ingredient: 'Tomato', quantity: 0.05 },
    { recipe: 'Peanut Masala', ingredient: 'Green Chili', quantity: 2 },
    { recipe: 'Peanut Masala', ingredient: 'Lemon Juice', quantity: 15 },
    { recipe: 'Peanut Masala', ingredient: 'Coriander Leaves', quantity: 5 },
    { recipe: 'Peanut Masala', ingredient: 'Salt', quantity: 5 },
    { recipe: 'Peanut Masala', ingredient: 'Chili Powder', quantity: 3 },
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
    // Rice and flours
    { ingredient: 'Rice Flour', quantity: 15 },
    { ingredient: 'Gram Flour', quantity: 10 },
    { ingredient: 'Maida', quantity: 12 },
    { ingredient: 'Raw Rice', quantity: 25 },
    { ingredient: 'Parboiled Rice', quantity: 15 },

    // Lentils and pulses
    { ingredient: 'Chana Dal', quantity: 20 },
    { ingredient: 'Urad Dal', quantity: 15 },

    // Vegetables and fresh ingredients
    { ingredient: 'Onion', quantity: 50 },
    { ingredient: 'Potato', quantity: 30 },
    { ingredient: 'Sweet Potato', quantity: 20 },
    { ingredient: 'Tomato', quantity: 25 },
    { ingredient: 'Mixed Vegetables', quantity: 15 },
    { ingredient: 'Nendran Banana', quantity: 40 },
    { ingredient: 'Ripe Banana', quantity: 20 },

    // Protein
    { ingredient: 'Eggs', quantity: 100 },
    { ingredient: 'Chicken Boneless', quantity: 10 },
    { ingredient: 'Raw Peanuts', quantity: 8 },

    // Coconut products
    { ingredient: 'Fresh Coconut', quantity: 50 },
    { ingredient: 'Coconut Oil', quantity: 8 },
    { ingredient: 'Coconut Milk', quantity: 2000 },

    // Sweeteners
    { ingredient: 'Jaggery', quantity: 12 },
    { ingredient: 'Sugar', quantity: 8 },

    // Spices and seasonings
    { ingredient: 'Salt', quantity: 2000 },
    { ingredient: 'Cardamom', quantity: 200 },
    { ingredient: 'Cumin Seeds', quantity: 150 },
    { ingredient: 'Black Pepper', quantity: 100 },
    { ingredient: 'Turmeric Powder', quantity: 500 },
    { ingredient: 'Chili Powder', quantity: 300 },
    { ingredient: 'Garam Masala', quantity: 150 },
    { ingredient: 'Fennel Seeds', quantity: 100 },

    // Fresh ingredients
    { ingredient: 'Green Chili', quantity: 200 },
    { ingredient: 'Ginger', quantity: 500 },
    { ingredient: 'Curry Leaves', quantity: 100 },
    { ingredient: 'Coriander Leaves', quantity: 50 },
    { ingredient: 'Ginger Garlic Paste', quantity: 300 },

    // Other ingredients
    { ingredient: 'Yogurt', quantity: 1000 },
    { ingredient: 'Lemon Juice', quantity: 500 },
    { ingredient: 'Bread Crumbs', quantity: 500 },
    { ingredient: 'Baking Soda', quantity: 100 },
    { ingredient: 'Parotta', quantity: 50 },
    { ingredient: 'Ghee', quantity: 5 },
    { ingredient: 'Banana Leaves', quantity: 100 },
    { ingredient: 'Black Sesame Seeds', quantity: 200 },
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
    { recipe: 'Parippu Vada', quantity: 50, labourCost: 200, overheadCost: 50, packagingCost: 30 },
    { recipe: 'Uzhunnu Vada', quantity: 40, labourCost: 180, overheadCost: 45, packagingCost: 25 },
    { recipe: 'Pazham Pori', quantity: 30, labourCost: 150, overheadCost: 40, packagingCost: 20 },
    { recipe: 'Egg Bajji', quantity: 25, labourCost: 120, overheadCost: 30, packagingCost: 15 },
    { recipe: 'Chicken Cutlet', quantity: 20, labourCost: 250, overheadCost: 60, packagingCost: 35 },
    { recipe: 'Unniyappam', quantity: 60, labourCost: 180, overheadCost: 45, packagingCost: 25 },
    { recipe: 'Banana Chips', quantity: 100, labourCost: 100, overheadCost: 25, packagingCost: 50 },
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
  const hashedPassword = await bcrypt.hash('Admin@2024', 12)

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
  console.log('   Password: Admin@2024')
  console.log('   Email: admin@kimikitchen.com')
  console.log('   Role: ADMIN')

  // Create Manager user
  const managerPassword = await bcrypt.hash('Manager#99', 12)

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
  console.log('   Password: Manager#99')
  console.log('   Email: manager@kimikitchen.com')
  console.log('   Role: MANAGER')

  // Create Chef user
  const chefPassword = await bcrypt.hash('Chef$2024!', 12)

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
  console.log('   Password: Chef$2024!')
  console.log('   Email: chef@kimikitchen.com')
  console.log('   Role: CHEF')

  // Create Customer user
  const customerPassword = await bcrypt.hash('Cust0mer@1', 12)

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
  console.log('   Password: Cust0mer@1')
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
