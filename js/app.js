/**
 * FitJourney - Main Application Controller & Event Handler
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Tracker State
    TrackerState.init();

    // 2. Setup Navbar & Responsive Mobile Menu
    setupNavigation();

    // 3. Initialize Forms & Listeners
    setupCalculatorForm();
    setupTrackerForm();
    setupDietPlanner();
    setupWorkoutSection();

    // 4. Initial Render of Dashboard Stats & UI
    updateDashboardUI();
    renderCharts();
});

/* ==========================================
   NAVIGATION & UI TAB SYSTEM
   ========================================== */
function setupNavigation() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            mobileMenuBtn.querySelector("i").classList.toggle("fa-bars");
            mobileMenuBtn.querySelector("i").classList.toggle("fa-times");
        });
    }

    // Close mobile nav on click
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    });
}

/* ==========================================
   HEALTH CALCULATOR FORM
   ========================================== */
function setupCalculatorForm() {
    const calcForm = document.getElementById("healthCalculatorForm");
    if (!calcForm) return;

    // Load initial values from TrackerState profile
    const p = TrackerState.profile;
    document.getElementById("calcName").value = p.name || "";
    document.getElementById("calcAge").value = p.age || "";
    document.getElementById("calcGender").value = p.gender || "";
    document.getElementById("calcHeight").value = p.height || "";
    document.getElementById("calcWeight").value = p.weight || "";
    document.getElementById("calcActivity").value = p.activity || "";
    document.getElementById("calcGoal").value = p.goal || "";

    // Clear field errors on input/change
    const fields = [
        { id: "calcName", group: "groupName", err: "errName" },
        { id: "calcAge", group: "groupAge", err: "errAge" },
        { id: "calcGender", group: "groupGender", err: "errGender" },
        { id: "calcHeight", group: "groupHeight", err: "errHeight" },
        { id: "calcWeight", group: "groupWeight", err: "errWeight" },
        { id: "calcActivity", group: "groupActivity", err: "errActivity" },
        { id: "calcGoal", group: "groupGoal", err: "errGoal" }
    ];

    fields.forEach(f => {
        const inputEl = document.getElementById(f.id);
        if (inputEl) {
            inputEl.addEventListener("input", () => clearFieldError(f.group));
            inputEl.addEventListener("change", () => clearFieldError(f.group));
        }
    });

    // Handle Form Submit
    calcForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        let isValid = true;

        // 1. Validate Name
        const nameVal = document.getElementById("calcName").value.trim();
        if (!nameVal) {
            showFieldError("groupName", "errName", "Please enter your name.");
            isValid = false;
        } else {
            clearFieldError("groupName");
        }

        // 2. Validate Age
        const ageVal = parseInt(document.getElementById("calcAge").value, 10);
        if (isNaN(ageVal) || ageVal < 10 || ageVal > 120) {
            showFieldError("groupAge", "errAge", "Please enter a valid age between 10 and 120 years.");
            isValid = false;
        } else {
            clearFieldError("groupAge");
        }

        // 3. Validate Gender
        const genderVal = document.getElementById("calcGender").value;
        if (!genderVal) {
            showFieldError("groupGender", "errGender", "Please select your gender.");
            isValid = false;
        } else {
            clearFieldError("groupGender");
        }

        // 4. Validate Height
        const heightVal = parseFloat(document.getElementById("calcHeight").value);
        if (isNaN(heightVal) || heightVal < 80 || heightVal > 250) {
            showFieldError("groupHeight", "errHeight", "Please enter a valid height between 80 and 250 cm.");
            isValid = false;
        } else {
            clearFieldError("groupHeight");
        }

        // 5. Validate Weight
        const weightVal = parseFloat(document.getElementById("calcWeight").value);
        if (isNaN(weightVal) || weightVal < 25 || weightVal > 300) {
            showFieldError("groupWeight", "errWeight", "Please enter a valid weight between 25 and 300 kg.");
            isValid = false;
        } else {
            clearFieldError("groupWeight");
        }

        // 6. Validate Activity Level
        const activityVal = document.getElementById("calcActivity").value;
        if (!activityVal) {
            showFieldError("groupActivity", "errActivity", "Please select your daily activity level.");
            isValid = false;
        } else {
            clearFieldError("groupActivity");
        }

        // 7. Validate Fitness Goal
        const goalVal = document.getElementById("calcGoal").value;
        if (!goalVal) {
            showFieldError("groupGoal", "errGoal", "Please select your primary fitness goal.");
            isValid = false;
        } else {
            clearFieldError("groupGoal");
        }

        if (!isValid) return;

        // Perform standard calculations & profile save
        TrackerState.saveProfile({
            name: nameVal,
            age: ageVal,
            gender: genderVal,
            height: heightVal,
            weight: weightVal,
            activity: activityVal,
            goal: goalVal
        });

        // Update UI displays across breakdown card, dashboard & diet planner
        updateCalculatorResultsUI();
        updateDashboardUI();
        renderCharts();

        // Trigger Success Toast & Smooth Scroll
        triggerSuccessToast();
    });

    // Setup Action Buttons
    const btnRecalculate = document.getElementById("btnRecalculate");
    if (btnRecalculate) {
        btnRecalculate.addEventListener("click", () => {
            document.getElementById("calcName").focus();
            calcForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    const btnSaveProgress = document.getElementById("btnSaveProgress");
    if (btnSaveProgress) {
        btnSaveProgress.addEventListener("click", () => {
            localStorage.setItem("fitjourney_profile", JSON.stringify(TrackerState.profile));
            alert(`Progress saved successfully for ${TrackerState.profile.name}! Your health targets are updated.`);
        });
    }

    // Populate initial calculation if profile complete
    updateCalculatorResultsUI();
}

function triggerSuccessToast() {
    const toast = document.getElementById("successToast");
    if (!toast) return;

    toast.classList.add("show");

    // Smooth scroll to results after toast appears
    setTimeout(() => {
        const resultsCard = document.getElementById("calcResultsCard");
        if (resultsCard) {
            resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 400);

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function showFieldError(groupId, errId, message) {
    const group = document.getElementById(groupId);
    const errSpan = document.getElementById(errId);
    if (group) group.classList.add("has-error");
    if (errSpan) errSpan.innerHTML = `<i class="fas fa-circle-exclamation"></i> ${message}`;
}

function clearFieldError(groupId) {
    const group = document.getElementById(groupId);
    if (group) group.classList.remove("has-error");
}

function updateCalculatorResultsUI() {
    const p = TrackerState.profile;
    const calc = p.calculated;
    if (!calc) return;

    // Report Header Cards
    const nameEl = document.getElementById("resUserName");
    if (nameEl) nameEl.textContent = `Name: ${p.name || 'User'}`;

    const goalBadge = document.getElementById("resGoalBadge");
    const goalTitleMap = {
        weight_loss: "Weight Loss",
        weight_maintenance: "Weight Maintenance",
        weight_gain: "Weight Gain",
        general: "General Fitness"
    };
    if (goalBadge) goalBadge.textContent = goalTitleMap[p.goal] || "Fitness";

    // Metrics Values
    document.getElementById("resBmiValue").textContent = calc.bmi;
    const bmiBadge = document.getElementById("resBmiCategory");
    bmiBadge.textContent = calc.bmiCategory;
    bmiBadge.style.backgroundColor = calc.bmiColor;
    
    document.getElementById("resBmrValue").textContent = `${calc.bmr} kcal/day`;
    document.getElementById("resTdeeValue").textContent = `${calc.tdee} kcal/day`;
    document.getElementById("resTargetCalValue").textContent = `${calc.targetCalories} kcal/day`;
    document.getElementById("resProteinValue").textContent = `${calc.targetProtein} g/day`;
    document.getElementById("resWaterValue").textContent = `${calc.targetWater} L/day`;

    // Goal Description text update
    const goalTextMap = {
        weight_loss: "Recommended: Moderate ~500 kcal Deficit for Healthy Fat Loss",
        weight_maintenance: "Recommended: Equal Energy Balance to Maintain Current Weight",
        weight_gain: "Recommended: Calorie Surplus (~400 kcal) for Muscle Hypertrophy",
        general: "Recommended: Balanced Maintenance Intake for Overall Vitality"
    };
    document.getElementById("resGoalSummary").textContent = goalTextMap[p.goal] || "Fitness Target";

    // 7. Personalized Plan Section Update
    const planCalAdvice = document.getElementById("planCalorieAdvice");
    const planMacroAdvice = document.getElementById("planMacroAdvice");
    const planWorkoutAdvice = document.getElementById("planWorkoutAdvice");
    const planDietAdvice = document.getElementById("planDietAdvice");

    if (p.goal === "weight_loss") {
        if (planCalorieAdvice) planCalorieAdvice.innerHTML = `<strong><i class="fas fa-bullseye"></i> Calorie Strategy:</strong> Consuming <strong>${calc.targetCalories} kcal/day</strong> (500 kcal deficit below your TDEE of ${calc.tdee} kcal) to lose fat while keeping muscle.`;
        if (planWorkoutAdvice) planWorkoutAdvice.innerHTML = `<strong><i class="fas fa-dumbbell"></i> Suggested Workout:</strong> HIIT Conditioning & Bodyweight Circuits (4-5 days/week).`;
        if (planDietAdvice) planDietAdvice.innerHTML = `<strong><i class="fas fa-utensils"></i> Diet Suggestions:</strong> Multigrain Roti, Moong Dal, Egg Whites, Grilled Chicken/Paneer, Salad & Buttermilk.`;
    } else if (p.goal === "weight_gain") {
        if (planCalorieAdvice) planCalorieAdvice.innerHTML = `<strong><i class="fas fa-bullseye"></i> Calorie Strategy:</strong> Consuming <strong>${calc.targetCalories} kcal/day</strong> (400 kcal surplus above TDEE of ${calc.tdee} kcal) to build muscle mass.`;
        if (planWorkoutAdvice) planWorkoutAdvice.innerHTML = `<strong><i class="fas fa-dumbbell"></i> Suggested Workout:</strong> Heavy Progressive Resistance & Muscle Hypertrophy (4 days/week Upper/Lower Split).`;
        if (planDietAdvice) planDietAdvice.innerHTML = `<strong><i class="fas fa-utensils"></i> Diet Suggestions:</strong> Paneer Paratha, Whole Eggs, Rice + Rajma/Chole, Banana Peanut Butter Shake, Full Cream Milk.`;
    } else if (p.goal === "weight_maintenance") {
        if (planCalorieAdvice) planCalorieAdvice.innerHTML = `<strong><i class="fas fa-bullseye"></i> Calorie Strategy:</strong> Consuming <strong>${calc.targetCalories} kcal/day</strong> matching your exact maintenance TDEE.`;
        if (planWorkoutAdvice) planWorkoutAdvice.innerHTML = `<strong><i class="fas fa-dumbbell"></i> Suggested Workout:</strong> Balanced Resistance Training & Moderate Cardio (3-4 days/week).`;
        if (planDietAdvice) planDietAdvice.innerHTML = `<strong><i class="fas fa-utensils"></i> Diet Suggestions:</strong> 2 Rotis + Brown Rice + Yellow Dal + Sabzi + Curd + Handful of Nuts.`;
    } else {
        if (planCalorieAdvice) planCalorieAdvice.innerHTML = `<strong><i class="fas fa-bullseye"></i> Calorie Strategy:</strong> Consuming <strong>${calc.targetCalories} kcal/day</strong> for steady energy and vitality.`;
        if (planWorkoutAdvice) planWorkoutAdvice.innerHTML = `<strong><i class="fas fa-dumbbell"></i> Suggested Workout:</strong> Daily Brisk Walking, Flexibility Mobility Drills & Full Body Bodyweight exercises.`;
        if (planDietAdvice) planDietAdvice.innerHTML = `<strong><i class="fas fa-utensils"></i> Diet Suggestions:</strong> Vegetable Poha, Herbal Teas, Sprouted Moong Salad, Fresh Fruits & Light Soups.`;
    }

    if (planMacroAdvice) {
        planMacroAdvice.innerHTML = `<strong><i class="fas fa-drumstick-bite"></i> Protein & Water:</strong> Aim for <strong>${calc.targetProtein}g protein</strong> and <strong>${calc.targetWater} Liters of water</strong> daily.`;
    }
}

/* ==========================================
   DIET PLANNER CONTROLLER
   ========================================== */
function setupDietPlanner() {
    const goalTabBtns = document.querySelectorAll(".diet-goal-btn");
    const foodTableBody = document.getElementById("indianFoodTableBody");
    const dietMealCards = document.getElementById("dietMealCardsContainer");

    // Populate Indian Food Table
    if (foodTableBody) {
        foodTableBody.innerHTML = "";
        indianFoodDatabase.forEach(food => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <span class="food-type-badge ${food.type}">${food.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}</span>
                    <strong>${food.name}</strong>
                </td>
                <td>${food.portion}</td>
                <td><span class="highlight-cal">${food.calories} kcal</span></td>
                <td><span class="highlight-protein">${food.protein} g</span></td>
                <td><span class="category-tag">${food.category}</span></td>
            `;
            foodTableBody.appendChild(tr);
        });
    }

    // Diet Goal Tab Filter
    goalTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            goalTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const goalKey = btn.getAttribute("data-goal");
            renderDietPlan(goalKey);
        });
    });

    // Search filter for Indian Foods
    const searchInput = document.getElementById("foodSearchInput");
    if (searchInput && foodTableBody) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const rows = foodTableBody.querySelectorAll("tr");
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? "" : "none";
            });
        });
    }

    // Default load active goal plan
    renderDietPlan(TrackerState.profile.goal || "weight_loss");
}

function renderDietPlan(goalKey) {
    const container = document.getElementById("dietMealCardsContainer");
    const titleEl = document.getElementById("dietPlanTitle");
    const descEl = document.getElementById("dietPlanDesc");
    if (!container) return;

    const plan = dietPlans[goalKey] || dietPlans.weight_loss;
    if (titleEl) titleEl.textContent = plan.title;
    if (descEl) descEl.textContent = plan.description;

    container.innerHTML = "";
    plan.meals.forEach(meal => {
        const card = document.createElement("div");
        card.className = "meal-card";
        card.innerHTML = `
            <div class="meal-time"><i class="far fa-clock"></i> ${meal.time}</div>
            <div class="meal-item">${meal.item}</div>
            <div class="meal-macros">
                <span><i class="fas fa-fire"></i> ~${meal.approxCal} kcal</span>
                <span><i class="fas fa-drumstick-bite"></i> ~${meal.approxProtein}g Protein</span>
            </div>
        `;
        container.appendChild(card);
    });
}

/* ==========================================
   WORKOUT SECTION CONTROLLER
   ========================================== */
function setupWorkoutSection() {
    const workoutTabBtns = document.querySelectorAll(".workout-tab-btn");
    workoutTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            workoutTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const planKey = btn.getAttribute("data-plan");
            renderWorkoutPlan(planKey);
        });
    });

    renderWorkoutPlan("weight_loss");
}

function renderWorkoutPlan(planKey) {
    const container = document.getElementById("workoutListContainer");
    const titleEl = document.getElementById("workoutPlanTitle");
    const tagEl = document.getElementById("workoutPlanTag");
    const freqEl = document.getElementById("workoutPlanFreq");
    if (!container) return;

    const plan = workoutPlans[planKey] || workoutPlans.weight_loss;
    if (titleEl) titleEl.textContent = plan.title;
    if (tagEl) tagEl.textContent = plan.tag;
    if (freqEl) freqEl.textContent = `Schedule: ${plan.frequency}`;

    container.innerHTML = "";
    plan.exercises.forEach((ex, idx) => {
        const item = document.createElement("div");
        item.className = "exercise-card";
        item.innerHTML = `
            <div class="ex-number">#${idx + 1}</div>
            <div class="ex-details">
                <h4 class="ex-name">${ex.name}</h4>
                <p class="ex-notes"><i class="fas fa-info-circle"></i> ${ex.notes}</p>
            </div>
            <div class="ex-stats">
                <div class="stat-pill"><small>SETS</small><strong>${ex.sets}</strong></div>
                <div class="stat-pill"><small>REPS / TIME</small><strong>${ex.reps}</strong></div>
                <div class="stat-pill"><small>REST</small><strong>${ex.rest}</strong></div>
            </div>
        `;
        container.appendChild(item);
    });
}

/* ==========================================
   PROGRESS TRACKER LOG FORM
   ========================================== */
function setupTrackerForm() {
    const form = document.getElementById("dailyTrackerForm");
    if (!form) return;

    const log = TrackerState.todayLog;
    document.getElementById("logWeight").value = log.weight;
    document.getElementById("logCalories").value = log.calories;
    document.getElementById("logProtein").value = log.protein;
    document.getElementById("logWater").value = log.water;
    document.getElementById("logSteps").value = log.steps;
    document.getElementById("logWorkout").value = log.workoutMins;
    document.getElementById("logSleep").value = log.sleepHours;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedLog = {
            weight: parseFloat(document.getElementById("logWeight").value) || 0,
            calories: parseInt(document.getElementById("logCalories").value) || 0,
            protein: parseInt(document.getElementById("logProtein").value) || 0,
            water: parseFloat(document.getElementById("logWater").value) || 0,
            steps: parseInt(document.getElementById("logSteps").value) || 0,
            workoutMins: parseInt(document.getElementById("logWorkout").value) || 0,
            sleepHours: parseFloat(document.getElementById("logSleep").value) || 0
        };

        TrackerState.saveDailyLog(updatedLog);
        updateDashboardUI();
        renderCharts();

        alert("Today's progress logged successfully!");
    });
}

/* ==========================================
   DAILY HEALTH DASHBOARD UPDATER
   ========================================== */
function updateDashboardUI() {
    const calc = TrackerState.profile.calculated;
    const log = TrackerState.todayLog;
    if (!calc) return;

    // Dash Metric Cards
    document.getElementById("dashBmi").textContent = calc.bmi;
    document.getElementById("dashBmiCat").textContent = calc.bmiCategory;
    document.getElementById("dashBmr").textContent = `${calc.bmr} kcal`;
    
    document.getElementById("dashCalories").textContent = `${log.calories} / ${calc.targetCalories}`;
    document.getElementById("dashProtein").textContent = `${log.protein}g / ${calc.targetProtein}g`;
    document.getElementById("dashWater").textContent = `${log.water}L / ${calc.targetWater}L`;
    
    const goalTitleMap = {
        weight_loss: "Weight Loss",
        weight_maintenance: "Maintenance",
        weight_gain: "Muscle Gain",
        general: "General Health"
    };
    document.getElementById("dashGoal").textContent = goalTitleMap[TrackerState.profile.goal] || "Fitness";

    // Progress Bars
    const calPct = Math.min(100, Math.round((log.calories / calc.targetCalories) * 100));
    const protPct = Math.min(100, Math.round((log.protein / calc.targetProtein) * 100));
    const waterPct = Math.min(100, Math.round((log.water / calc.targetWater) * 100));

    document.getElementById("dashCalBar").style.width = `${calPct}%`;
    document.getElementById("dashProtBar").style.width = `${protPct}%`;
    document.getElementById("dashWaterBar").style.width = `${waterPct}%`;

    // Dynamic Health Score & Message
    const score = TrackerState.calculateDailyScore();
    const scoreEl = document.getElementById("healthScoreValue");
    const scoreMsgEl = document.getElementById("healthScoreMsg");
    if (scoreEl) scoreEl.textContent = `${score}/100`;

    if (scoreMsgEl) {
        if (score >= 85) {
            scoreMsgEl.innerHTML = `<span class="badge-success">🔥 Excellent!</span> You are hitting your daily target precision goals smoothly!`;
        } else if (score >= 70) {
            scoreMsgEl.innerHTML = `<span class="badge-warning">⚡ Good Job!</span> Almost there, try adding more water or steps to max your score.`;
        } else {
            scoreMsgEl.innerHTML = `<span class="badge-danger">💪 Keep Going!</span> Log your meals and finish your workout to boost your health score.`;
        }
    }
}
