/**
 * FitJourney - Health Calculator Engine
 * Formulate exact real calculations (Mifflin-St Jeor, BMI, TDEE, Macros, Water Intake)
 */

const FitCalculator = {
    /**
     * Calculate Body Mass Index
     * BMI = weight (kg) / (height (m))^2
     */
    calculateBMI(weightKg, heightCm) {
        if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        
        let category = "";
        let classColor = "";
        
        if (bmi < 18.5) {
            category = "Underweight";
            classColor = "#3b82f6"; // blue
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = "Normal Weight";
            classColor = "#10b981"; // green
        } else if (bmi >= 25 && bmi < 29.9) {
            category = "Overweight";
            classColor = "#f59e0b"; // amber
        } else {
            category = "Obese";
            classColor = "#ef4444"; // red
        }

        return {
            value: parseFloat(bmi.toFixed(1)),
            category: category,
            color: classColor
        };
    },

    /**
     * Calculate Basal Metabolic Rate using Mifflin-St Jeor Formula
     * Male: 10*W + 6.25*H - 5*A + 5
     * Female: 10*W + 6.25*H - 5*A - 161
     */
    calculateBMR(weightKg, heightCm, age, gender) {
        if (!weightKg || !heightCm || !age) return null;
        let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
        if (gender === "male") {
            bmr += 5;
        } else {
            bmr -= 161;
        }
        return Math.round(bmr);
    },

    /**
     * Calculate Total Daily Energy Expenditure (TDEE)
     */
    calculateTDEE(bmr, activityLevel) {
        if (!bmr) return null;
        const activityMultipliers = {
            sedentary: 1.2,        // Little or no exercise
            light: 1.375,         // Light exercise 1-3 days/week
            moderate: 1.55,       // Moderate exercise 3-5 days/week
            active: 1.725,        // Heavy exercise 6-7 days/week
            extra_active: 1.9     // Very intense exercise / physical job
        };
        const multiplier = activityMultipliers[activityLevel] || 1.2;
        return Math.round(bmr * multiplier);
    },

    /**
     * Calculate Target Calories based on Goal
     */
    calculateTargetCalories(tdee, goal) {
        if (!tdee) return null;
        switch (goal) {
            case "weight_loss":
                return Math.round(tdee - 500); // 500 kcal deficit (~0.5kg/week loss)
            case "weight_gain":
                return Math.round(tdee + 400); // 400 kcal surplus for lean gains
            case "weight_maintenance":
            case "general":
            default:
                return Math.round(tdee);
        }
    },

    /**
     * Calculate Recommended Protein (grams/day)
     */
    calculateProteinRequirement(weightKg, goal) {
        if (!weightKg) return null;
        let multiplier = 1.6; // default moderate
        if (goal === "weight_loss") multiplier = 2.0; // Higher protein preserves muscle in deficit
        else if (goal === "weight_gain") multiplier = 2.2; // High protein for muscle synthesis
        else if (goal === "general") multiplier = 1.4;

        return Math.round(weightKg * multiplier);
    },

    /**
     * Calculate Water Requirement in Liters/day
     * Base: 35ml per kg of body weight
     */
    calculateWaterRequirement(weightKg, activityLevel) {
        if (!weightKg) return null;
        let baseWaterLiters = (weightKg * 0.035);
        if (activityLevel === "active" || activityLevel === "extra_active") {
            baseWaterLiters += 0.5; // Extra for sweat loss
        }
        return parseFloat(baseWaterLiters.toFixed(1));
    }
};
