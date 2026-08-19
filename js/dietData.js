/**
 * FitJourney - Indian Diet Database & Diet Planner Module
 */

const indianFoodDatabase = [
    { name: "Roti (Whole Wheat)", portion: "1 piece (35g)", calories: 80, protein: 3, category: "Carbs", type: "veg" },
    { name: "White Rice (Cooked)", portion: "1 bowl (150g)", calories: 195, protein: 4.3, category: "Carbs", type: "veg" },
    { name: "Brown Rice (Cooked)", portion: "1 bowl (150g)", calories: 170, protein: 4.5, category: "Carbs", type: "veg" },
    { name: "Yellow Dal / Moong Dal", portion: "1 bowl (150g)", calories: 150, protein: 9, category: "Protein", type: "veg" },
    { name: "Paneer (Raw/Cooked)", portion: "100g", calories: 265, protein: 18, category: "Protein", type: "veg" },
    { name: "Whole Eggs (Boiled)", portion: "2 eggs", calories: 155, protein: 13, category: "Protein", type: "non-veg" },
    { name: "Egg Whites", portion: "4 whites", calories: 68, protein: 14, category: "Protein", type: "non-veg" },
    { name: "Chicken Breast (Grilled)", portion: "100g", calories: 165, protein: 31, category: "Protein", type: "non-veg" },
    { name: "Soybean Chunks (Cooked)", portion: "50g (dry weight)", calories: 170, protein: 26, category: "Protein", type: "veg" },
    { name: "Milk (Full Cream)", portion: "1 glass (250ml)", calories: 150, protein: 8, category: "Dairy", type: "veg" },
    { name: "Milk (Toned/Low Fat)", portion: "1 glass (250ml)", calories: 110, protein: 8.5, category: "Dairy", type: "veg" },
    { name: "Curd / Dahi", portion: "1 cup (200g)", calories: 120, protein: 7, category: "Dairy", type: "veg" },
    { name: "Greek Yogurt / Hung Curd", portion: "1 cup (150g)", calories: 100, protein: 12, category: "Dairy", type: "veg" },
    { name: "Rajma (Kidney Beans Curry)", portion: "1 bowl (150g)", calories: 180, protein: 8.5, category: "Protein", type: "veg" },
    { name: "Chole (Chickpeas Curry)", portion: "1 bowl (150g)", calories: 210, protein: 9, category: "Protein", type: "veg" },
    { name: "Apple", portion: "1 medium (150g)", calories: 95, protein: 0.5, category: "Fruits", type: "veg" },
    { name: "Banana", portion: "1 medium (120g)", calories: 105, protein: 1.3, category: "Fruits", type: "veg" },
    { name: "Mixed Vegetables (Sabzi)", portion: "1 bowl (150g)", calories: 120, protein: 3, category: "Veggies", type: "veg" },
    { name: "Almonds & Walnuts", portion: "Handful (30g)", calories: 180, protein: 6, category: "Healthy Fats", type: "veg" }
];

const dietPlans = {
    weight_loss: {
        title: "Fat Loss & Calorie Deficit Plan",
        description: "High-protein, moderate-carb plan rich in fiber to preserve muscle while losing fat.",
        meals: [
            { time: "Early Morning", item: "Warm Lemon Water + 5 soaked Almonds", approxCal: 45, approxProtein: 1.5 },
            { time: "Breakfast", item: "3 Egg Whites + 1 Whole Egg or 100g Besan Chilla with veggies + 1 cup Toned Milk", approxCal: 310, approxProtein: 22 },
            { time: "Mid-Morning", item: "1 Apple or Green Tea + 5 Walnuts", approxCal: 120, approxProtein: 2 },
            { time: "Lunch", item: "2 Multigrain Rotis + 1 bowl Moong Dal + 1 bowl Sabzi + Cucumber Salad", approxCal: 420, approxProtein: 18 },
            { time: "Evening Snack", item: "Roasted Chana (50g) or Black Coffee + 100g Hung Curd", approxCal: 160, approxProtein: 10 },
            { time: "Dinner", item: "150g Grilled Chicken Breast OR 100g Paneer Bhurji + Bowl of Mixed Veggies / Salad", approxCal: 350, approxProtein: 30 }
        ]
    },
    weight_gain: {
        title: "Muscle Building & Calorie Surplus Plan",
        description: "Calorie and protein-dense plan designed for healthy weight and muscle tissue growth.",
        meals: [
            { time: "Early Morning", item: "1 Glass Full Cream Milk + 2 Bananas", approxCal: 320, approxProtein: 10 },
            { time: "Breakfast", item: "3 Whole Boiled Eggs / Paneer Paratha (2) + Curd", approxCal: 520, approxProtein: 24 },
            { time: "Mid-Morning", item: "Peanut Butter Shake (Milk + Oats + Peanut Butter + Banana)", approxCal: 480, approxProtein: 18 },
            { time: "Lunch", item: "3 Rotis + 1.5 bowl Rice + 1 bowl Rajma/Chole + 100g Curd", approxCal: 650, approxProtein: 25 },
            { time: "Evening Snack", item: "Soybean Chunks (50g dry cooked) or Paneer Sandwich", approxCal: 320, approxProtein: 26 },
            { time: "Dinner", item: "200g Chicken Curry / 150g Paneer Curry + 2 Rotis + 1 bowl Rice", approxCal: 620, approxProtein: 36 }
        ]
    },
    maintenance: {
        title: "Balanced Daily Maintenance Plan",
        description: "Balanced macronutrient distribution to maintain current weight and energy levels.",
        meals: [
            { time: "Early Morning", item: "Warm Water + Soaked Almonds & Raisins", approxCal: 70, approxProtein: 2 },
            { time: "Breakfast", item: "Oats Porridge with Milk & Fruits OR 2 Oats Idli with Sambar", approxCal: 350, approxProtein: 14 },
            { time: "Mid-Morning", item: "Seasonal Fruit (Papaya/Orange/Apple)", approxCal: 90, approxProtein: 1 },
            { time: "Lunch", item: "2 Whole Wheat Rotis + 1 bowl Brown Rice + 1 bowl Dal + Sabzi + Curd", approxCal: 510, approxProtein: 19 },
            { time: "Evening Snack", item: "Handful Roasted Makhana / Sprouts Salad + Tea/Coffee", approxCal: 150, approxProtein: 6 },
            { time: "Dinner", item: "1 bowl Dal/Fish/Chicken + 2 Rotis + Salad", approxCal: 420, approxProtein: 22 }
        ]
    },
    general: {
        title: "Vitality & General Health Plan",
        description: "Focus on micronutrients, high fiber, immunity boosters, and steady energy.",
        meals: [
            { time: "Early Morning", item: "Amla Juice / Herbal Tea + Soaked Nuts", approxCal: 60, approxProtein: 2 },
            { time: "Breakfast", item: "Vegetable Poha / Upma + 1 Boiled Egg or Sprouted Moong", approxCal: 320, approxProtein: 12 },
            { time: "Mid-Morning", item: "Coconut Water or 1 Fruit", approxCal: 80, approxProtein: 1 },
            { time: "Lunch", item: "2 Rotis + Seasonal Veggie + Moong Dal + Curd + Green Salad", approxCal: 460, approxProtein: 17 },
            { time: "Evening Snack", item: "Green Tea + Roasted Chana / Boiled Corn", approxCal: 130, approxProtein: 5 },
            { time: "Dinner", item: "Light Vegetable Soup + 1 Roti + Lauki/Tori Sabzi + Paneer (50g)", approxCal: 360, approxProtein: 15 }
        ]
    }
};
