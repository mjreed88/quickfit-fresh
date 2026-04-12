import { Meal, MealPlan, Goal, SuggestedItem } from '../lib/types'

const makeMeal = (
  id: string,
  name: string,
  type: Meal['type'],
  goal: Goal,
  macros: { calories: number; protein: number; carbs: number; fat: number },
  ingredients: string[],
  instructions: string[],
  allergens: string[],
  containsLactose: boolean,
  suggestedItems: SuggestedItem[] = []
): Meal => ({ id, name, type, goal, macros, ingredients, instructions, allergens, containsLactose, suggestedItems })

// Meals by goal - 7 days worth for each goal type
export const mealsDatabase: Record<Goal, Meal[]> = {
  'muscle-building': [
    makeMeal('mb-mon-b', 'Protein Power Oatmeal', 'breakfast', 'muscle-building', { calories: 580, protein: 42, carbs: 65, fat: 16 }, ['1 cup oats', '1 scoop whey protein', '1 banana', '2 tbsp almond butter', '1 cup almond milk'], ['Cook oats with protein powder', 'Top with sliced banana and almond butter'], ['gluten', 'nuts', 'dairy'], true, []),
    makeMeal('mb-mon-l', 'Chicken Breast & Rice Bowl', 'lunch', 'muscle-building', { calories: 720, protein: 52, carbs: 85, fat: 14 }, ['8oz chicken breast', '1 cup brown rice', '1 cup broccoli', '1 tbsp olive oil', 'garlic, herbs'], ['Grill chicken with seasonings', 'Steam broccoli', 'Serve over rice with olive oil'], ['none'], false, []),
    makeMeal('mb-mon-d', 'Salmon with Sweet Potato', 'dinner', 'muscle-building', { calories: 820, protein: 48, carbs: 72, fat: 28 }, ['8oz salmon fillet', '2 medium sweet potatoes', '1 cup asparagus', '2 tbsp butter', 'lemon, dill'], ['Bake salmon at 400°F for 20 min', 'Roast sweet potato wedges', 'Steam asparagus'], ['fish', 'dairy'], true, []),
    makeMeal('mb-mon-s', 'Greek Yogurt & Berries', 'snack', 'muscle-building', { calories: 320, protein: 28, carbs: 38, fat: 6 }, ['2 cups Greek yogurt', '1 cup mixed berries', '2 tbsp honey', '1/4 cup granola'], ['Layer yogurt with berries and granola', 'Drizzle with honey'], ['dairy', 'gluten'], true, []),
    makeMeal('mb-tue-b', 'Egg White Omelette', 'breakfast', 'muscle-building', { calories: 420, protein: 38, carbs: 30, fat: 12 }, ['6 egg whites', '1oz cheddar cheese', '1/2 cup spinach', '1/2 cup mushrooms', '1 slice whole grain toast'], ['Whisk egg whites', 'Pour into heated pan with vegetables', 'Fold and serve with toast'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('mb-tue-l', 'Lean Beef Taco Bowl', 'lunch', 'muscle-building', { calories: 780, protein: 55, carbs: 78, fat: 22 }, ['6oz ground lean beef', '1 cup quinoa', '1/2 cup black beans', '1/2 cup corn', 'salsa', 'avocado'], ['Brown beef with seasonings', 'Cook quinoa', 'Assemble bowl with beans, corn, salsa'], ['none'], false, []),
    makeMeal('mb-tue-d', 'Turkey Meatballs & Pasta', 'dinner', 'muscle-building', { calories: 890, protein: 62, carbs: 95, fat: 20 }, ['8oz ground turkey', '1 cup whole wheat pasta', '1 cup marinara sauce', '1/2 cup zucchini', 'parmesan'], ['Form turkey into meatballs', 'Bake at 400°F for 25 min', 'Cook pasta, top with sauce and meatballs'], ['gluten', 'dairy'], true, []),
    makeMeal('mb-tue-s', 'Casein Shake', 'snack', 'muscle-building', { calories: 350, protein: 40, carbs: 12, fat: 8 }, ['1 scoop casein protein', '1 cup whole milk', '1 tbsp peanut butter', 'ice'], ['Blend all ingredients until smooth'], ['dairy', 'nuts'], true, []),
    makeMeal('mb-wed-b', 'Protein Pancakes', 'breakfast', 'muscle-building', { calories: 620, protein: 45, carbs: 72, fat: 14 }, ['1 cup pancake mix', '1 scoop vanilla protein', '1 egg', '1/2 cup milk', 'berries'], ['Mix all ingredients', 'Cook on griddle until golden', 'Top with fresh berries'], ['gluten', 'eggs', 'dairy'], true, []),
    makeMeal('mb-wed-l', 'Tuna Salad Sandwich', 'lunch', 'muscle-building', { calories: 680, protein: 48, carbs: 62, fat: 20 }, ['5oz canned tuna', '2 slices whole grain bread', '1 tbsp mayo', 'lettuce', 'tomato', 'avocado'], ['Mix tuna with mayo', 'Add lettuce and tomato', 'Serve open-faced or closed'], ['fish', 'gluten', 'eggs'], false, []),
    makeMeal('mb-wed-d', 'Chicken Thighs & Couscous', 'dinner', 'muscle-building', { calories: 850, protein: 55, carbs: 82, fat: 26 }, ['2 chicken thighs', '1 cup couscous', '1 cup roasted vegetables', '1 tbsp olive oil', 'tahini sauce'], ['Season and bake chicken thighs at 400°F', 'Cook couscous', 'Serve with roasted vegetables and tahini'], ['gluten', 'sesame'], true, []),
    makeMeal('mb-wed-s', 'Cottage Cheese & Fruit', 'snack', 'muscle-building', { calories: 280, protein: 32, carbs: 24, fat: 4 }, ['1 cup cottage cheese', '1/2 cup pineapple chunks', 'honey'], ['Top cottage cheese with pineapple', 'Drizzle with honey'], ['dairy'], true, []),
    makeMeal('mb-thu-b', 'Overnight Protein Oats', 'breakfast', 'muscle-building', { calories: 560, protein: 40, carbs: 68, fat: 14 }, ['1 cup rolled oats', '1 scoop chocolate protein', '1 cup almond milk', '1/2 cup blueberries', 'chia seeds'], ['Mix oats, protein, milk, refrigerate overnight', 'Top with blueberries and chia seeds'], ['gluten', 'nuts', 'dairy'], true, []),
    makeMeal('mb-thu-l', 'Shrimp & Rice Stir-Fry', 'lunch', 'muscle-building', { calories: 740, protein: 50, carbs: 88, fat: 14 }, ['6oz shrimp', '1 cup jasmine rice', '1 cup mixed peppers', '1/2 cup snap peas', 'soy sauce', 'ginger'], ['Cook rice', 'Stir-fry shrimp with vegetables', 'Season with soy sauce and ginger'], ['shellfish', 'soy'], false, []),
    makeMeal('mb-thu-d', 'Pork Tenderloin & Potato', 'dinner', 'muscle-building', { calories: 880, protein: 58, carbs: 84, fat: 24 }, ['6oz pork tenderloin', '2 medium potatoes', '1 cup green beans', '1 tbsp butter', 'rosemary'], ['Roast pork at 400°F for 25 min', 'Bake potatoes', 'Steam green beans with butter'], ['dairy'], false, []),
    makeMeal('mb-thu-s', 'Protein Bar', 'snack', 'muscle-building', { calories: 310, protein: 30, carbs: 28, fat: 10 }, ['1 protein bar'], ['Eat as a snack between meals'], ['varies'], false, []),
    makeMeal('mb-fri-b', 'Breakfast Burrito', 'breakfast', 'muscle-building', { calories: 680, protein: 44, carbs: 62, fat: 26 }, ['2 eggs', '4oz steak strips', '1 large tortilla', 'cheese', 'salsa', 'refried beans'], ['Scramble eggs', 'Warm steak strips', 'Fill tortilla with eggs, steak, beans, cheese, salsa'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('mb-fri-l', 'Mediterranean Chicken Wrap', 'lunch', 'muscle-building', { calories: 720, protein: 52, carbs: 65, fat: 22 }, ['6oz grilled chicken', '1 large tortilla', 'hummus', 'feta cheese', 'olives', 'cucumber', 'tomato'], ['Slice chicken', 'Spread hummus on tortilla', 'Fill with chicken, vegetables, feta, olives'], ['dairy', 'gluten'], true, []),
    makeMeal('mb-fri-d', 'Beef & Broccoli', 'dinner', 'muscle-building', { calories: 820, protein: 55, carbs: 75, fat: 26 }, ['6oz flank steak', '2 cups broccoli', '1 cup white rice', '2 tbsp soy sauce', 'garlic', 'oyster sauce'], ['Slice steak thin', 'Stir-fry with broccoli', 'Serve over rice with sauces'], ['soy'], false, []),
    makeMeal('mb-fri-s', 'Rice Cakes & Almond Butter', 'snack', 'muscle-building', { calories: 290, protein: 12, carbs: 32, fat: 14 }, ['2 rice cakes', '2 tbsp almond butter', '1 banana'], ['Spread almond butter on rice cakes', 'Top with banana slices'], ['nuts'], false, []),
    makeMeal('mb-sat-b', 'French Toast & Eggs', 'breakfast', 'muscle-building', { calories: 720, protein: 42, carbs: 78, fat: 24 }, ['2 slices thick bread', '2 eggs', '1/2 cup milk', 'cinnamon', 'maple syrup', 'fresh fruit'], ['Dip bread in egg mixture', 'Cook on griddle until golden', 'Top with fresh fruit and maple syrup'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('mb-sat-l', 'Pulled Pork Sandwich', 'lunch', 'muscle-building', { calories: 860, protein: 58, carbs: 82, fat: 28 }, ['6oz pulled pork', '1 brioche bun', 'coleslaw', 'BBQ sauce', 'pickles'], ['Warm pulled pork with BBQ sauce', 'Serve on brioche bun', 'Top with coleslaw and pickles'], ['gluten', 'eggs'], true, []),
    makeMeal('mb-sat-d', 'Lamb Chops & Risotto', 'dinner', 'muscle-building', { calories: 920, protein: 54, carbs: 78, fat: 32 }, ['2 lamb chops', '1 cup arborio rice', '1/2 cup peas', '1/4 cup parmesan', '2 tbsp butter', 'rosemary'], ['Grill lamb to medium', 'Cook risotto with peas and parmesan', 'Serve together with rosemary'], ['dairy'], false, []),
    makeMeal('mb-sat-s', 'Whey Protein Shake', 'snack', 'muscle-building', { calories: 320, protein: 35, carbs: 15, fat: 6 }, ['1 scoop whey protein', '1 cup water', '1/2 banana', 'ice'], ['Blend until smooth'], ['dairy'], false, []),
    makeMeal('mb-sun-b', 'Avocado Toast & Poached Eggs', 'breakfast', 'muscle-building', { calories: 580, protein: 32, carbs: 48, fat: 30 }, ['2 slices sourdough', '1 avocado', '2 eggs', 'red pepper flakes', 'lime'], ['Toast sourdough', 'Mash avocado with lime', 'Poach eggs and place on toast'], ['eggs', 'gluten'], false, []),
    makeMeal('mb-sun-l', 'Grilled Chicken Caesar Salad', 'lunch', 'muscle-building', { calories: 680, protein: 52, carbs: 35, fat: 32 }, ['8oz grilled chicken', '3 cups romaine lettuce', '1/4 cup caesar dressing', 'parmesan', 'croutons'], ['Grill chicken breast', 'Chop romaine', 'Toss with dressing, top with chicken, parmesan, croutons'], ['dairy', 'gluten', 'eggs'], true, []),
    makeMeal('mb-sun-d', 'Steak & Baked Potato', 'dinner', 'muscle-building', { calories: 950, protein: 62, carbs: 82, fat: 34 }, ['8oz ribeye steak', '1 large baked potato', '4 tbsp butter', 'sour cream', '1 cup steamed broccoli'], ['Grill steak to desired doneness', 'Bake potato', 'Top potato with butter and sour cream'], ['dairy'], false, []),
    makeMeal('mb-sun-s', 'Hard Boiled Eggs', 'snack', 'muscle-building', { calories: 200, protein: 18, carbs: 2, fat: 14 }, ['3 hard boiled eggs'], ['Peel and eat'], ['eggs'], false, []),
  ],
  'strength': [
    makeMeal('st-mon-b', 'Steel Cut Oatmeal & Eggs', 'breakfast', 'strength', { calories: 620, protein: 36, carbs: 72, fat: 22 }, ['1 cup steel cut oats', '3 eggs scrambled', '1 banana', '1 tbsp butter', 'maple syrup'], ['Cook oats with butter', 'Scramble eggs', 'Serve together with sliced banana and maple syrup'], ['eggs', 'dairy'], true, []),
    makeMeal('st-mon-l', 'Beef Stir-Fry & Rice', 'lunch', 'strength', { calories: 780, protein: 54, carbs: 82, fat: 20 }, ['6oz beef strips', '1 cup jasmine rice', '1 cup broccoli', '1 cup bell peppers', 'soy sauce', 'garlic'], ['Cook rice', 'Stir-fry beef with vegetables', 'Season with soy sauce and garlic'], ['soy'], false, []),
    makeMeal('st-mon-d', 'BBQ Pulled Pork & Coleslaw', 'dinner', 'strength', { calories: 880, protein: 52, carbs: 78, fat: 32 }, ['8oz pulled pork', '1/2 cup BBQ sauce', '1 cup coleslaw', '1 corn on the cob', 'brioche bun'], ['Warm pulled pork with BBQ sauce', 'Grill corn', 'Serve on brioche with coleslaw'], ['gluten', 'eggs'], true, []),
    makeMeal('st-mon-s', 'Greek Yogurt Parfait', 'snack', 'strength', { calories: 340, protein: 30, carbs: 38, fat: 8 }, ['1.5 cups Greek yogurt', '1/2 cup granola', '1/2 cup mixed berries', '1 tbsp honey'], ['Layer yogurt, granola, berries', 'Drizzle honey'], ['dairy', 'gluten'], true, []),
    makeMeal('st-tue-b', 'Protein Smoothie Bowl', 'breakfast', 'strength', { calories: 580, protein: 44, carbs: 68, fat: 14 }, ['1 scoop vanilla protein', '1 frozen banana', '1/2 cup frozen berries', '1/4 cup granola', 'coconut flakes'], ['Blend protein with banana and berries', 'Top with granola and coconut'], ['dairy', 'gluten'], true, []),
    makeMeal('st-tue-l', 'Turkey Club Sandwich', 'lunch', 'strength', { calories: 720, protein: 48, carbs: 65, fat: 26 }, ['6oz sliced turkey', '3 slices bread', 'bacon', 'lettuce', 'tomato', 'mayo'], ['Toast bread', 'Layer turkey, bacon, lettuce, tomato', 'Add mayo, serve as club sandwich'], ['gluten', 'eggs'], true, []),
    makeMeal('st-tue-d', 'Grilled Salmon & Quinoa', 'dinner', 'strength', { calories: 840, protein: 50, carbs: 72, fat: 30 }, ['7oz salmon', '1 cup quinoa', '1 cup roasted asparagus', 'lemon', 'dill', '2 tbsp butter'], ['Grill salmon with lemon and dill', 'Cook quinoa', 'Roast asparagus'], ['fish', 'dairy'], true, []),
    makeMeal('st-tue-s', 'Peanut Butter Protein Shake', 'snack', 'strength', { calories: 380, protein: 32, carbs: 24, fat: 18 }, ['1 scoop protein powder', '2 tbsp peanut butter', '1 cup milk', 'ice'], ['Blend all ingredients'], ['dairy', 'nuts'], true, []),
    makeMeal('st-wed-b', 'Egg & Cheese Bagel', 'breakfast', 'strength', { calories: 620, protein: 38, carbs: 58, fat: 26 }, ['1 everything bagel', '3 eggs', '2oz cheddar cheese', 'butter', 'cream cheese'], ['Toast bagel with butter and cream cheese', 'Scramble eggs with cheese'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('st-wed-l', 'Chicken Pita Pocket', 'lunch', 'strength', { calories: 680, protein: 50, carbs: 62, fat: 20 }, ['6oz grilled chicken', '1 pita bread', 'hummus', 'lettuce', 'tomato', 'tzatziki'], ['Slice chicken', 'Warm pita', 'Fill with chicken, hummus, vegetables, tzatziki'], ['dairy', 'gluten'], true, []),
    makeMeal('st-wed-d', 'Meatballs & Spaghetti', 'dinner', 'strength', { calories: 920, protein: 58, carbs: 105, fat: 24 }, ['8oz ground beef meatballs', '2 cups spaghetti', '1 cup marinara', 'parmesan', 'garlic bread'], ['Bake meatballs at 400°F for 25 min', 'Cook spaghetti', 'Serve with marinara, parmesan, garlic bread'], ['gluten', 'dairy', 'eggs'], true, []),
    makeMeal('st-wed-s', 'Cottage Cheese & Crackers', 'snack', 'strength', { calories: 300, protein: 28, carbs: 22, fat: 10 }, ['1 cup cottage cheese', '6 whole wheat crackers', 'sliced cucumber'], ['Eat cottage cheese with crackers and cucumber'], ['dairy', 'gluten'], true, []),
    makeMeal('st-thu-b', 'Banana Protein Pancakes', 'breakfast', 'strength', { calories: 640, protein: 42, carbs: 82, fat: 16 }, ['2 large bananas', '2 eggs', '1 cup oats', '1 scoop vanilla protein', 'cinnamon'], ['Mash bananas, mix with eggs and oats', 'Add protein powder', 'Cook pancakes on griddle'], ['eggs', 'gluten', 'dairy'], true, []),
    makeMeal('st-thu-l', 'Tuna Nicoise Salad', 'lunch', 'strength', { calories: 720, protein: 52, carbs: 42, fat: 30 }, ['5oz canned tuna', '2 cups mixed greens', 'hard boiled egg', 'green beans', 'olives', 'potato', 'vinaigrette'], ['Arrange all ingredients on plate', 'Drizzle with vinaigrette'], ['fish', 'eggs'], true, []),
    makeMeal('st-thu-d', 'Chicken Tikka Masala', 'dinner', 'strength', { calories: 860, protein: 55, carbs: 78, fat: 28 }, ['8oz chicken thighs', '1 cup basmati rice', '1 cup tikka sauce', 'naan bread', 'peas'], ['Simmer chicken in tikka masala sauce', 'Cook rice', 'Serve with naan and peas'], ['gluten', 'dairy'], true, []),
    makeMeal('st-thu-s', 'Beef Jerky & Almonds', 'snack', 'strength', { calories: 340, protein: 32, carbs: 18, fat: 16 }, ['2oz beef jerky', '1/4 cup almonds'], ['Eat as snack'], ['nuts'], false, []),
    makeMeal('st-fri-b', 'Breakfast Quesadilla', 'breakfast', 'strength', { calories: 680, protein: 40, carbs: 54, fat: 30 }, ['2 flour tortillas', '4 eggs', '3oz chorizo', 'cheese', 'salsa'], ['Cook chorizo and eggs', 'Fill tortillas with mixture and cheese', 'Fold and grill'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('st-fri-l', 'Chicken Quesadilla', 'lunch', 'strength', { calories: 760, protein: 52, carbs: 58, fat: 28 }, ['6oz grilled chicken', '2 flour tortillas', 'cheese', 'black beans', 'sour cream', 'guacamole'], ['Layer chicken, cheese, beans on tortilla', 'Fold and grill until crispy', 'Serve with sour cream and guacamole'], ['dairy', 'gluten'], true, []),
    makeMeal('st-fri-d', 'NY Strip Steak & Fries', 'dinner', 'strength', { calories: 980, protein: 58, carbs: 88, fat: 38 }, ['10oz NY strip steak', '2 cups sweet potato fries', '1/2 cup aioli', 'steamed asparagus'], ['Grill steak to medium-rare', 'Bake sweet potato fries', 'Serve with asparagus and aioli'], ['dairy', 'eggs'], false, []),
    makeMeal('st-fri-s', 'Protein Energy Balls', 'snack', 'strength', { calories: 280, protein: 22, carbs: 28, fat: 10 }, ['2 protein balls'], ['Roll into balls and refrigerate'], ['nuts', 'dairy'], true, []),
    makeMeal('st-sat-b', 'Hash & Eggs', 'breakfast', 'strength', { calories: 720, protein: 38, carbs: 68, fat: 32 }, ['2 eggs', '1 cup diced potatoes', 'onions', 'peppers', 'chorizo', 'salsa', '2 slices toast'], ['Fry potatoes with onions, peppers, chorizo', 'Cook eggs to preference', 'Serve with toast and salsa'], ['eggs', 'gluten'], true, []),
    makeMeal('st-sat-l', 'Fish & Chips', 'lunch', 'strength', { calories: 880, protein: 45, carbs: 92, fat: 30 }, ['6oz cod fillet', '1 cup mashed potatoes', '1 cup coleslaw', 'tartar sauce', 'lemon'], ['Bake cod with breading', 'Heat mashed potatoes', 'Serve with coleslaw and tartar sauce'], ['fish', 'gluten', 'dairy', 'eggs'], true, []),
    makeMeal('st-sat-d', 'Beef Bourguignon', 'dinner', 'strength', { calories: 920, protein: 56, carbs: 72, fat: 36 }, ['8oz beef chuck', '1 cup egg noodles', 'carrots', 'mushrooms', 'red wine sauce', 'bread'], ['Braise beef in red wine sauce with vegetables', 'Cook egg noodles', 'Serve beef over noodles with crusty bread'], ['gluten', 'dairy', 'sulfites'], true, []),
    makeMeal('st-sat-s', 'Chocolate Milk', 'snack', 'strength', { calories: 280, protein: 24, carbs: 38, fat: 6 }, ['1 cup chocolate milk'], ['Drink post-workout'], ['dairy'], true, []),
    makeMeal('st-sun-b', 'Croissant & Eggs', 'breakfast', 'strength', { calories: 640, protein: 32, carbs: 56, fat: 34 }, ['2 croissants', '3 eggs', 'ham', 'swiss cheese', 'hollandaise sauce'], ['Toast croissants', 'Top with ham, eggs, cheese, hollandaise'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('st-sun-l', 'Chicken BLT Wrap', 'lunch', 'strength', { calories: 740, protein: 50, carbs: 58, fat: 28 }, ['6oz grilled chicken', '1 large tortilla', 'bacon', 'lettuce', 'tomato', 'mayo', 'avocado'], ['Grill chicken', 'Fill wrap with chicken, bacon, lettuce, tomato, mayo, avocado'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('st-sun-d', 'Prime Rib & Loaded Baked Potato', 'dinner', 'strength', { calories: 1020, protein: 64, carbs: 85, fat: 42 }, ['10oz prime rib', '1 large baked potato', '4tbsp butter', 'sour cream', 'chives', 'creamed spinach'], ['Roast prime rib to medium', 'Bake potato with fixings', 'Serve with creamed spinach'], ['dairy'], false, []),
    makeMeal('st-sun-s', 'Casein Pudding', 'snack', 'strength', { calories: 320, protein: 36, carbs: 14, fat: 8 }, ['1 scoop casein protein', '1 cup almond milk', '1 tbsp cocoa powder', 'stevia'], ['Mix and refrigerate overnight'], ['dairy'], true, []),
  ],
  'weight-loss': [
    makeMeal('wl-mon-b', 'Egg White Vegetable Omelette', 'breakfast', 'weight-loss', { calories: 280, protein: 32, carbs: 12, fat: 8 }, ['6 egg whites', '1/2 cup spinach', '1/4 cup mushrooms', '1/4 cup bell peppers', 'herbs'], ['Whisk egg whites', 'Cook with vegetables in non-stick pan', 'Season with herbs'], ['eggs'], false, []),
    makeMeal('wl-mon-l', 'Grilled Chicken Salad', 'lunch', 'weight-loss', { calories: 380, protein: 42, carbs: 18, fat: 14 }, ['6oz grilled chicken breast', '2 cups mixed greens', 'cucumber', 'tomato', '1/4 cup chickpeas', 'lemon vinaigrette'], ['Slice grilled chicken', 'Combine with vegetables and chickpeas', 'Toss with lemon vinaigrette'], ['none'], false, []),
    makeMeal('wl-mon-d', 'Baked Cod with Asparagus', 'dinner', 'weight-loss', { calories: 420, protein: 42, carbs: 15, fat: 12 }, ['6oz cod fillet', '1 cup asparagus', '1/2 lemon', 'herbs', '1 tbsp olive oil'], ['Bake cod with lemon and herbs at 400°F', 'Roast asparagus with olive oil'], ['fish'], false, []),
    makeMeal('wl-mon-s', 'Raw Vegetables & Hummus', 'snack', 'weight-loss', { calories: 180, protein: 8, carbs: 22, fat: 6 }, ['1 cup carrot sticks', '1 cup celery', '1/2 cup cherry tomatoes', '1/4 cup hummus'], ['Cut vegetables', 'Serve with hummus'], ['sesame'], false, []),
    makeMeal('wl-tue-b', 'Greek Yogurt & Berries', 'breakfast', 'weight-loss', { calories: 240, protein: 28, carbs: 28, fat: 4 }, ['1.5 cups Greek yogurt', '1/2 cup mixed berries', 'stevia'], ['Top yogurt with berries', 'Sweeten with stevia if desired'], ['dairy'], true, []),
    makeMeal('wl-tue-l', 'Turkey Lettuce Wraps', 'lunch', 'weight-loss', { calories: 340, protein: 38, carbs: 16, fat: 12 }, ['5oz ground turkey', 'butter lettuce', 'water chestnuts', 'ginger', 'soy sauce', 'green onions'], ['Brown turkey with ginger and soy sauce', 'Spoon into lettuce cups', 'Top with water chestnuts and green onions'], ['soy'], false, []),
    makeMeal('wl-tue-d', 'Stir-Fried Shrimp & Vegetables', 'dinner', 'weight-loss', { calories: 380, protein: 40, carbs: 22, fat: 10 }, ['5oz shrimp', '1 cup broccoli', '1/2 cup snap peas', 'soy sauce', 'garlic', 'ginger'], ['Stir-fry shrimp with vegetables', 'Season with soy sauce, garlic, ginger'], ['shellfish', 'soy'], false, []),
    makeMeal('wl-tue-s', 'Apple & Almond Butter', 'snack', 'weight-loss', { calories: 220, protein: 6, carbs: 28, fat: 10 }, ['1 medium apple', '1 tbsp almond butter'], ['Slice apple', 'Dip in almond butter'], ['nuts'], false, []),
    makeMeal('wl-wed-b', 'Protein Smoothie', 'breakfast', 'weight-loss', { calories: 280, protein: 32, carbs: 24, fat: 6 }, ['1 scoop protein powder', '1/2 frozen banana', '1 cup unsweetened almond milk', 'ice', 'cinnamon'], ['Blend all ingredients until smooth'], ['dairy'], true, []),
    makeMeal('wl-wed-l', 'Tuna Salad on Greens', 'lunch', 'weight-loss', { calories: 320, protein: 36, carbs: 14, fat: 12 }, ['5oz canned tuna', 'mixed greens', 'cucumber', 'red onion', 'lemon juice', 'olive oil'], ['Mix tuna with lemon and olive oil', 'Serve on bed of greens with vegetables'], ['fish'], false, []),
    makeMeal('wl-wed-d', 'Grilled Chicken & Vegetables', 'dinner', 'weight-loss', { calories: 440, protein: 48, carbs: 24, fat: 14 }, ['6oz chicken breast', '1 cup zucchini', '1 cup bell peppers', '1/2 cup onion', 'herbs', '1tbsp olive oil'], ['Season and grill chicken', 'Sauté vegetables with herbs'], ['none'], false, []),
    makeMeal('wl-wed-s', 'Celery & Cream Cheese', 'snack', 'weight-loss', { calories: 160, protein: 4, carbs: 8, fat: 12 }, ['4 celery stalks', '2 tbsp cream cheese', 'everything seasoning'], ['Spread cream cheese on celery', 'Sprinkle with everything seasoning'], ['dairy'], true, []),
    makeMeal('wl-thu-b', 'Veggie Egg Scramble', 'breakfast', 'weight-loss', { calories: 320, protein: 28, carbs: 14, fat: 16 }, ['3 whole eggs', '1/2 cup spinach', '1/4 cup mushrooms', '1/4 cup tomatoes', 'herbs'], ['Scramble eggs with vegetables', 'Season with herbs'], ['eggs'], false, []),
    makeMeal('wl-thu-l', 'Chicken & Black Bean Bowl', 'lunch', 'weight-loss', { calories: 400, protein: 42, carbs: 38, fat: 8 }, ['5oz grilled chicken', '1/2 cup black beans', '1/2 cup corn', '1/2 cup brown rice', 'salsa', 'lime'], ['Slice chicken', 'Combine with rice, beans, corn, salsa'], ['none'], false, []),
    makeMeal('wl-thu-d', 'Salmon with Steamed Broccoli', 'dinner', 'weight-loss', { calories: 480, protein: 44, carbs: 18, fat: 24 }, ['6oz salmon fillet', '2 cups broccoli', 'lemon', 'dill', '1tbsp butter'], ['Bake salmon with lemon and dill', 'Steam broccoli with butter'], ['fish', 'dairy'], true, []),
    makeMeal('wl-thu-s', 'Hard Boiled Eggs', 'snack', 'weight-loss', { calories: 140, protein: 12, carbs: 2, fat: 10 }, ['2 hard boiled eggs'], ['Peel and eat'], ['eggs'], false, []),
    makeMeal('wl-fri-b', 'Overnight Oats (No Sugar)', 'breakfast', 'weight-loss', { calories: 320, protein: 18, carbs: 48, fat: 8 }, ['1/2 cup rolled oats', '1 cup unsweetened almond milk', 'chia seeds', 'cinnamon', '1/2 cup berries'], ['Mix oats, milk, chia, cinnamon', 'Refrigerate overnight', 'Top with berries'], ['gluten', 'nuts'], true, []),
    makeMeal('wl-fri-l', 'Mediterranean Chicken Bowl', 'lunch', 'weight-loss', { calories: 420, protein: 44, carbs: 28, fat: 14 }, ['5oz grilled chicken', '1/2 cup cucumber', '1/4 cup feta', 'olives', 'hummus', 'whole grain pita'], ['Cube chicken', 'Combine with cucumber, feta, olives', 'Serve with hummus and pita'], ['dairy', 'gluten'], true, []),
    makeMeal('wl-fri-d', 'Lean Beef Steak & Salad', 'dinner', 'weight-loss', { calories: 480, protein: 48, carbs: 18, fat: 22 }, ['6oz sirloin steak', '2 cups mixed greens', 'tomato', 'cucumber', '1/4 cup vinaigrette'], ['Grill steak to medium', 'Serve over greens with vegetables'], ['none'], false, []),
    makeMeal('wl-fri-s', 'Cucumber & Avocado', 'snack', 'weight-loss', { calories: 180, protein: 4, carbs: 14, fat: 14 }, ['1 cucumber', '1/2 avocado', 'lime juice', 'salt'], ['Slice cucumber', 'Mash avocado with lime and salt', 'Scoop onto cucumber slices'], ['none'], false, []),
    makeMeal('wl-sat-b', 'Veggie Scramble with Toast', 'breakfast', 'weight-loss', { calories: 340, protein: 24, carbs: 28, fat: 14 }, ['3 eggs', '1/2 cup vegetables', '1 slice whole grain toast', 'salsa'], ['Scramble eggs with vegetables', 'Toast bread', 'Serve with salsa'], ['eggs', 'gluten'], false, []),
    makeMeal('wl-sat-l', 'Shrimp Avocado Salad', 'lunch', 'weight-loss', { calories: 380, protein: 32, carbs: 16, fat: 22 }, ['5oz grilled shrimp', '1 avocado', '2 cups arugula', 'lemon', 'olive oil', 'red onion'], ['Toss shrimp with arugula and sliced avocado', 'Dress with lemon and olive oil'], ['shellfish'], false, []),
    makeMeal('wl-sat-d', 'Grilled Pork Tenderloin & Vegetables', 'dinner', 'weight-loss', { calories: 460, protein: 46, carbs: 22, fat: 18 }, ['6oz pork tenderloin', '1 cup roasted carrots', '1 cup green beans', 'rosemary', '1tbsp olive oil'], ['Roast pork with rosemary', 'Roast vegetables with olive oil'], ['none'], false, []),
    makeMeal('wl-sat-s', 'Protein Shake', 'snack', 'weight-loss', { calories: 240, protein: 30, carbs: 12, fat: 6 }, ['1 scoop whey protein', '1 cup water', 'ice'], ['Blend and drink'], ['dairy'], false, []),
    makeMeal('wl-sun-b', 'Egg & Smoked Salmon', 'breakfast', 'weight-loss', { calories: 360, protein: 32, carbs: 24, fat: 16 }, ['3 eggs', '2oz smoked salmon', '1/2 cup capers', 'red onion', '1 slice rye bread'], ['Scramble eggs', 'Serve with smoked salmon, capers, red onion on rye'], ['eggs', 'fish', 'gluten'], true, []),
    makeMeal('wl-sun-l', 'Chicken Caesar Salad (Light)', 'lunch', 'weight-loss', { calories: 400, protein: 44, carbs: 16, fat: 18 }, ['6oz grilled chicken', '2 cups romaine', '1/4 cup light caesar dressing', 'parmesan', 'croutons'], ['Chop romaine', 'Top with chicken, dressing, parmesan, croutons'], ['dairy', 'gluten', 'eggs'], true, []),
    makeMeal('wl-sun-d', 'Baked Chicken Thighs & Salad', 'dinner', 'weight-loss', { calories: 480, protein: 48, carbs: 18, fat: 24 }, ['2 chicken thighs', '2 cups mixed greens', '1/2 cup roasted vegetables', '1/4 cup balsamic vinaigrette'], ['Bake chicken thighs at 400°F for 35 min', 'Serve over greens with vegetables'], ['none'], false, []),
    makeMeal('wl-sun-s', 'Protein Bar', 'snack', 'weight-loss', { calories: 220, protein: 24, carbs: 22, fat: 6 }, ['1 protein bar'], ['Eat as snack'], ['varies'], false, []),
  ],
  'cardio': [
    makeMeal('c-mon-b', 'Oatmeal with Banana', 'breakfast', 'cardio', { calories: 420, protein: 18, carbs: 72, fat: 10 }, ['1 cup oats', '1 banana', '1 cup almond milk', 'cinnamon', 'honey'], ['Cook oats with almond milk', 'Top with sliced banana, cinnamon, honey'], ['gluten', 'nuts'], true, []),
    makeMeal('c-mon-l', 'Brown Rice & Black Beans', 'lunch', 'cardio', { calories: 520, protein: 22, carbs: 92, fat: 8 }, ['1 cup brown rice', '1/2 cup black beans', '1/2 cup corn', 'salsa', 'avocado'], ['Cook rice', 'Combine with beans, corn, salsa'], ['none'], false, []),
    makeMeal('c-mon-d', 'Grilled Chicken & Sweet Potato', 'dinner', 'cardio', { calories: 580, protein: 42, carbs: 68, fat: 12 }, ['6oz chicken breast', '1 large sweet potato', '1 cup green beans', 'herbs'], ['Bake sweet potato', 'Grill chicken with herbs'], ['none'], false, []),
    makeMeal('c-mon-s', 'Apple & Peanut Butter', 'snack', 'cardio', { calories: 280, protein: 8, carbs: 36, fat: 14 }, ['1 apple', '2 tbsp peanut butter'], ['Slice apple, serve with peanut butter'], ['nuts'], false, []),
    makeMeal('c-tue-b', 'Whole Grain Cereal & Berries', 'breakfast', 'cardio', { calories: 380, protein: 14, carbs: 72, fat: 8 }, ['1.5 cups whole grain cereal', '1/2 cup blueberries', '1 cup skim milk'], ['Pour cereal, top with berries and milk'], ['dairy', 'gluten'], true, []),
    makeMeal('c-tue-l', 'Quinoa Vegetable Bowl', 'lunch', 'cardio', { calories: 480, protein: 20, carbs: 82, fat: 10 }, ['1 cup quinoa', '1/2 cup chickpeas', 'cucumber', 'tomato', 'feta', 'lemon'], ['Cook quinoa', 'Combine with vegetables, chickpeas, feta, lemon'], ['dairy'], true, []),
    makeMeal('c-tue-d', 'Salmon with Brown Rice', 'dinner', 'cardio', { calories: 620, protein: 42, carbs: 58, fat: 22 }, ['6oz salmon', '1 cup brown rice', '1 cup broccoli', 'lemon'], ['Bake salmon', 'Cook rice', 'Steam broccoli with lemon'], ['fish'], false, []),
    makeMeal('c-tue-s', 'Yogurt & Honey', 'snack', 'cardio', { calories: 220, protein: 18, carbs: 32, fat: 4 }, ['1 cup Greek yogurt', '1 tbsp honey'], ['Mix yogurt with honey'], ['dairy'], true, []),
    makeMeal('c-wed-b', 'Banana Protein Smoothie', 'breakfast', 'cardio', { calories: 360, protein: 28, carbs: 48, fat: 8 }, ['1 scoop vanilla protein', '1 banana', '1 cup oat milk', 'ice'], ['Blend all ingredients'], ['dairy'], true, []),
    makeMeal('c-wed-l', 'Turkey & Avocado Sandwich', 'lunch', 'cardio', { calories: 540, protein: 38, carbs: 52, fat: 20 }, ['5oz turkey breast', '2 slices whole grain bread', 'avocado', 'lettuce', 'tomato', 'mayo'], ['Layer turkey, avocado, lettuce, tomato on bread'], ['gluten', 'eggs'], true, []),
    makeMeal('c-wed-d', 'Pasta with Marinara & Vegetables', 'dinner', 'cardio', { calories: 580, protein: 22, carbs: 98, fat: 12 }, ['2 cups whole wheat pasta', '1 cup marinara sauce', '1 cup sautéed vegetables', 'parmesan'], ['Cook pasta', 'Heat sauce', 'Combine with vegetables, top with parmesan'], ['gluten', 'dairy'], true, []),
    makeMeal('c-wed-s', 'Trail Mix', 'snack', 'cardio', { calories: 320, protein: 10, carbs: 32, fat: 18 }, ['1/4 cup mixed nuts', '2 tbsp dried cranberries', '1 tbsp chocolate chips'], ['Mix together and snack'], ['nuts', 'soy'], false, []),
    makeMeal('c-thu-b', 'Egg & Cheese Toast', 'breakfast', 'cardio', { calories: 420, protein: 24, carbs: 38, fat: 20 }, ['2 eggs', '1 slice whole grain toast', '1oz cheddar', 'butter'], ['Scramble eggs with cheese', 'Toast bread with butter'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('c-thu-l', 'Mediterranean Wrap', 'lunch', 'cardio', { calories: 520, protein: 24, carbs: 68, fat: 18 }, ['1 whole wheat tortilla', '1/4 cup hummus', 'falafel', 'tabbouleh', 'feta', 'pickles'], ['Spread hummus on tortilla', 'Fill with falafel, tabbouleh, feta, pickles'], ['dairy', 'gluten'], true, []),
    makeMeal('c-thu-d', 'Chicken Stir-Fry with Rice', 'dinner', 'cardio', { calories: 560, protein: 38, carbs: 72, fat: 12 }, ['6oz chicken breast', '1 cup jasmine rice', '1.5 cups mixed vegetables', 'soy sauce', 'ginger'], ['Cook rice', 'Stir-fry chicken with vegetables'], ['soy'], false, []),
    makeMeal('c-thu-s', 'Banana', 'snack', 'cardio', { calories: 180, protein: 4, carbs: 32, fat: 2 }, ['2 medium bananas'], ['Eat as is'], ['none'], false, []),
    makeMeal('c-fri-b', 'Pancakes with Fresh Fruit', 'breakfast', 'cardio', { calories: 480, protein: 18, carbs: 82, fat: 12 }, ['2 pancakes', '1/2 cup mixed berries', 'maple syrup', 'light butter'], ['Make pancakes on griddle', 'Top with berries and maple syrup'], ['gluten', 'dairy', 'eggs'], true, []),
    makeMeal('c-fri-l', 'Fish Tacos', 'lunch', 'cardio', { calories: 540, protein: 32, carbs: 58, fat: 18 }, ['5oz grilled fish', '2 corn tortillas', 'cabbage slaw', 'salsa', 'lime', 'avocado'], ['Grill fish', 'Warm tortillas', 'Assemble tacos with slaw, salsa, avocado'], ['fish'], false, []),
    makeMeal('c-fri-d', 'Lean Beef & Potato', 'dinner', 'cardio', { calories: 620, protein: 44, carbs: 68, fat: 18 }, ['6oz sirloin', '1 large potato', '1 cup broccoli', 'butter'], ['Grill steak', 'Bake potato with butter'], ['dairy'], false, []),
    makeMeal('c-fri-s', 'Protein Shake', 'snack', 'cardio', { calories: 260, protein: 28, carbs: 24, fat: 6 }, ['1 scoop whey protein', '1 cup skim milk', 'ice'], ['Blend and drink'], ['dairy'], true, []),
    makeMeal('c-sat-b', 'Breakfast Burrito', 'breakfast', 'cardio', { calories: 580, protein: 28, carbs: 68, fat: 22 }, ['2 eggs', '1 large tortilla', 'black beans', 'cheese', 'salsa'], ['Scramble eggs with beans and cheese', 'Wrap in tortilla with salsa'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('c-sat-l', 'Chicken Caesar Salad', 'lunch', 'cardio', { calories: 520, protein: 42, carbs: 32, fat: 26 }, ['6oz grilled chicken', '2 cups romaine', '2 tbsp caesar dressing', 'parmesan', 'croutons'], ['Chop romaine', 'Add chicken, dressing, parmesan, croutons'], ['dairy', 'gluten', 'eggs'], true, []),
    makeMeal('c-sat-d', 'Shrimp & Pasta', 'dinner', 'cardio', { calories: 580, protein: 38, carbs: 72, fat: 14 }, ['5oz shrimp', '1.5 cups penne', '1 cup marinara', 'garlic bread', 'parmesan'], ['Cook pasta', 'Sauté shrimp', 'Combine with sauce, serve with garlic bread and parmesan'], ['shellfish', 'gluten', 'dairy'], true, []),
    makeMeal('c-sat-s', 'Cottage Cheese & Fruit', 'snack', 'cardio', { calories: 240, protein: 22, carbs: 28, fat: 4 }, ['1 cup cottage cheese', '1/2 cup canned peaches'], ['Top cottage cheese with peaches'], ['dairy'], true, []),
    makeMeal('c-sun-b', 'French Toast with Berries', 'breakfast', 'cardio', { calories: 480, protein: 20, carbs: 72, fat: 14 }, ['2 slices thick bread', '2 eggs', 'cinnamon', 'maple syrup', '1/2 cup berries', 'powdered sugar'], ['Dip bread in egg mixture', 'Cook on griddle', 'Top with berries, syrup, powdered sugar'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('c-sun-l', 'Turkey & Cheese Sub', 'lunch', 'cardio', { calories: 560, protein: 38, carbs: 62, fat: 16 }, ['6oz turkey', 'sub roll', 'cheese', 'lettuce', 'tomato', 'onion', 'mayo'], ['Layer turkey and cheese on sub roll', 'Add vegetables and mayo'], ['dairy', 'gluten', 'eggs'], true, []),
    makeMeal('c-sun-d', 'Pork Chops & Rice', 'dinner', 'cardio', { calories: 620, protein: 44, carbs: 62, fat: 20 }, ['2 pork chops', '1 cup white rice', '1 cup glazed carrots', 'apple sauce'], ['Grill pork chops', 'Cook rice', 'Serve with carrots and apple sauce'], ['none'], false, []),
    makeMeal('c-sun-s', 'Protein Bar', 'snack', 'cardio', { calories: 260, protein: 24, carbs: 28, fat: 8 }, ['1 protein bar'], ['Eat as snack'], ['varies'], false, []),
  ],
  'flexibility': [
    makeMeal('fl-mon-b', 'Light Oatmeal with Honey', 'breakfast', 'flexibility', { calories: 340, protein: 12, carbs: 62, fat: 8 }, ['1 cup oats', '1 tbsp honey', 'cinnamon', '1/2 cup blueberries', 'almond milk'], ['Cook oats with almond milk', 'Top with honey, cinnamon, blueberries'], ['gluten', 'nuts'], true, []),
    makeMeal('fl-mon-l', 'Vegetable Buddha Bowl', 'lunch', 'flexibility', { calories: 420, protein: 18, carbs: 62, fat: 14 }, ['1/2 cup quinoa', '1/2 cup roasted sweet potato', '1/2 cup chickpeas', 'avocado', 'kale', 'tahini dressing'], ['Arrange all in bowl', 'Drizzle with tahini dressing'], ['sesame'], false, []),
    makeMeal('fl-mon-d', 'Baked Fish with Vegetables', 'dinner', 'flexibility', { calories: 380, protein: 38, carbs: 24, fat: 12 }, ['5oz cod', '1 cup steamed vegetables', 'lemon', 'herbs', 'olive oil'], ['Bake fish with lemon and herbs', 'Steam vegetables'], ['fish'], false, []),
    makeMeal('fl-mon-s', 'Sliced Apples & Cheese', 'snack', 'flexibility', { calories: 220, protein: 10, carbs: 24, fat: 12 }, ['1 apple', '2oz mild cheddar'], ['Slice apple', 'Serve with cheese slices'], ['dairy'], true, []),
    makeMeal('fl-tue-b', 'Yogurt Parfait', 'breakfast', 'flexibility', { calories: 320, protein: 22, carbs: 42, fat: 8 }, ['1 cup Greek yogurt', '1/4 cup granola', '1/2 cup mixed berries', '1 tbsp honey'], ['Layer yogurt with granola and berries', 'Drizzle honey'], ['dairy', 'gluten'], true, []),
    makeMeal('fl-tue-l', 'Lentil Soup & Salad', 'lunch', 'flexibility', { calories: 440, protein: 22, carbs: 62, fat: 12 }, ['1 cup lentil soup', 'side salad', 'olive oil', 'lemon'], ['Warm lentil soup', 'Toss salad with olive oil and lemon'], ['none'], false, []),
    makeMeal('fl-tue-d', 'Chicken & Brown Rice', 'dinner', 'flexibility', { calories: 520, protein: 40, carbs: 58, fat: 12 }, ['5oz chicken breast', '1 cup brown rice', '1 cup steamed vegetables', 'herbs'], ['Grill chicken', 'Cook rice', 'Steam vegetables'], ['none'], false, []),
    makeMeal('fl-tue-s', 'Carrots & Hummus', 'snack', 'flexibility', { calories: 180, protein: 8, carbs: 24, fat: 6 }, ['1 cup carrot sticks', '1/4 cup hummus'], ['Dip carrots in hummus'], ['sesame'], false, []),
    makeMeal('fl-wed-b', 'Banana Smoothie', 'breakfast', 'flexibility', { calories: 320, protein: 14, carbs: 58, fat: 8 }, ['1 banana', '1 cup oat milk', '1 tbsp almond butter', 'cinnamon'], ['Blend all until smooth'], ['nuts'], true, []),
    makeMeal('fl-wed-l', 'Mediterranean Plate', 'lunch', 'flexibility', { calories: 480, protein: 20, carbs: 52, fat: 22 }, ['Falafel', 'hummus', 'tabbouleh', 'feta', 'olives', 'whole grain pita'], ['Arrange all on plate', 'Serve with pita'], ['dairy', 'gluten'], true, []),
    makeMeal('fl-wed-d', 'Vegetable Curry & Rice', 'dinner', 'flexibility', { calories: 520, protein: 18, carbs: 78, fat: 16 }, ['1 cup vegetable curry', '1 cup basmati rice', 'naan bread'], ['Cook vegetable curry', 'Serve over rice with naan'], ['gluten', 'dairy'], true, []),
    makeMeal('fl-wed-s', 'Rice Cakes & Avocado', 'snack', 'flexibility', { calories: 200, protein: 4, carbs: 22, fat: 12 }, ['2 rice cakes', '1/2 avocado', 'salt', 'lime'], ['Mash avocado on rice cakes', 'Season with salt and lime'], ['none'], false, []),
    makeMeal('fl-thu-b', 'Scrambled Eggs & Toast', 'breakfast', 'flexibility', { calories: 380, protein: 24, carbs: 32, fat: 18 }, ['3 eggs', '1 slice whole grain toast', 'butter', 'herbs'], ['Scramble eggs with herbs', 'Toast bread with butter'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('fl-thu-l', 'Black Bean & Corn Salad', 'lunch', 'flexibility', { calories: 400, protein: 18, carbs: 62, fat: 10 }, ['1/2 cup black beans', '1/2 cup corn', 'tomato', 'avocado', 'lime', 'cilantro'], ['Combine all ingredients', 'Season with lime and cilantro'], ['none'], false, []),
    makeMeal('fl-thu-d', 'Teriyaki Chicken & Rice', 'dinner', 'flexibility', { calories: 540, protein: 42, carbs: 62, fat: 12 }, ['5oz chicken', '1 cup jasmine rice', '1/2 cup teriyaki sauce', 'steamed broccoli'], ['Grill chicken with teriyaki', 'Cook rice', 'Steam broccoli'], ['soy', 'gluten'], false, []),
    makeMeal('fl-thu-s', 'Protein Shake', 'snack', 'flexibility', { calories: 240, protein: 28, carbs: 18, fat: 6 }, ['1 scoop protein', '1 cup water', 'ice'], ['Blend and drink'], ['dairy'], false, []),
    makeMeal('fl-fri-b', 'Whole Grain Pancakes', 'breakfast', 'flexibility', { calories: 420, protein: 16, carbs: 68, fat: 12 }, ['2 pancakes', 'maple syrup', 'fresh fruit', 'light butter'], ['Make pancakes on griddle', 'Top with fruit and syrup'], ['gluten', 'dairy', 'eggs'], true, []),
    makeMeal('fl-fri-l', 'Caprese Salad', 'lunch', 'flexibility', { calories: 380, protein: 22, carbs: 18, fat: 24 }, ['8oz fresh mozzarella', '2 large tomatoes', 'fresh basil', 'balsamic glaze', 'olive oil'], ['Slice mozzarella and tomatoes', 'Arrange with basil', 'Drizzle with balsamic and olive oil'], ['dairy'], true, []),
    makeMeal('fl-fri-d', 'Salmon with Roasted Vegetables', 'dinner', 'flexibility', { calories: 520, protein: 40, carbs: 28, fat: 26 }, ['5oz salmon', '1 cup roasted root vegetables', 'lemon', 'dill'], ['Bake salmon with lemon and dill', 'Roast vegetables'], ['fish', 'dairy'], true, []),
    makeMeal('fl-fri-s', 'Cucumber & Cream Cheese', 'snack', 'flexibility', { calories: 180, protein: 6, carbs: 10, fat: 14 }, ['1 cucumber', '3 tbsp cream cheese', 'everything seasoning'], ['Slice cucumber', 'Spread cream cheese and sprinkle seasoning'], ['dairy'], true, []),
    makeMeal('fl-sat-b', 'Avocado Toast', 'breakfast', 'flexibility', { calories: 380, protein: 14, carbs: 42, fat: 20 }, ['2 slices whole grain toast', '1 avocado', 'lemon', 'salt', 'pepper', 'red pepper flakes'], ['Toast bread', 'Mash avocado with lemon, salt, pepper', 'Spread on toast, sprinkle red pepper flakes'], ['gluten'], false, []),
    makeMeal('fl-sat-l', 'Grilled Chicken Greek Salad', 'lunch', 'flexibility', { calories: 460, protein: 42, carbs: 22, fat: 24 }, ['5oz grilled chicken', '2 cups romaine', 'olives', 'feta', 'cucumber', 'tomato', 'red onion', 'Greek dressing'], ['Chop romaine and vegetables', 'Add sliced chicken, olives, feta', 'Toss with Greek dressing'], ['dairy'], true, []),
    makeMeal('fl-sat-d', 'Vegetable Stir-Fry & Rice', 'dinner', 'flexibility', { calories: 480, protein: 16, carbs: 72, fat: 14 }, ['1.5 cups mixed vegetables', '1 cup jasmine rice', 'soy sauce', 'ginger', 'sesame oil'], ['Cook rice', 'Stir-fry vegetables with ginger', 'Season with soy sauce and sesame oil'], ['soy', 'sesame'], false, []),
    makeMeal('fl-sat-s', 'Berries & Whipped Cream', 'snack', 'flexibility', { calories: 200, protein: 4, carbs: 24, fat: 10 }, ['1 cup mixed berries', '1/4 cup whipped cream'], ['Top berries with whipped cream'], ['dairy'], true, []),
    makeMeal('fl-sun-b', 'Eggs Benedict', 'breakfast', 'flexibility', { calories: 520, protein: 28, carbs: 32, fat: 34 }, ['2 english muffins', '4 eggs', '4 slices canadian bacon', 'hollandaise sauce'], ['Toast english muffins', 'Warm bacon', 'Poach eggs, top with hollandaise'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('fl-sun-l', 'Chicken Pita with Hummus', 'lunch', 'flexibility', { calories: 480, protein: 32, carbs: 52, fat: 16 }, ['5oz grilled chicken', '1 pita bread', 'hummus', 'lettuce', 'tomato', 'tzatziki'], ['Slice chicken', 'Warm pita', 'Fill with chicken, hummus, vegetables, tzatziki'], ['dairy', 'gluten'], true, []),
    makeMeal('fl-sun-d', 'Roast Beef & Potato', 'dinner', 'flexibility', { calories: 580, protein: 44, carbs: 52, fat: 22 }, ['5oz roast beef', '1 large potato', '1 cup green beans', 'gravy', 'horseradish'], ['Slice roast beef', 'Bake potato', 'Serve with gravy and horseradish'], ['dairy'], false, []),
    makeMeal('fl-sun-s', 'Cheese & Crackers', 'snack', 'flexibility', { calories: 280, protein: 12, carbs: 22, fat: 18 }, ['2oz cheese', '6 whole grain crackers'], ['Serve cheese with crackers'], ['dairy', 'gluten'], true, []),
  ],
  'general-health': [
    makeMeal('gh-mon-b', 'Oatmeal with Berries', 'breakfast', 'general-health', { calories: 380, protein: 16, carbs: 62, fat: 10 }, ['1 cup oats', '1/2 cup mixed berries', '1 tbsp honey', 'cinnamon', 'almond milk'], ['Cook oats with almond milk', 'Top with berries, honey, cinnamon'], ['nuts', 'gluten'], true, []),
    makeMeal('gh-mon-l', 'Turkey & Cheese Wrap', 'lunch', 'general-health', { calories: 480, protein: 34, carbs: 48, fat: 18 }, ['4oz turkey', 'whole wheat tortilla', 'cheese', 'lettuce', 'tomato', 'mustard'], ['Layer turkey and cheese on tortilla', 'Add vegetables and mustard'], ['dairy', 'gluten'], true, []),
    makeMeal('gh-mon-d', 'Grilled Chicken with Rice', 'dinner', 'general-health', { calories: 540, protein: 44, carbs: 58, fat: 12 }, ['6oz chicken breast', '1 cup brown rice', '1 cup steamed broccoli', 'lemon', 'herbs'], ['Grill chicken with herbs', 'Cook rice', 'Steam broccoli with lemon'], ['none'], false, []),
    makeMeal('gh-mon-s', 'Apple & Almond Butter', 'snack', 'general-health', { calories: 260, protein: 6, carbs: 32, fat: 12 }, ['1 apple', '1.5 tbsp almond butter'], ['Slice apple', 'Serve with almond butter'], ['nuts'], false, []),
    makeMeal('gh-tue-b', 'Greek Yogurt Parfait', 'breakfast', 'general-health', { calories: 320, protein: 24, carbs: 38, fat: 8 }, ['1.5 cups Greek yogurt', '1/4 cup granola', '1/2 cup berries', '1 tbsp honey'], ['Layer yogurt, granola, berries', 'Drizzle honey'], ['dairy', 'gluten'], true, []),
    makeMeal('gh-tue-l', 'Tuna Salad Sandwich', 'lunch', 'general-health', { calories: 520, protein: 36, carbs: 42, fat: 20 }, ['4oz canned tuna', '2 slices whole grain bread', 'mayo', 'celery', 'lettuce', 'tomato'], ['Mix tuna with mayo and celery', 'Serve on bread with lettuce and tomato'], ['fish', 'eggs', 'gluten'], true, []),
    makeMeal('gh-tue-d', 'Salmon with Vegetables', 'dinner', 'general-health', { calories: 560, protein: 42, carbs: 32, fat: 24 }, ['6oz salmon', '1 cup roasted vegetables', 'lemon', 'dill', '1 tbsp olive oil'], ['Bake salmon with lemon and dill', 'Roast vegetables with olive oil'], ['fish'], false, []),
    makeMeal('gh-tue-s', 'Trail Mix', 'snack', 'general-health', { calories: 300, protein: 10, carbs: 28, fat: 18 }, ['1/4 cup almonds', '2 tbsp raisins', '1 tbsp chocolate chips'], ['Mix together'], ['nuts', 'soy'], false, []),
    makeMeal('gh-wed-b', 'Egg & Cheese Muffin', 'breakfast', 'general-health', { calories: 420, protein: 24, carbs: 38, fat: 20 }, ['1 english muffin', '2 eggs', '1oz cheddar', 'butter'], ['Toast muffin', 'Cook eggs and cheese', 'Assemble sandwich'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('gh-wed-l', 'Chicken Caesar Salad', 'lunch', 'general-health', { calories: 480, protein: 42, carbs: 22, fat: 26 }, ['5oz grilled chicken', '2 cups romaine', '2 tbsp caesar dressing', 'parmesan', 'croutons'], ['Chop romaine', 'Add sliced chicken, dressing, parmesan, croutons'], ['dairy', 'gluten', 'eggs'], true, []),
    makeMeal('gh-wed-d', 'Beef & Broccoli', 'dinner', 'general-health', { calories: 580, protein: 42, carbs: 52, fat: 20 }, ['5oz flank steak', '1 cup white rice', '1.5 cups broccoli', 'soy sauce', 'garlic'], ['Stir-fry beef with broccoli', 'Serve over rice with soy sauce'], ['soy'], false, []),
    makeMeal('gh-wed-s', 'Protein Bar', 'snack', 'general-health', { calories: 240, protein: 22, carbs: 26, fat: 8 }, ['1 protein bar'], ['Eat as snack'], ['varies'], false, []),
    makeMeal('gh-thu-b', 'Pancakes with Maple Syrup', 'breakfast', 'general-health', { calories: 460, protein: 16, carbs: 72, fat: 14 }, ['2 medium pancakes', '2 tbsp maple syrup', 'light butter', 'fresh fruit'], ['Make pancakes on griddle', 'Top with butter, syrup, fruit'], ['gluten', 'dairy', 'eggs'], true, []),
    makeMeal('gh-thu-l', 'Mediterranean Chicken Bowl', 'lunch', 'general-health', { calories: 500, protein: 40, carbs: 48, fat: 16 }, ['5oz grilled chicken', '1/2 cup quinoa', 'cucumber', 'tomato', 'feta', 'olives', 'hummus'], ['Cube chicken', 'Combine with quinoa and vegetables', 'Top with feta, olives, serve with hummus'], ['dairy', 'gluten', 'sesame'], true, []),
    makeMeal('gh-thu-d', 'Pork Chops & Potato', 'dinner', 'general-health', { calories: 600, protein: 42, carbs: 58, fat: 20 }, ['2 pork chops', '1 large potato', '1/2 cup corn', 'butter'], ['Grill pork chops', 'Bake potato with butter', 'Serve with corn'], ['dairy'], false, []),
    makeMeal('gh-thu-s', 'Celery & Peanut Butter', 'snack', 'general-health', { calories: 220, protein: 8, carbs: 18, fat: 14 }, ['4 celery stalks', '2 tbsp peanut butter'], ['Spread peanut butter on celery'], ['nuts'], false, []),
    makeMeal('gh-fri-b', 'Breakfast Burrito', 'breakfast', 'general-health', { calories: 540, protein: 28, carbs: 54, fat: 24 }, ['2 eggs', '1 large tortilla', 'black beans', 'cheese', 'salsa'], ['Scramble eggs with beans and cheese', 'Wrap in tortilla with salsa'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('gh-fri-l', 'Shrimp Avocado Salad', 'lunch', 'general-health', { calories: 420, protein: 32, carbs: 18, fat: 26 }, ['5oz grilled shrimp', '1 avocado', '2 cups mixed greens', 'lime', 'olive oil', 'red onion'], ['Toss shrimp and greens with avocado', 'Dress with lime and olive oil'], ['shellfish'], false, []),
    makeMeal('gh-fri-d', 'Spaghetti & Meatballs', 'dinner', 'general-health', { calories: 680, protein: 38, carbs: 82, fat: 20 }, ['1.5 cups spaghetti', '6 meatballs', '1/2 cup marinara', 'parmesan', 'garlic bread'], ['Cook pasta', 'Heat meatballs with marinara', 'Serve with parmesan and garlic bread'], ['gluten', 'dairy', 'eggs'], true, []),
    makeMeal('gh-fri-s', 'Cottage Cheese & Fruit', 'snack', 'general-health', { calories: 220, protein: 20, carbs: 26, fat: 4 }, ['1 cup cottage cheese', '1/2 cup canned peaches'], ['Top cottage cheese with peaches'], ['dairy'], true, []),
    makeMeal('gh-sat-b', 'French Toast', 'breakfast', 'general-health', { calories: 480, protein: 20, carbs: 58, fat: 18 }, ['2 thick slices bread', '2 eggs', 'cinnamon', 'maple syrup', 'butter', 'berries'], ['Dip bread in egg mixture', 'Cook on griddle', 'Top with berries and syrup'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('gh-sat-l', 'Fish Tacos', 'lunch', 'general-health', { calories: 520, protein: 30, carbs: 48, fat: 22 }, ['5oz grilled fish', '2 corn tortillas', 'cabbage slaw', 'salsa', 'avocado', 'lime'], ['Grill fish', 'Warm tortillas', 'Assemble tacos'], ['fish'], false, []),
    makeMeal('gh-sat-d', 'Chicken Stir-Fry', 'dinner', 'general-health', { calories: 540, protein: 40, carbs: 58, fat: 14 }, ['6oz chicken breast', '1 cup jasmine rice', '1.5 cups mixed vegetables', 'soy sauce', 'ginger'], ['Stir-fry chicken with vegetables', 'Serve over rice with soy sauce'], ['soy'], false, []),
    makeMeal('gh-sat-s', 'Yogurt & Honey', 'snack', 'general-health', { calories: 200, protein: 16, carbs: 28, fat: 4 }, ['1 cup Greek yogurt', '1 tbsp honey'], ['Mix yogurt with honey'], ['dairy'], true, []),
    makeMeal('gh-sun-b', 'Eggs & Toast', 'breakfast', 'general-health', { calories: 420, protein: 24, carbs: 34, fat: 22 }, ['3 eggs', '2 slices whole grain toast', 'butter', 'herbs'], ['Scramble eggs with herbs', 'Toast bread with butter'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('gh-sun-l', 'Turkey Club', 'lunch', 'general-health', { calories: 560, protein: 38, carbs: 48, fat: 24 }, ['5oz turkey', '3 slices bread', 'bacon', 'lettuce', 'tomato', 'mayo'], ['Layer turkey, bacon, lettuce, tomato', 'Serve as club sandwich'], ['eggs', 'dairy', 'gluten'], true, []),
    makeMeal('gh-sun-d', 'Steak & Baked Potato', 'dinner', 'general-health', { calories: 680, protein: 48, carbs: 58, fat: 28 }, ['6oz ribeye', '1 large potato', '4 tbsp butter', 'sour cream', 'chives', '1 cup asparagus'], ['Grill steak', 'Bake potato with toppings', 'Serve with asparagus'], ['dairy'], false, []),
    makeMeal('gh-sun-s', 'Protein Shake', 'snack', 'general-health', { calories: 260, protein: 28, carbs: 22, fat: 6 }, ['1 scoop whey protein', '1 cup skim milk', 'ice'], ['Blend and drink'], ['dairy'], true, []),
  ],
}

export function generateMealPlan(goal: Goal, days: number = 7, profile?: { weight: number; height: number; age: number; gender: string; bodyType?: string; workoutDays?: number; sessionDuration?: number }): MealPlan {
  let meals = mealsDatabase[goal] || mealsDatabase['general-health']
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].slice(0, days)

  // Calculate BMR using Mifflin-St Jeor equation
  const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height * 2.54 - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height * 2.54 - 5 * age - 161
    }
  }

  // Calculate TDEE with activity multiplier
  const calculateTDEE = (bmr: number, workoutDays: number, sessionDuration: number): number => {
    // Activity multiplier based on workout frequency and duration
    const weeklyExerciseMinutes = (workoutDays || 3) * (sessionDuration || 30)
    let activityMultiplier = 1.2 // sedentary

    if (weeklyExerciseMinutes > 300) activityMultiplier = 1.375 // light activity
    if (weeklyExerciseMinutes > 450) activityMultiplier = 1.55  // moderate
    if (weeklyExerciseMinutes > 600) activityMultiplier = 1.725 // very active
    if (weeklyExerciseMinutes > 900) activityMultiplier = 1.9   // extra active

    return Math.round(bmr * activityMultiplier)
  }

  // Determine calorie modifier based on goal and body type
  const getCalorieModifier = (goal: Goal, bodyType?: string): number => {
    // Base modifiers per goal
    let modifier = 1.0

    switch (goal) {
      case 'muscle-building':
        modifier = 1.15 // 15% surplus
        break
      case 'strength':
        modifier = 1.10 // 10% surplus
        break
      case 'weight-loss':
        modifier = 0.80 // 20% deficit
        break
      case 'cardio':
        modifier = 0.90 // 10% deficit
        break
      case 'flexibility':
        modifier = 1.0 // maintenance
        break
      default:
        modifier = 1.0
    }

    // Body type adjustments
    if (bodyType === 'ectomorph') {
      modifier += 0.10 // hard gainer, needs more calories
    } else if (bodyType === 'endomorph') {
      modifier -= 0.05 // easier gainer, slightly less
    }

    return modifier
  }

  // Calculate target daily calories if profile provided
  let targetCalories = 2200 // default
  let calorieRatio = 1.0

  if (profile) {
    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender)
    const tdee = calculateTDEE(bmr, profile.workoutDays || 3, profile.sessionDuration || 30)
    const modifier = getCalorieModifier(goal, profile.bodyType)
    targetCalories = Math.round(tdee * modifier)
  }

  // Get total calories from current meal plan
  const sampleDay = meals.slice(0, 4)
  const currentDailyCalories = sampleDay.reduce((sum, m) => sum + m.macros.calories, 0)

  // Calculate ratio to adjust calories
  if (currentDailyCalories > 0) {
    calorieRatio = targetCalories / currentDailyCalories
  }

  // Scale meal calories to match target
  const scaleCalories = (meal: Meal): Meal => {
    const scaledMeal = { ...meal }
    const scaledMacros = { ...meal.macros }
    const newCalories = Math.round(meal.macros.calories * calorieRatio)

    // Scale macros proportionally but keep reasonable ratios
    const ratio = newCalories / meal.macros.calories
    scaledMacros.calories = newCalories
    scaledMacros.protein = Math.round(meal.macros.protein * ratio)
    scaledMacros.carbs = Math.round(meal.macros.carbs * ratio)
    scaledMacros.fat = Math.round(meal.macros.fat * ratio)

    scaledMeal.macros = scaledMacros
    return scaledMeal
  }

  const mealDays = dayNames.map((dayName) => {
    const breakfast = meals.find(m => m.type === 'breakfast')!
    const lunch = meals.find(m => m.type === 'lunch')!
    const dinner = meals.find(m => m.type === 'dinner')!
    const snack = meals.find(m => m.type === 'snack')!

    const dayMeals = [
      { ...scaleCalories(breakfast), id: `${dayName.toLowerCase()}-breakfast` },
      { ...scaleCalories(lunch), id: `${dayName.toLowerCase()}-lunch` },
      { ...scaleCalories(dinner), id: `${dayName.toLowerCase()}-dinner` },
      { ...scaleCalories(snack), id: `${dayName.toLowerCase()}-snack` },
    ]

    const totalMacros = dayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.macros.calories,
        protein: acc.protein + meal.macros.protein,
        carbs: acc.carbs + meal.macros.carbs,
        fat: acc.fat + meal.macros.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )

    return { dayName, meals: dayMeals, totalMacros }
  })

  return { days: mealDays, generatedAt: new Date().toISOString() }
}

export function getSuggestedItems(): SuggestedItem[] {
  return [
    { name: 'Grass-Fed Whey Protein', description: '25g protein per serving', benefit: 'Muscle recovery', price: '$39.99', link: 'https://www.amazon.com/dp/B00JSQ4X1K?tag=quickfit0f-20', category: 'food' },
    { name: 'HMR Meal Pack', description: 'Ready to Eat Meals – Shelf Stable, No Refrigeration, Prepared Meals for Lunch or Dinner, 6 Premade, High-Protein, Low-Calorie', benefit: 'Convenient meal solution', price: '$33.99', link: 'https://amzn.to/4mc5yX1', image: 'https://m.media-amazon.com/images/I/71v2r58ADWL._SL1500_.jpg', category: 'food' },
    { name: 'KIND Nut Bars', description: 'Caramel Almond & Sea Salt, Healthy Snacks, Gluten Free, Low Sugar, 6g Protein, 12 Count', benefit: 'Healthy grab-and-go snack', price: '$13.18', link: 'https://amzn.to/4sVU38L', image: 'https://m.media-amazon.com/images/I/71nYq+jqbfL._SL1500_.jpg', category: 'food' },
    { name: 'Emergency Survival Food Bars', description: 'High-Calorie Lemon Shortbread with 14 Vitamins & Minerals, 5-Year Shelf Life', benefit: 'Long-lasting emergency food', price: '$24.95', link: 'https://amzn.to/4tmdDKQ', image: 'https://m.media-amazon.com/images/I/61rrJMJZDdL._SL1080_.jpg', category: 'food' },
    { name: 'VitaCup Keto Coffee Pods', description: 'Organic Keto Coffee with MCT Oil, Turmeric, B Vitamins, D3, Medium Dark Roast, Single Serve Pods Compatible w/Keurig K-Cup Brewers, 24 Count', benefit: 'Energy and focus boost', price: '$38.37', link: 'https://amzn.to/4vvf383', image: 'https://m.media-amazon.com/images/I/7113K49SAgL._SL1500_.jpg', category: 'food' },
    { name: 'Organic Eggs (Dozen)', description: 'Pasture-raised, high in omega-3', benefit: 'Complete protein source', price: '$6.99', link: 'https://www.amazon.com/dp/B00K0RPN2W?tag=quickfit0f-20', category: 'food' },
    { name: 'Frozen Wild Blueberries', description: 'Antioxidant-rich superfood', benefit: 'Anti-inflammatory', price: '$8.99', link: 'https://www.amazon.com/dp/B07YXS1XYZ?tag=quickfit0f-20', category: 'food' },
    { name: 'Organic Quinoa (2lb)', description: 'Complete protein grain', benefit: 'Complex carbs and fiber', price: '$12.99', link: 'https://www.amazon.com/dp/B077TSGRCB?tag=quickfit0f-20', category: 'food' },
    { name: 'Almond Butter', description: 'Raw, unblanched almonds', benefit: 'Healthy fats and protein', price: '$14.99', link: 'https://www.amazon.com/dp/B077SH7R7K?tag=quickfit0f-20', category: 'food' },
    { name: 'Creatine Monohydrate', description: '5g per serving, unflavored', benefit: 'Strength and muscle gain', price: '$24.99', link: 'https://www.amazon.com/dp/B07BJ7BSHZ?tag=quickfit0f-20', category: 'supplement' },
    { name: 'BCAA Powder', description: '2:1:1 ratio, 30 servings', benefit: 'Recovery and endurance', price: '$29.99', link: 'https://www.amazon.com/dp/B06W9NKX62?tag=quickfit0f-20', category: 'supplement' },
    { name: 'Multivitamin Complex', description: 'Daily vitamin for active men/women', benefit: 'Overall health support', price: '$18.99', link: 'https://www.amazon.com/dp/B07B7DXDCL?tag=quickfit0f-20', category: 'supplement' },
    { name: 'Yoga Mat', description: 'Non-slip, 6mm thick', benefit: 'Floor exercises and stretching', price: '$34.99', link: 'https://www.amazon.com/dp/B07QMBZ8Y8?tag=quickfit0f-20', category: 'equipment' },
    { name: 'Resistance Bands Set', description: '5 levels of resistance', benefit: 'Home workout versatility', price: '$24.99', link: 'https://www.amazon.com/dp/B07XLW4JYJ?tag=quickfit0f-20', category: 'equipment' },
  ]
}

export default mealsDatabase
