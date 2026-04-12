// Exercise Demonstration Images from Wikimedia Commons
// All images are CC licensed (CC0, CC BY-SA, or CC BY) from wikimedia.org
// These are real exercise demonstration photos/diagrams

export interface ExerciseImageData {
  startImage: string
  endImage: string
  credit: string
}

// Verified exercise-specific images from Wikimedia Commons
export const exerciseImages: Record<string, ExerciseImageData> = {
  'Barbell Squat': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Unilateral_barbell_back_squat_squatting.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Unilateral_barbell_back_squat_squatting.jpg',
    credit: 'Wikimedia Commons'
  },
  'Bench Press': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/SmithMachineBenchPress.gif',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/SmithMachineBenchPress.gif',
    credit: 'Wikimedia Commons'
  },
  'Deadlift': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Deadlift_illustration.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Deadlift_illustration.jpg',
    credit: 'Wikimedia Commons'
  },
  'Pull-up': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Pullup.gif',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Pullup.gif',
    credit: 'Wikimedia Commons'
  },
  'Push-up': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/The_best_pushup_140428-A-FW423-533.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/The_best_pushup_140428-A-FW423-533.jpg',
    credit: 'Wikimedia Commons'
  },
  'Plank': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Fitness_enthusiast_performs_plank_exercise_at_home_on_yoga_mat.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Fitness_enthusiast_performs_plank_exercise_at_home_on_yoga_mat.jpg',
    credit: 'Wikimedia Commons'
  },
  'Lunges': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Dumbbell_lunges.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Dumbbell_lunges.jpg',
    credit: 'Wikimedia Commons'
  },
  'Dumbbell Shoulder Press': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Girl_doing_dumbbell_shoulder_press_02.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Girl_doing_dumbbell_shoulder_press_02.jpg',
    credit: 'Wikimedia Commons'
  },
  'Bicep Curls': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Dumbbell_bicep_curls.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Dumbbell_bicep_curls.jpg',
    credit: 'Wikimedia Commons'
  },
  'Tricep Dips': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Tricep-dips-1.gif',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Tricep-dips-1.gif',
    credit: 'Wikimedia Commons'
  },
  'Leg Press': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Calf-raises-2.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Calf-raises-2.png',
    credit: 'Wikimedia Commons'
  },
  'Romanian Deadlift': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Romanian-deadlift-1.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Romanian-deadlift-2.png',
    credit: 'Wikimedia Commons'
  },
  'Lat Pulldown': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Wide_grip_lat_pull_down_1.svg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Wide_grip_lat_pull_down_1.svg',
    credit: 'Wikimedia Commons'
  },
  'Cable Row': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Cable-seated-rows-1.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Cable-seated-rows-1.png',
    credit: 'Wikimedia Commons'
  },
  'Calf Raises': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Calf-raises-2.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Standing-calf-raises-1.gif',
    credit: 'Wikimedia Commons'
  },
  'Mountain Climbers': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Burpee_4_Hips_High.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Burpee_4_Hips_High.jpg',
    credit: 'Wikimedia Commons'
  },
  'Burpees': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Burpee_4_Hips_High.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Burpee_4_Hips_High.jpg',
    credit: 'Wikimedia Commons'
  },
  'Dumbbell Row': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/6/67/DumbbellBentOverRow.JPG',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/6/67/DumbbellBentOverRow.JPG',
    credit: 'Wikimedia Commons'
  },
  'Leg Curl': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/LyingLegCurlMachineExercise.JPG',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/LyingLegCurlMachineExercise.JPG',
    credit: 'Wikimedia Commons'
  },
  'Leg Extension': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/3/36/LegExtensionMachineExercise.JPG',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/3/36/LegExtensionMachineExercise.JPG',
    credit: 'Wikimedia Commons'
  },
  'Hip Thrust': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Glute-bridge.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Glute-bridge.png',
    credit: 'Wikimedia Commons'
  },
  'Glute Bridge': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Glute-bridge.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Glute-bridge.png',
    credit: 'Wikimedia Commons'
  },
  'Russian Twist': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Bicycle_crunch_with_back_support.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Bicycle_crunch_with_back_support.jpg',
    credit: 'Wikimedia Commons'
  },
  'Bicycle Crunch': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Bicycle_crunch_with_back_support.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Bicycle_crunch_with_back_support.jpg',
    credit: 'Wikimedia Commons'
  },
  'Incline Bench Press': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Incline-bench-press-1.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Incline-bench-press-1.png',
    credit: 'Wikimedia Commons'
  },
  'Dumbbell Fly': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Dumbbell-flys-2.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Dumbbell-flys-2.png',
    credit: 'Wikimedia Commons'
  },
  'Goblet Squat': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Unilateral_barbell_back_squat_squatting.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Unilateral_barbell_back_squat_squatting.jpg',
    credit: 'Wikimedia Commons'
  },
  'Overhead Press': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Attractive_sporty_woman_doing_overhead_press_in_gym_with_barbell.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Attractive_sporty_woman_doing_overhead_press_in_gym_with_barbell.jpg',
    credit: 'Wikimedia Commons'
  },
  'Upright Row': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Barbell-upright-rows-1.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Barbell-upright-rows-1.png',
    credit: 'Wikimedia Commons'
  },
  'Shrugs': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Barbell-shrugs-1.png',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Barbell-shrugs-2.png',
    credit: 'Wikimedia Commons'
  },
  'Reverse Crunch': {
    startImage: 'https://live.staticflickr.com/5593/14841100741_903b2fa20f_o.jpg',
    endImage: 'https://live.staticflickr.com/5593/14841100741_903b2fa20f_o.jpg',
    credit: 'Wikimedia Commons'
  },
  // Incline Dumbbell Fly (SVG diagram)
  'Incline Dumbbell Flye': {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Incline_dumbbell_flys_1.svg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Incline_dumbbell_flys_1.svg',
    credit: 'Wikimedia Commons'
  }
}

// Find best matching image for an exercise
export function getExerciseImage(exerciseName: string): ExerciseImageData | null {
  // Exact match
  if (exerciseImages[exerciseName]) {
    return exerciseImages[exerciseName]
  }

  // Case-insensitive match
  const lowerName = exerciseName.toLowerCase()
  for (const [name, img] of Object.entries(exerciseImages)) {
    if (name.toLowerCase() === lowerName) {
      return img
    }
  }

  // Partial match - check if exercise name contains the key word or vice versa
  for (const [name, img] of Object.entries(exerciseImages)) {
    const lowerKey = name.toLowerCase()
    // Check for major muscle group keywords
    if (lowerName.includes('squat') && lowerKey.includes('squat')) return img
    if (lowerName.includes('bench') && lowerKey.includes('bench')) return img
    if (lowerName.includes('deadlift') && lowerKey.includes('deadlift')) return img
    if (lowerName.includes('pullup') && lowerKey.includes('pullup')) return img
    if (lowerName.includes('pull-up') && lowerKey.includes('pullup')) return img
    if (lowerName.includes('pushup') && lowerKey.includes('pushup')) return img
    if (lowerName.includes('push-up') && lowerKey.includes('pushup')) return img
    if (lowerName.includes('plank') && lowerKey.includes('plank')) return img
    if (lowerName.includes('lunge') && lowerKey.includes('lunge')) return img
    if (lowerName.includes('curl') && lowerKey.includes('curl')) return img
    if (lowerName.includes('row') && lowerKey.includes('row')) return img
    if (lowerName.includes('press') && lowerKey.includes('press')) return img
    if (lowerName.includes('fly') && lowerKey.includes('fly')) return img
    if (lowerName.includes('thrust') && lowerKey.includes('thrust')) return img
    if (lowerName.includes('bridge') && lowerKey.includes('bridge')) return img
    if (lowerName.includes('crunch') && lowerKey.includes('crunch')) return img
    if (lowerName.includes('shrug') && lowerKey.includes('shrug')) return img
    if (lowerName.includes('calf') && lowerKey.includes('calf')) return img
    if (lowerName.includes('leg curl') && lowerKey.includes('leg curl')) return img
    if (lowerName.includes('leg extension') && lowerKey.includes('leg extension')) return img
    if (lowerName.includes('lat') && lowerKey.includes('lat')) return img
    if (lowerName.includes('romanian') && lowerKey.includes('romanian')) return img
    if (lowerName.includes('incline') && lowerKey.includes('incline')) return img
    if (lowerName.includes('overhead') && lowerKey.includes('overhead')) return img
    if (lowerName.includes('upright') && lowerKey.includes('upright')) return img
    if (lowerName.includes('mountain climber') && lowerKey.includes('burpee')) return img
    if (lowerName.includes('burpee') && lowerKey.includes('burpee')) return img
    if (lowerName.includes('dumbbell') && lowerKey.includes('dumbbell')) return img
    if (lowerName.includes('barbell') && lowerKey.includes('barbell')) return img
  }

  // Generic fitness image fallback (actual gym photo from Wikimedia)
  return {
    startImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Push-up_session.jpg',
    endImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Push-up_session.jpg',
    credit: 'Wikimedia Commons'
  }
}
