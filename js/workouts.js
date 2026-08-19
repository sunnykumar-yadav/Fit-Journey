/**
 * FitJourney - Workout Database Module
 */

const workoutPlans = {
    weight_loss: {
        title: "Fat Loss & HIIT Conditioning Plan",
        tag: "High Calorie Burn",
        frequency: "4-5 Days / Week",
        exercises: [
            { name: "Jumping Jacks / Skip Rope", sets: "4", reps: "60 seconds", rest: "30s", notes: "Keep core tight and maintain steady tempo." },
            { name: "Bodyweight Squats", sets: "4", reps: "15 - 20 reps", rest: "45s", notes: "Focus on depth and pushing through heels." },
            { name: "Mountain Climbers", sets: "4", reps: "45 seconds", rest: "30s", notes: "Maintain plank position, bring knees to chest rapidly." },
            { name: "Push-ups (Standard or Knee)", sets: "3", reps: "10 - 15 reps", rest: "60s", notes: "Keep elbows at 45 degree angle." },
            { name: "Burpees", sets: "3", reps: "10 - 12 reps", rest: "60s", notes: "Full body explosive movement." },
            { name: "Plank Hold", sets: "3", reps: "45 - 60 seconds", rest: "45s", notes: "Engage glutes and brace abdominal wall." }
        ]
    },
    muscle_building: {
        title: "Hypertrophy & Strength Builder",
        tag: "Muscle Gain Focus",
        frequency: "4 Days / Week (Upper / Lower Split)",
        exercises: [
            { name: "Dumbbell / Barbell Squats", sets: "4", reps: "8 - 12 reps", rest: "90s", notes: "Progressive overload; increase weight when 12 reps feel easy." },
            { name: "Bench Press / Dumbbell Press", sets: "4", reps: "8 - 10 reps", rest: "90s", notes: "Control the eccentric phase (downward motion)." },
            { name: "Bent-Over Rows / Inverted Rows", sets: "4", reps: "10 - 12 reps", rest: "75s", notes: "Squeeze shoulder blades together at top." },
            { name: "Overhead Shoulder Press", sets: "3", reps: "8 - 12 reps", rest: "75s", notes: "Keep torso upright without excessive arching." },
            { name: "Romanian Deadlifts (RDL)", sets: "3", reps: "10 - 12 reps", rest: "90s", notes: "Hinge at hips to target hamstrings and glutes." },
            { name: "Bicep Curls superset with Tricep Dips", sets: "3", reps: "12 - 15 reps", rest: "60s", notes: "Strict form, avoid swinging momentum." }
        ]
    },
    general: {
        title: "General Fitness & Overall Well-being",
        tag: "Stamina & Mobility",
        frequency: "3-4 Days / Week",
        exercises: [
            { name: "Brisk Walking / Jogging", sets: "1", reps: "20 - 30 mins", rest: "N/A", notes: "Maintain moderate heart rate." },
            { name: "Bodyweight Lunge Walk", sets: "3", reps: "12 steps per leg", rest: "60s", notes: "Keep front knee aligned over ankle." },
            { name: "Lat Pulldown / Resistance Band Pulls", sets: "3", reps: "12 - 15 reps", rest: "60s", notes: "Focus on posture and lat contraction." },
            { name: "Glute Bridges", sets: "3", reps: "15 reps", rest: "45s", notes: "Squeeze glutes at top for 2 seconds." },
            { name: "Bird-Dog Core Stability", sets: "3", reps: "10 per side", rest: "45s", notes: "Extend opposite arm and leg slowly." },
            { name: "Full Body Dynamic Stretching", sets: "1", reps: "10 mins", rest: "N/A", notes: "Shoulder circles, hamstrings stretch, hip openers." }
        ]
    },
    home_workout: {
        title: "Zero-Equipment Home Workout",
        tag: "No Gym Required",
        frequency: "3-5 Days / Week",
        exercises: [
            { name: "Air Squats", sets: "4", reps: "20 reps", rest: "45s", notes: "Keep chest up and push knees slightly outwards." },
            { name: "Decline / Incline Push-ups", sets: "4", reps: "12 - 15 reps", rest: "60s", notes: "Use couch or chair to elevate feet/hands." },
            { name: "Towel / Backpack Bicep Rows", sets: "3", reps: "15 reps", rest: "60s", notes: "Use a backpack loaded with books for resistance." },
            { name: "Chair Dips", sets: "3", reps: "12 - 15 reps", rest: "45s", notes: "Keep hips close to the chair edge." },
            { name: "Bicycle Crunches", sets: "3", reps: "20 reps (10/side)", rest: "45s", notes: "Twist shoulder to opposite knee controlled." },
            { name: "Wall Sit", sets: "3", reps: "45 seconds", rest: "45s", notes: "Thighs parallel to ground, back flat on wall." }
        ]
    }
};
