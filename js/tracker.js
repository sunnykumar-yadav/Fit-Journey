/**
 * FitJourney - Tracker, State Management, Score Calculation & Charts
 */

const TrackerState = {
    // Default profile
    profile: {
        name: "User",
        age: 25,
        gender: "male",
        height: 175,
        weight: 70,
        activity: "moderate",
        goal: "weight_loss",
        calculated: null
    },

    // Daily Logs
    todayLog: {
        weight: 70,
        calories: 1800,
        protein: 110,
        water: 2.5,
        steps: 7500,
        workoutMins: 45,
        sleepHours: 7.5
    },

    // 7-day history mock/stored
    history: [
        { day: "Mon", weight: 70.8, steps: 6500, calories: 1950, water: 2.2 },
        { day: "Tue", weight: 70.6, steps: 8200, calories: 1850, water: 2.8 },
        { day: "Wed", weight: 70.5, steps: 9100, calories: 1790, water: 3.0 },
        { day: "Thu", weight: 70.3, steps: 7800, calories: 1820, water: 2.6 },
        { day: "Fri", weight: 70.2, steps: 10400, calories: 1750, water: 3.2 },
        { day: "Sat", weight: 70.1, steps: 8900, calories: 1900, water: 2.7 },
        { day: "Sun (Today)", weight: 70.0, steps: 7500, calories: 1800, water: 2.5 }
    ],

    init() {
        const savedProfile = localStorage.getItem("fitjourney_profile") || localStorage.getItem("fitmetric_profile");
        const savedLog = localStorage.getItem("fitjourney_today_log") || localStorage.getItem("fitmetric_today_log");
        if (savedProfile) {
            try { this.profile = JSON.parse(savedProfile); } catch (e) {}
        }
        if (savedLog) {
            try { this.todayLog = JSON.parse(savedLog); } catch (e) {}
        }
        this.recalculateProfile();
    },

    saveProfile(profileData) {
        this.profile = { ...this.profile, ...profileData };
        this.recalculateProfile();
        localStorage.setItem("fitjourney_profile", JSON.stringify(this.profile));
    },

    saveDailyLog(logData) {
        this.todayLog = { ...this.todayLog, ...logData };
        // Update history latest day
        this.history[this.history.length - 1] = {
            day: "Today",
            weight: parseFloat(this.todayLog.weight) || 70,
            steps: parseInt(this.todayLog.steps) || 0,
            calories: parseInt(this.todayLog.calories) || 0,
            water: parseFloat(this.todayLog.water) || 0
        };
        localStorage.setItem("fitjourney_today_log", JSON.stringify(this.todayLog));
    },

    recalculateProfile() {
        const bmiObj = FitCalculator.calculateBMI(this.profile.weight, this.profile.height);
        const bmr = FitCalculator.calculateBMR(this.profile.weight, this.profile.height, this.profile.age, this.profile.gender);
        const tdee = FitCalculator.calculateTDEE(bmr, this.profile.activity);
        const targetCal = FitCalculator.calculateTargetCalories(tdee, this.profile.goal);
        const targetProtein = FitCalculator.calculateProteinRequirement(this.profile.weight, this.profile.goal);
        const targetWater = FitCalculator.calculateWaterRequirement(this.profile.weight, this.profile.activity);

        this.profile.calculated = {
            bmi: bmiObj ? bmiObj.value : 22.5,
            bmiCategory: bmiObj ? bmiObj.category : "Normal",
            bmiColor: bmiObj ? bmiObj.color : "#10b981",
            bmr: bmr || 1650,
            tdee: tdee || 2200,
            targetCalories: targetCal || 1900,
            targetProtein: targetProtein || 120,
            targetWater: targetWater || 2.8
        };
    },

    /**
     * Compute Dynamic Daily Health Score out of 100
     */
    calculateDailyScore() {
        if (!this.profile.calculated) this.recalculateProfile();
        const targets = this.profile.calculated;
        const log = this.todayLog;

        let score = 0;

        // 1. Calorie Accuracy (Max 25 pts)
        const calRatio = log.calories / targets.targetCalories;
        if (calRatio >= 0.9 && calRatio <= 1.1) score += 25;
        else if (calRatio >= 0.75 && calRatio <= 1.25) score += 18;
        else score += 10;

        // 2. Protein Target (Max 20 pts)
        const protRatio = log.protein / targets.targetProtein;
        if (protRatio >= 0.9) score += 20;
        else if (protRatio >= 0.7) score += 14;
        else score += 8;

        // 3. Hydration Water Target (Max 15 pts)
        const waterRatio = log.water / targets.targetWater;
        if (waterRatio >= 0.9) score += 15;
        else if (waterRatio >= 0.6) score += 10;
        else score += 4;

        // 4. Physical Movement / Steps (Max 15 pts)
        if (log.steps >= 10000) score += 15;
        else if (log.steps >= 7000) score += 12;
        else if (log.steps >= 4000) score += 8;
        else score += 4;

        // 5. Workout Session (Max 10 pts)
        if (log.workoutMins >= 45) score += 10;
        else if (log.workoutMins >= 20) score += 7;
        else score += 2;

        // 6. Rest & Recovery / Sleep (Max 15 pts)
        if (log.sleepHours >= 7 && log.sleepHours <= 9) score += 15;
        else if (log.sleepHours >= 6) score += 10;
        else score += 5;

        return Math.min(100, Math.max(0, Math.round(score)));
    }
};

// Chart instances storage
let caloriesChartInstance = null;
let weeklyChartInstance = null;

function renderCharts() {
    const calc = TrackerState.profile.calculated;
    const log = TrackerState.todayLog;

    // Destroy existing if re-rendering
    if (caloriesChartInstance) caloriesChartInstance.destroy();
    if (weeklyChartInstance) weeklyChartInstance.destroy();

    // Chart 1: Macro / Calorie Breakdown Canvas
    const ctxCal = document.getElementById("macroChart");
    if (ctxCal) {
        caloriesChartInstance = new Chart(ctxCal, {
            type: 'doughnut',
            data: {
                labels: ['Calories Consumed', 'Remaining Deficit/Buffer'],
                datasets: [{
                    data: [log.calories, Math.max(0, calc.targetCalories - log.calories)],
                    backgroundColor: ['#10b981', '#1f293d'],
                    borderColor: ['#10b981', '#334155'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } } },
                    tooltip: { enabled: true }
                },
                cutout: '75%'
            }
        });
    }

    // Chart 2: 7-Day Weight & Activity Trends
    const ctxWeekly = document.getElementById("weeklyChart");
    if (ctxWeekly) {
        const labels = TrackerState.history.map(h => h.day);
        const weights = TrackerState.history.map(h => h.weight);
        const steps = TrackerState.history.map(h => h.steps);

        weeklyChartInstance = new Chart(ctxWeekly, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Weight (kg)',
                        data: weights,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.3,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Steps Walked',
                        data: steps,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: false,
                        tension: 0.3,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: { color: '#10b981' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        title: { display: true, text: 'Weight (kg)', color: '#10b981' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: { color: '#3b82f6' },
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Steps', color: '#3b82f6' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#94a3b8' } }
                }
            }
        });
    }
}
