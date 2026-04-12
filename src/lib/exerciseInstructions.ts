// Comprehensive Exercise Instructions Database
// Based on ACE (American Council on Exercise) and NSCA guidelines

export interface ExerciseInstructionSet {
  name: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  muscles: string[]
  equipment: string[]
  startPosition: string
  endPosition: string
  steps: string[]
  formCues: string[]
  safetyTips: string[]
  commonMistakes: string[]
  breathing: string
  startImage: string
  endImage: string
}

export const exerciseDatabase: Record<string, ExerciseInstructionSet> = {
  'Barbell Squat': {
    name: 'Barbell Squat',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['Barbell', 'Squat Rack'],
    startPosition: 'Stand with feet shoulder-width apart, bar resting on upper back (traps), chest up, core engaged.',
    endPosition: 'Thighs parallel to floor (or below), knees tracking over toes, chest up, glutes contracted.',
    steps: [
      'Set barbell on rack at chest height, step under bar and rest it on upper traps',
      'Grip barbell with hands wider than shoulder-width, retract shoulders',
      'Step back from rack, feet shoulder-width, toes slightly pointed out',
      'Engage core, push hips back, bend knees to lower body',
      'Descend until thighs are parallel to floor or slightly below',
      'Drive through heels, extend hips and knees to return to start',
      'Keep chest up and back straight throughout the movement'
    ],
    formCues: [
      'Keep knees tracking over toes (don\'t let them cave inward)',
      'Maintain neutral spine - don\'t round lower back',
      'Keep weight on heels, not toes',
      'Chest up, shoulders back',
      'Core braced throughout'
    ],
    safetyTips: [
      'Start with light weight to master form',
      'Use safety bars in squat rack if available',
      'Stop if you feel knee pain (dull ache is OK, sharp pain is not)',
      'Don\'t bounce at the bottom of the squat'
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse)',
      'Rounding lower back (butt wink)',
      'Rising heels off the floor',
      'Not descending deep enough',
      'Leaning too far forward'
    ],
    breathing: 'Exhale as you stand up, inhale as you descend',
    startImage: '',
    endImage: ''
  },

  'Bench Press': {
    name: 'Bench Press',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    equipment: ['Barbell', 'Bench'],
    startPosition: 'Lie on bench, feet flat on floor, grip barbell with hands slightly wider than shoulder-width, bar over chest.',
    endPosition: 'Barbell at chest level, elbows at 90 degrees, shoulders retracted on the bench.',
    steps: [
      'Set up bench so you can see wall in front of you when lying down',
      'Lie on bench, squeeze shoulder blades together, create arch in lower back',
      'Place feet firmly on floor, grip barbell with thumbs around the bar',
      'Unrack bar, hold directly over chest with locked elbows',
      'Lower bar to mid-chest, elbows at 45-75 degree angle to body',
      'Touch chest lightly, don\'t bounce',
      'Press bar back up to starting position, follow original path'
    ],
    formCues: [
      'Keep shoulder blades squeezed together throughout',
      'Maintain natural arch in lower back (don\'t flatten)',
      'Keep elbows at 45-75 degree angle (not 90 degrees straight out)',
      'Drive feet into floor for stability',
      'Follow same path up and down'
    ],
    safetyTips: [
      'Use spotter or safety bars for heavy sets',
      'Keep bar path straight up and down',
      'Don\'t slam the bar on chest',
      'If training alone, use power rack with safety pins'
    ],
    commonMistakes: [
      'Flaring elbows out 90 degrees (causes shoulder strain)',
      'Bouncing bar off chest',
      'Lifting hips off bench to press',
      'Undulating the bar path',
      'Not using full range of motion'
    ],
    breathing: 'Inhale on descent, exhale on press',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Barbell-Bench-Press.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Barbell-Bench-Press.gif'
  },

  'Deadlift': {
    name: 'Deadlift',
    category: 'strength',
    difficulty: 'advanced',
    muscles: ['Back', 'Glutes', 'Hamstrings', 'Core', 'Traps'],
    equipment: ['Barbell', 'Weight Plates'],
    startPosition: 'Stand with feet hip-width, barbell over mid-foot, grip just outside knees, back flat, shoulders over bar.',
    endPosition: 'Standing tall, hips extended, shoulders back, chest up.',
    steps: [
      'Stand with feet hip-width apart, barbell over mid-foot',
      'Hinge at hips, bend knees slightly, grip bar just outside legs',
      'Drop hips, chest up, shoulders over or slightly ahead of bar',
      'Engage lats, brace core, take slack out of bar',
      'Drive through heels, extend hips and knees simultaneously',
      'Stand tall, push hips forward, squeeze glutes at top',
      'Lower bar by hinging hips back, bending knees as needed'
    ],
    formCues: [
      'Keep bar close to body (almost touching shins)',
      'Maintain neutral spine throughout',
      'Engage lats by pulling bar into shins',
      'Push floor away (don\'t pull bar up)',
      'Hips and shoulders rise together'
    ],
    safetyTips: [
      'Keep spine neutral - never round your back',
      'Grip the bar before initiating the pull',
      'Don\'t let bar swing out - it should travel straight up',
      'Use mixed grip (one palm up, one down) for heavy weights'
    ],
    commonMistakes: [
      'Rounding lower back (dangerous!)',
      'Starting with hips too high',
      'Bar drifting away from body',
      'Hips shooting up first',
      'Not engaging lats before pull'
    ],
    breathing: 'Inhale before lift, brace core, exhale at top',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Barbell-Deadlift.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Barbell-Deadlift.gif'
  },

  'Pull-up': {
    name: 'Pull-up',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Lats', 'Biceps', 'Rear Delts', 'Core'],
    equipment: ['Pull-up Bar'],
    startPosition: 'Hang from bar with overhand grip, arms fully extended, shoulders engaged (slightly depressed).',
    endPosition: 'Chin cleared above bar, chest up, shoulders down.',
    steps: [
      'Grab pull-up bar with overhand grip, hands shoulder-width or slightly wider',
      'Start from dead hang with arms fully extended',
      'Engage shoulder blades, pull elbows down and back',
      'Pull chin over bar by driving elbows toward hips',
      'Squeeze lats at top, hold briefly',
      'Lower with control to full arm extension',
      'Don\'t shrug shoulders at the top'
    ],
    formCues: [
      'Initiate pull by engaging lats (imagine squeezing shoulder blades together)',
      'Keep core tight - no swinging or kipping',
      'Drive elbows down to sides',
      'Chin should break the horizontal plane of the bar',
      'Control the descent - don\'t drop'
    ],
    safetyTips: [
      'Warm up shoulders thoroughly before',
      'Avoid swinging or momentum if training for strength',
      'Full range of motion is crucial for shoulder health',
      'If you can\'t do one rep, use assisted machine or bands'
    ],
    commonMistakes: [
      'Using excessive swing/kip (unless doing CrossFit style)',
      'Not going through full range of motion',
      'Shrugging shoulders at the top',
      'Letting hips sag (lack of core engagement)',
      'Pulling with arms instead of lats'
    ],
    breathing: 'Exhale as you pull up, inhale as you lower',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Pull-Up.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Pull-Up.gif'
  },

  'Push-up': {
    name: 'Push-up',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    equipment: ['None (Bodyweight)'],
    startPosition: 'Plank position, hands slightly wider than shoulders, arms fully extended, body in straight line.',
    endPosition: 'Chest near floor, elbows at 45-degree angle, body still in straight line.',
    steps: [
      'Start in high plank with hands under shoulders',
      'Engage core, squeeze glutes, maintain neutral spine',
      'Lower body by bending elbows, keeping them at 45 degrees',
      'Descend until chest is 1-2 inches from floor',
      'Press through palms to extend arms',
      'Keep body as one rigid unit throughout',
      'Reset and repeat'
    ],
    formCues: [
      'Head in line with spine (don\'t let head droop)',
      'Core tight - no sagging hips',
      'Elbows at 45 degrees (not flared 90)',
      'Fingers point forward or slightly out',
      'Shoulders actively pushed away from ears'
    ],
    safetyTips: [
      'Keep neck neutral to avoid strain',
      'Don\'t let hips sag or pike up',
      'If standard push-up is too hard, do from knees',
      'Warm up wrists before doing push-ups'
    ],
    commonMistakes: [
      'Flaring elbows out 90 degrees',
      'Sagging hips (weak core)',
      'Not going low enough',
      'Leading with head (looking down)',
      'Half reps at the bottom'
    ],
    breathing: 'Inhale on descent, exhale on press',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Push-Up.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Push-Up.gif'
  },

  'Plank': {
    name: 'Plank',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Core', 'Shoulders', 'Glutes'],
    equipment: ['None (Bodyweight)'],
    startPosition: 'Forearms on floor, elbows under shoulders, body in straight line from head to heels.',
    endPosition: 'Same as start position (hold for prescribed time).',
    steps: [
      'Start on forearms and knees',
      'Step feet back, extending legs',
      'Position elbows directly under shoulders',
      'Engage core by pulling belly button to spine',
      'Squeeze glutes, keep hips level',
      'Maintain neutral neck (look at floor)',
      'Hold position while breathing normally'
    ],
    formCues: [
      'Body should form straight line (no sag or pike)',
      'Engage core by imagining pulling belly to spine',
      'Squeeze glutes lightly',
      'Shoulders pushed away from ears',
      'Head neutral, looking at floor'
    ],
    safetyTips: [
      'Stop if you feel lower back pain',
      'Breathe normally - don\'t hold breath',
      'Quality over time - proper form first',
      'If 30 seconds is max, that\'s a good plank'
    ],
    commonMistakes: [
      'Hips sagging (lower back arches down)',
      'Hips piking up (butt in air)',
      'Holding breath',
      'Looking up (neck extension)',
      'Shoulders too far forward or back'
    ],
    breathing: 'Breathe normally throughout hold',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Plank.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Plank.gif'
  },

  'Lunges': {
    name: 'Lunges',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: ['None (Bodyweight) or Dumbbells'],
    startPosition: 'Stand tall, feet hip-width apart, core engaged.',
    endPosition: 'Front thigh parallel to floor, back knee near floor, torso upright.',
    steps: [
      'Stand with feet hip-width apart, hands on hips or holding weights',
      'Take a large step forward with one leg',
      'Lower body straight down, not forward',
      'Front thigh should be parallel to floor',
      'Back knee should hover near floor (don\'t slam it)',
      'Front knee should stay over ankle (don\'t extend past toes)',
      'Push through front heel to return to standing',
      'Alternate legs or complete all reps on one side'
    ],
    formCues: [
      'Keep torso upright (don\'t lean forward)',
      'Front knee tracks over second toe',
      'Step far enough forward (foot placement matters)',
      'Push through heel of front foot',
      'Core engaged throughout'
    ],
    safetyTips: [
      'Step far enough forward to avoid knee pain',
      'If knee hurts, step further forward',
      'Start without weights to master form',
      'Don\'t let front knee extend past toes excessively'
    ],
    commonMistakes: [
      'Front knee caving inward',
      'Torso leaning too far forward',
      'Step too short (knee past toe)',
      'Back knee slamming on floor',
      'Pushing off back foot instead of front'
    ],
    breathing: 'Inhale as you step/lunge down, exhale to stand',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Lunges.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Lunges.gif'
  },

  'Dumbbell Shoulder Press': {
    name: 'Dumbbell Shoulder Press',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Shoulders', 'Triceps', 'Upper Chest'],
    equipment: ['Dumbbells', 'Bench or Standing'],
    startPosition: 'Sit or stand with dumbbells at shoulder height, palms forward, elbows bent at 90 degrees.',
    endPosition: 'Arms extended overhead, dumbbells at ear level, elbows not fully locked.',
    steps: [
      'Hold dumbbells at shoulder height with palms facing forward',
      'Position elbows at 90 degrees, pointing to sides',
      'Engage core (seated) or brace (standing)',
      'Press dumbbells straight up, bringing them together at top',
      'Extend arms fully but don\'t lock elbows',
      'At top, dumbbells should be at ear level, palms still forward',
      'Lower with control to starting position'
    ],
    formCues: [
      'Keep core tight if standing',
      'Don\'t arch lower back excessively (seated)',
      'Press straight up, not in arc',
      'Squeeze shoulder blades at top',
      'Control the descent'
    ],
    safetyTips: [
      'Warm up shoulders first',
      'Use proper grip on dumbbells',
      'Don\'t lock elbows at top (keeps tension)',
      'If doing standing, keep slight knee bend'
    ],
    commonMistakes: [
      'Using momentum to press',
      'Lower back arching excessively',
      'Elbows flaring to 90 degrees',
      'Not going through full range of motion',
      'Pressing in arc instead of straight up'
    ],
    breathing: 'Exhale on press up, inhale on descent',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Dumbbell-Shoulder-Press.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Dumbbell-Shoulder-Press.gif'
  },

  'Bicep Curls': {
    name: 'Bicep Curls',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Biceps', 'Forearms'],
    equipment: ['Dumbbells or Barbell'],
    startPosition: 'Stand with dumbbells at sides, arms fully extended, palms facing forward.',
    endPosition: 'Dumbbells at shoulder height, elbows bent to 90 degrees, palms still facing shoulders.',
    steps: [
      'Stand with feet shoulder-width apart, dumbbells at sides',
      'Palms facing forward (supinated grip)',
      'Keep elbows tight to sides (not moving)',
      'Curl weights up by bending at elbow only',
      'Squeeze biceps at top of movement',
      'Lower with control to full extension',
      'Keep shoulders stationary throughout'
    ],
    formCues: [
      'Elbows stay fixed at sides',
      'Don\'t swing body to lift weight',
      'Squeeze at top for 1 second',
      'Control descent - don\'t drop',
      'Wrists should be neutral (not bent)'
    ],
    safetyTips: [
      'Use full range of motion',
      'Don\'t use momentum - bicep isolation is key',
      'Keep core engaged to prevent swinging',
      'Start with light weight to perfect form'
    ],
    commonMistakes: [
      'Swinging body to lift weight',
      'Moving elbows forward (cheating curl)',
      'Not going through full range of motion',
      'Jerking or using momentum',
      'Wrists bending during curl'
    ],
    breathing: 'Exhale as you curl up, inhale as you lower',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Dumbbell-Curl.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Dumbbell-Curl.gif'
  },

  'Tricep Dips': {
    name: 'Tricep Dips',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Triceps', 'Chest', 'Shoulders'],
    equipment: ['Dip Bars or Bench'],
    startPosition: 'Arms fully extended on bars/bench, body upright, feet on floor.',
    endPosition: 'Upper arms parallel to floor, elbows at 90 degrees.',
    steps: [
      'Grip parallel bars, support body with arms extended',
      'Keep hips close to bars, shoulders over hands',
      'Lower body by bending elbows to 90 degrees',
      'Keep elbows pointing back (not flaring out)',
      'Descend until upper arms are parallel to floor',
      'Press back up to starting position',
      'Lock out arms at top but don\'t hyperextend'
    ],
    formCues: [
      'Keep body upright for tricep focus (lean forward for chest)',
      'Elbows point straight back, not out',
      'Shoulders stay depressed (down, not up)',
      'Control descent - don\'t drop',
      'Full range of motion is essential'
    ],
    safetyTips: [
      'Warm up elbows and shoulders first',
      'If training chest, lean torso forward',
      'If training triceps, keep body upright',
      'Don\'t go below 90 degrees if you have shoulder issues'
    ],
    commonMistakes: [
      'Elbows flaring out to sides',
      'Shrugging shoulders up',
      'Not descending deep enough',
      'Using too much momentum',
      'Going too low (below 90 degrees)'
    ],
    breathing: 'Inhale on descent, exhale on press up',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Tricep-Dips.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Tricep-Dips.gif'
  },

  'Leg Press': {
    name: 'Leg Press',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: ['Leg Press Machine'],
    startPosition: 'Sit in machine, back flat against pad, feet shoulder-width on platform, knees at 90 degrees.',
    endPosition: 'Legs nearly extended (not locked), knees still tracking over toes.',
    steps: [
      'Sit in leg press, position back flat against pad',
      'Place feet on platform shoulder-width apart',
      'Release safety handles',
      'Lower platform by bending knees to 90 degrees',
      'Keep lower back pressed against pad',
      'Press through heels to extend legs',
      'Don\'t lock knees at top - keep slight bend'
    ],
    formCues: [
      'Keep lower back pressed into pad (neutral spine)',
      'Don\'t let lower back round at bottom',
      'Knees track over toes (don\'t cave in)',
      'Push through heels, not balls of feet',
      'Control the descent - don\'t drop'
    ],
    safetyTips: [
      'Always keep back flat against pad',
      'If lower back lifts off pad, stop the rep',
      'Start with light weight',
      'Don\'t lock knees at top'
    ],
    commonMistakes: [
      'Lower back coming off pad at bottom',
      'Knees caving inward',
      'Using partial range of motion',
      'Locking knees at top',
      'Pushing through toes instead of heels'
    ],
    breathing: 'Inhale on descent, exhale on press',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif'
  },

  'Romanian Deadlift': {
    name: 'Romanian Deadlift',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    equipment: ['Barbell or Dumbbells'],
    startPosition: 'Stand with bar at hip height, feet hip-width, slight knee bend, chest up.',
    endPosition: 'Barbell at knee/shin level, torso nearly parallel to floor, hamstrings stretched.',
    steps: [
      'Hold barbell at hip height, stand with feet hip-width',
      'Keep slight bend in knees throughout',
      'Hinge at hips, pushing them back',
      'Lower bar along thighs, keeping it close to legs',
      'Descend until you feel hamstring stretch',
      'Usually bar reaches knee or mid-shin',
      'Drive hips forward to return to standing'
    ],
    formCues: [
      'Hinge at hips, not squat',
      'Keep bar close to legs (hugging shins)',
      'Maintain slight knee bend (don\'t lock)',
      'Chest up, shoulders retracted',
      'Feel stretch in hamstrings at bottom'
    ],
    safetyTips: [
      'Never round lower back',
      'If you feel lower back strain, reduce weight',
      'Start with very light weight (hamstrings are weak link)',
      'Keep shoulders back throughout'
    ],
    commonMistakes: [
      'Bending knees too much (turning into squat)',
      'Rounding lower back',
      'Bar drifting away from legs',
      'Hips shooting back too far',
      'Not hinging from hips'
    ],
    breathing: 'Inhale before descent, exhale on hip extension',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Romanian-Deadlift.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Romanian-Deadlift.gif'
  },

  'Lat Pulldown': {
    name: 'Lat Pulldown',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Lats', 'Biceps', 'Rear Delts'],
    equipment: ['Lat Pulldown Machine'],
    startPosition: 'Sit at machine, thighs secured under pad, arms extended overhead holding bar.',
    endPosition: 'Bar at upper chest, elbows below shoulders, lats contracted.',
    steps: [
      'Adjust thigh pad to secure legs',
      'Grasp wide bar with overhand grip',
      'Lean back slightly (10-15 degrees)',
      'Engage lats, pull elbows down to sides',
      'Pull bar to upper chest (not collarbone)',
      'Squeeze lats at bottom of movement',
      'Extend arms with control to start'
    ],
    formCues: [
      'Pull with lats, not arms (lead with elbows)',
      'Keep chest up, slight lean back',
      'Elbows track down and back (not straight down)',
      'Full stretch at top, full contraction at bottom',
      'Control the weight - don\'t yank'
    ],
    safetyTips: [
      'Don\'t pull behind neck (shoulder injury risk)',
      'Use smooth, controlled movements',
      'Start with light weight to learn pattern',
      'Keep core engaged throughout'
    ],
    commonMistakes: [
      'Pulling behind the neck',
      'Using arms instead of lats',
      'Leaning back too far',
      'Jerking or using momentum',
      'Not going through full range of motion'
    ],
    breathing: 'Exhale as you pull down, inhale as you release',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Lat-Pulldown.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Lat-Pulldown.gif'
  },

  'Cable Row': {
    name: 'Cable Row',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Middle Back', 'Lats', 'Biceps', 'Rear Delts'],
    equipment: ['Cable Machine'],
    startPosition: 'Sit at cable station, feet on platform, knees slightly bent, torso upright holding handle.',
    endPosition: 'Hands at lower chest, elbows past torso, shoulder blades squeezed together.',
    steps: [
      'Sit with feet on platform, knees slightly bent',
      'Grasp handle with arms extended forward',
      'Maintain neutral spine, chest up',
      'Pull handle to lower chest by bending elbows',
      'Drive elbows past torso, squeeze shoulder blades',
      'Hold contraction for 1 second',
      'Extend arms with control to start'
    ],
    formCues: [
      'Keep core braced, don\'t lean back excessively',
      'Lead with elbows, not hands',
      'Pull to lower chest/upper abdomen',
      'Squeeze shoulder blades together at contraction',
      'Keep movement controlled - no jerking'
    ],
    safetyTips: [
      'Avoid arching back to pull weight',
      'Keep lower back neutral throughout',
      'Start with light weight to perfect form',
      'Breathe properly - don\'t hold breath'
    ],
    commonMistakes: [
      'Using momentum (leaning back to pull)',
      'Rounding lower back',
      'Not pulling back far enough',
      'Jerking the weight',
      'Leading with hands instead of elbows'
    ],
    breathing: 'Exhale as you pull, inhale as you extend',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Seated-Cable-Row.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Seated-Cable-Row.gif'
  },

  'Calf Raises': {
    name: 'Calf Raises',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Calves (Gastrocnemius, Soleus)'],
    equipment: ['Machine, Step, or Bodyweight'],
    startPosition: 'Stand on elevated surface, balls of feet on edge, heels off ground, legs straight.',
    endPosition: 'Standing on toes, heels above starting level, calves fully contracted.',
    steps: [
      'Position balls of feet on edge of platform',
      'Lower heels below platform level (full stretch)',
      'Push through balls of feet to raise heels',
      'Rise onto balls of feet as high as possible',
      'Squeeze calves at top for 1 second',
      'Lower with control to full stretch',
      'Repeat without bouncing'
    ],
    formCues: [
      'Keep legs straight for gastrocnemius',
      'Bend knees slightly for soleus focus',
      'Full range of motion is crucial',
      'Pause briefly at top contraction',
      'Don\'t bounce - control the movement'
    ],
    safetyTips: [
      'Hold onto rail for balance if needed',
      'Full stretch at bottom is important',
      'Start with bodyweight if new to exercise',
      'Calf muscles adapt slowly - be patient'
    ],
    commonMistakes: [
      'Bouncing instead of controlled movement',
      'Not going through full range of motion',
      'Locking knees completely (for straight-leg variation)',
      'Using momentum to push up',
      'Not pausing at top'
    ],
    breathing: 'Exhale on rise, inhale on descent',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Standing-Calf-Raise.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Standing-Calf-Raise.gif'
  },

  'Mountain Climbers': {
    name: 'Mountain Climbers',
    category: 'cardio',
    difficulty: 'intermediate',
    muscles: ['Core', 'Shoulders', 'Hip Flexors', 'Quadriceps'],
    equipment: ['None (Bodyweight)'],
    startPosition: 'High plank position, hands under shoulders, body in straight line.',
    endPosition: 'One knee driven toward chest, alternate legs in running motion.',
    steps: [
      'Start in high plank position',
      'Engage core, brace as if preparing for punch',
      'Drive right knee toward chest',
      'Quickly switch, extending right leg back',
      'Drive left knee toward chest',
      'Continue alternating at quick pace',
      'Keep hips level, don\'t let them pike up'
    ],
    formCues: [
      'Keep hips level (don\'t let them pike up)',
      'Drive knees to chest (not out to side)',
      'Keep hands planted, don\'t shuffle feet',
      'Core braced throughout',
      'Maintain steady breathing pace'
    ],
    safetyTips: [
      'This is high-impact - land softly',
      'Keep wrists directly under shoulders',
      'If wrists hurt, try on fists or use handles',
      'Control the movement, don\'t just go fast'
    ],
    commonMistakes: [
      'Hips piking up toward ceiling',
      'Bouncing knees out to sides',
      'Letting shoulders drift forward',
      'Holding breath',
      'Not driving knees high enough'
    ],
    breathing: 'Breathe in rhythm - exhale as you drive knee in, inhale as you extend',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Mountain-Clicker.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Mountain-Clicker.gif'
  },

  'Burpees': {
    name: 'Burpees',
    category: 'cardio',
    difficulty: 'advanced',
    muscles: ['Full Body', 'Core', 'Shoulders', 'Chest', 'Legs'],
    equipment: ['None (Bodyweight)'],
    startPosition: 'Standing upright, feet shoulder-width apart.',
    endPosition: 'Standing upright with hands overhead (after jump), or back at standing start.',
    steps: [
      'Stand with feet shoulder-width apart',
      'Squat down, place hands on floor',
      'Jump feet back to high plank position',
      'Perform push-up (optional for full burpee)',
      'Jump feet back toward hands',
      'Explosively jump up, reaching arms overhead',
      'Land softly, immediately begin next rep'
    ],
    formCues: [
      'Squat thrust should be fast and controlled',
      'Keep core tight during plank',
      'If doing push-up, full range of motion',
      'Jump explosively at the top',
      'Land softly to protect joints'
    ],
    safetyTips: [
      'Warm up thoroughly - this is high intensity',
      'Modify by stepping back instead of jumping',
      'If you have wrist issues, use fists or handles',
      'Don\'t do this if you have lower back problems'
    ],
    commonMistakes: [
      'Sagging hips in plank',
      'Skipping the push-up (if doing full)',
      'Landing heavily',
      'Not going through full range of motion',
      'Holding breath'
    ],
    breathing: 'Exhale on jump up, inhale during descent',
    startImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Burpees.gif',
    endImage: 'https://fitnessprogramer.com/wp-content/uploads/2015/11/Burpees.gif'
  },

  // Additional exercises that weren't in the original database
  'Barbell Row': {
    name: 'Barbell Row',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Back', 'Biceps', 'Rear Delts', 'Core'],
    equipment: ['Barbell'],
    startPosition: 'Hinge forward at hips with slight knee bend, back flat, grip barbell just outside shoulder width.',
    endPosition: 'Barbell at lower chest, shoulders back, back flat, core engaged.',
    steps: [
      'Stand with feet shoulder-width apart',
      'Hinge at hips until torso is ~45 degrees to floor',
      'Grip barbell with hands just outside shoulder width',
      'Pull barbell to lower chest, squeezing shoulder blades',
      'Lower barbell with control to starting position'
    ],
    formCues: [
      'Keep back flat throughout - no rounding',
      'Pull with elbows, not hands',
      'Squeeze shoulder blades at top',
      'Keep core tight for stability'
    ],
    safetyTips: [
      'Start with light weight to master form',
      'Don\'t round your back if lifting heavy',
      'Use a straps if grip gives out first',
      'Keep eyes forward, not down at floor'
    ],
    commonMistakes: [
      'Rounding the lower back',
      'Standing too upright',
      'Using too much arm',
      'Not squeezing shoulder blades'
    ],
    breathing: 'Exhale as you pull the bar up, inhale as you lower it',
    startImage: '',
    endImage: ''
  },

  'Incline Dumbbell Press': {
    name: 'Incline Dumbbell Press',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Upper Chest', 'Shoulders', 'Triceps'],
    equipment: ['Dumbbells', 'Incline Bench'],
    startPosition: 'Lie on incline bench set to 30-45 degrees, dumbbells at shoulder level, palms forward.',
    endPosition: 'Dumbbells above chest with arms extended, elbows slightly bent.',
    steps: [
      'Set bench to 30-45 degree incline',
      'Sit with dumbbells at shoulder level',
      'Press dumbbells up and slightly together',
      'Hold briefly at top with arms extended',
      'Lower with control to shoulder level'
    ],
    formCues: [
      'Keep shoulders back against bench',
      'Don\'t arch lower back excessively',
      'Control the descent - 2 seconds down',
      'Keep elbows at comfortable angle, not 90 degrees'
    ],
    safetyTips: [
      'Use a bench with support posts for safety',
      'Have spotter for heavy sets',
      'Don\'t bounce the dumbbells off chest',
      'Keep feet flat on floor'
    ],
    commonMistakes: [
      'Setting incline too steep (肩膀 does more work)',
      'Flaring elbows out too wide',
      'Bouncing weights',
      'Lower back arching excessively'
    ],
    breathing: 'Exhale as you press up, inhale as you lower',
    startImage: '',
    endImage: ''
  },

  'Dumbbell Fly': {
    name: 'Dumbbell Fly',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Chest', 'Front Delts'],
    equipment: ['Dumbbells', 'Flat Bench'],
    startPosition: 'Lie flat on bench, dumbbells above chest with slight elbow bend, palms facing each other.',
    endPosition: 'Arms open to sides in wide arc, dumbbells at chest level, elbows still slightly bent.',
    steps: [
      'Lie on bench with feet flat',
      'Press dumbbells to starting position above chest',
      'Lower arms in wide arc, keeping elbows slightly bent',
      'Feel stretch in chest at bottom',
      'Squeeze chest to bring dumbbells back to start'
    ],
    formCues: [
      'Keep elbows at fixed slight bend - don\'t lock or overbend',
      'Feel the stretch in outer chest',
      'Squeeze at the top',
      'Control the movement - don\'t drop'
    ],
    safetyTips: [
      'Use moderate weights - this isolates chest',
      'Keep shoulders on bench throughout',
      'Don\'t overstretch below shoulder level',
      'Have spotter for heavy sets'
    ],
    commonMistakes: [
      'Bending elbows too much (becomes press)',
      'Going too low and losing tension',
      'Using too much weight',
      'Not squeezing at top'
    ],
    breathing: 'Inhale as you lower, exhale as you bring back up',
    startImage: '',
    endImage: ''
  },

  'Cable Crossover': {
    name: 'Cable Crossover',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Chest', 'Front Delts'],
    equipment: ['Cable Machine'],
    startPosition: 'Stand between cable towers, handles in each hand, arms extended to sides at shoulder height.',
    endPosition: 'Hands crossed in front of chest at hip level, slight bend in elbows.',
    steps: [
      'Set cable pulleys to shoulder height or slightly above',
      'Stand in center, one foot forward for stability',
      'Grip handles, step slightly forward to create tension',
      'Bring hands together in front of hips',
      'Return slowly to start position'
    ],
    formCues: [
      'Keep slight bend in elbows throughout',
      'Lean forward slightly from hips',
      'Squeeze chest at bottom of movement',
      'Control the arc - don\'t let weights pull you'
    ],
    safetyTips: [
      'Set pulley heights appropriately',
      'Use handles, not rope attachments',
      'Keep core tight for stability',
      'Don\'t let momentum swing the weights'
    ],
    commonMistakes: [
      'Using too much weight and swinging',
      'Locking elbows fully',
      'Not following through to the center',
      'Standing too upright'
    ],
    breathing: 'Exhale as you bring hands together, inhale as you return',
    startImage: '',
    endImage: ''
  },

  'Lateral Raise': {
    name: 'Lateral Raise',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Side Deltoids', 'Front Delts', 'Traps'],
    equipment: ['Dumbbells'],
    startPosition: 'Stand upright, dumbbells at sides, palms facing thighs, slight bend in elbows.',
    endPosition: 'Arms raised to sides until parallel with floor, elbows still slightly bent.',
    steps: [
      'Stand with feet shoulder-width apart',
      'Hold dumbbells at sides, palms facing body',
      'Raise arms out to sides, leading with elbows',
      'Lift until arms are parallel to floor',
      'Lower slowly to starting position'
    ],
    formCues: [
      'Lead with elbows, not hands',
      'Keep slight bend in elbows throughout',
      'Don\'t raise shoulders to ears',
      'Feel the burn on the side of shoulders'
    ],
    safetyTips: [
      'Use light weight to start - shoulders are vulnerable',
      'Control the descent - don\'t drop',
      'Stop if you feel shoulder impingement',
      'Warm up shoulders before heavy raises'
    ],
    commonMistakes: [
      'Using too much weight and swinging',
      'Shrugging shoulders up',
      'Raising too high past shoulder level',
      'Not keeping core engaged'
    ],
    breathing: 'Exhale as you raise, inhale as you lower',
    startImage: '',
    endImage: ''
  },

  'Bicep Curl': {
    name: 'Bicep Curl',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Biceps', 'Forearms'],
    equipment: ['Dumbbells'],
    startPosition: 'Stand upright, dumbbells at sides, palms facing forward, elbows close to body.',
    endPosition: 'Dumbbells at shoulder level, biceps fully contracted, elbows still close to body.',
    steps: [
      'Stand with dumbbells at sides, palms facing forward',
      'Keep elbows pinned at sides',
      'Curl weights up by flexing elbows',
      'Squeeze biceps at top of movement',
      'Lower with control - don\'t drop'
    ],
    formCues: [
      'Keep elbows stationary at sides',
      'Don\'t swing or use momentum',
      'Full range of motion - fully extend at bottom',
      'Squeeze at top'
    ],
    safetyTips: [
      'Don\'t use momentum - it reduces bicep work',
      'Control the negative portion',
      'Keep core engaged to avoid arching back',
      'Warm up elbows first'
    ],
    commonMistakes: [
      'Swinging the weights up',
      'Moving elbows forward',
      'Not going through full range of motion',
      'Using too much weight'
    ],
    breathing: 'Exhale as you curl up, inhale as you lower',
    startImage: '',
    endImage: ''
  },

  'Tricep Pushdown': {
    name: 'Tricep Pushdown',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Triceps'],
    equipment: ['Cable Machine'],
    startPosition: 'Stand at cable machine, handles at chest level, elbows at sides, palms facing down.',
    endPosition: 'Arms fully extended down, triceps contracted, handles at thigh level.',
    steps: [
      'Stand facing cable machine',
      'Grip handles with palms facing down',
      'Keep elbows pinned at sides',
      'Push handle down until arms are fully extended',
      'Return to start with control'
    ],
    formCues: [
      'Keep elbows stationary - don\'t let them move',
      'Push straight down, not out',
      'Squeeze triceps at bottom',
      'Control the return'
    ],
    safetyTips: [
      'Keep elbows close to body',
      'Don\'t use momentum',
      'Adjust cable height for comfort',
      'Use overhand or underhand grip as comfortable'
    ],
    commonMistakes: [
      'Flaring elbows out',
      'Using too much weight',
      'Bouncing at the bottom',
      'Not fully extending'
    ],
    breathing: 'Exhale as you push down, inhale as you return',
    startImage: '',
    endImage: ''
  },

  'Walking Lunge': {
    name: 'Walking Lunge',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['Dumbbells (optional)'],
    startPosition: 'Stand upright, feet hip-width apart, hands on hips or holding dumbbells.',
    endPosition: 'Front thigh parallel to floor, back knee nearly touching ground, torso upright.',
    steps: [
      'Stand with feet hip-width apart',
      'Step forward with one leg',
      'Lower body until front thigh is parallel to floor',
      'Push off front foot to bring back leg forward',
      'Repeat with opposite leg, walking forward'
    ],
    formCues: [
      'Keep torso upright, don\'t lean forward',
      'Front knee should track over toes',
      'Take controlled steps',
      'Keep core engaged throughout'
    ],
    safetyTips: [
      'Start without weights to master form',
      'Step far enough forward to protect knee',
      'If you have knee issues, try reverse lunges instead',
      'Keep steps controlled, not bouncing'
    ],
    commonMistakes: [
      'Taking too short steps',
      'Letting front knee cave inward',
      'Leaning torso forward',
      'Locking out front knee at top'
    ],
    breathing: 'Inhale as you step forward, exhale as you push off',
    startImage: '',
    endImage: ''
  },

  'Leg Curl': {
    name: 'Leg Curl',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Hamstrings'],
    equipment: ['Leg Curl Machine'],
    startPosition: 'Lie face down on leg curl machine, ankles under pad, legs straight.',
    endPosition: 'Ankles pulled toward glutes, knees still on pad, hamstrings contracted.',
    steps: [
      'Lie face down with ankles under the pad',
      'Grip handles for stability',
      'Curl ankles toward glutes by flexing knees',
      'Squeeze hamstrings at top',
      'Lower slowly to starting position'
    ],
    formCues: [
      'Keep hips pressed to pad',
      'Don\'t lift upper thighs off pad',
      'Full range of motion',
      'Squeeze at the top'
    ],
    safetyTips: [
      'Start with light weight - hamstrings are often weak',
      'Keep hips down on the pad',
      'Control the negative',
      'Stop if you get cramps'
    ],
    commonMistakes: [
      'Lifting hips off pad',
      'Using momentum to curl',
      'Not going through full range',
      'Locking knees at bottom'
    ],
    breathing: 'Exhale as you curl, inhale as you lower',
    startImage: '',
    endImage: ''
  },

  'Leg Extension': {
    name: 'Leg Extension',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Quadriceps'],
    equipment: ['Leg Extension Machine'],
    startPosition: 'Sit on machine, back against pad, ankles under pad, knees at 90 degrees.',
    endPosition: 'Legs extended straight out, quads fully contracted, knees still on pad.',
    steps: [
      'Sit with back against pad',
      'Place ankles under pad',
      'Extend legs by pushing with quadriceps',
      'Hold briefly at top with quads squeezed',
      'Lower slowly to starting position'
    ],
    formCues: [
      'Keep back against the pad',
      'Don\'t arch lower back',
      'Full extension at top',
      'Control the descent'
    ],
    safetyTips: [
      'Don\'t use too much weight - quad isolation is intense',
      'Keep back flat against pad',
      'Stop if knee feels uncomfortable',
      'Warm up with lighter weight first'
    ],
    commonMistakes: [
      'Arching lower back',
      'Locking knees at top',
      'Using momentum',
      'Not going through full range'
    ],
    breathing: 'Exhale as you extend, inhale as you lower',
    startImage: '',
    endImage: ''
  },

  'Hip Thrust': {
    name: 'Hip Thrust',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Glutes', 'Hamstrings'],
    equipment: ['Barbell', 'Bench'],
    startPosition: 'Sit on floor with upper back against bench, barbell over hips, knees bent, feet flat.',
    endPosition: 'Hips fully extended, glutes squeezed, body in straight line from shoulders to knees.',
    steps: [
      'Sit on floor with upper back against bench edge',
      'Roll barbell to hips, pad it if needed',
      'Feet flat, shoulder-width apart',
      'Drive through heels to lift hips',
      'Squeeze glutes at top, lower with control'
    ],
    formCues: [
      'Thrust with glutes, not lower back',
      'Keep chin tucked',
      'Full hip extension at top',
      'Don\'t let knees cave inward'
    ],
    safetyTips: [
      'Use a pad on the barbell - it hurts hips',
      'Don\'t hyperextend lower back at top',
      'Start with bodyweight if new to exercise',
      'Have spotter for heavy sets'
    ],
    commonMistakes: [
      'Using lower back instead of glutes',
      'Not going through full range',
      'Hyperextending at top',
      'Feet too narrow or too wide'
    ],
    breathing: 'Exhale as you thrust up, inhale as you lower',
    startImage: '',
    endImage: ''
  },

  'Goblet Squat': {
    name: 'Goblet Squat',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Quadriceps', 'Glutes', 'Core'],
    equipment: ['Dumbbell or Kettlebell'],
    startPosition: 'Stand upright holding weight at chest level, feet slightly wider than shoulder-width, toes slightly out.',
    endPosition: 'Thighs parallel to floor or below, weight still at chest, torso upright.',
    steps: [
      'Hold weight at chest with elbows close to body',
      'Stand with feet shoulder-width, toes slightly out',
      'Push hips back and bend knees to squat',
      'Keep chest up and weight close to body',
      'Drive through heels to stand back up'
    ],
    formCues: [
      'Keep weight close to body',
      'Push knees out over toes',
      'Keep chest up - don\'t lean forward',
      'Go as deep as mobility allows'
    ],
    safetyTips: [
      'Start with lighter weight to master form',
      'Keep torso upright',
      'Don\'t let knees cave in',
      'Use a mirror or record yourself to check form'
    ],
    commonMistakes: [
      'Letting weight pull torso forward',
      'Knees caving inward',
      'Not squatting deep enough',
      'Rising on toes'
    ],
    breathing: 'Exhale as you stand, inhale as you squat down',
    startImage: '',
    endImage: ''
  },

  'Treadmill Run': {
    name: 'Treadmill Run',
    category: 'cardio',
    difficulty: 'intermediate',
    muscles: ['Quadriceps', 'Hamstrings', 'Calves', 'Heart'],
    equipment: ['Treadmill'],
    startPosition: 'Standing on treadmill sides, holding handrails, speed set low.',
    endPosition: 'Running at steady pace, arms swinging naturally, eyes forward.',
    steps: [
      'Start on sides of treadmill, set speed to walking pace',
      'Step onto belt and find balance',
      'Let go of handrails once comfortable',
      'Maintain steady running pace',
      'Slow down gradually before stopping'
    ],
    formCues: [
      'Land midfoot, not heel-strike hard',
      'Keep arms at 90 degrees, swing naturally',
      'Don\'t look down at feet',
      'Maintain upright posture'
    ],
    safetyTips: [
      'Always start with warm-up at slow speed',
      'Use emergency stop clip',
      'Don\'t jump off at high speed',
      'Keep treadmill at incline 1-3% for natural feel'
    ],
    commonMistakes: [
      'Holding handrails while running',
      'Heel-striking too hard',
      'Running too fast too soon',
      'Looking at feet'
    ],
    breathing: 'Breathe steadily - if gasping, slow down',
    startImage: '',
    endImage: ''
  },

  'Stationary Bike': {
    name: 'Stationary Bike',
    category: 'cardio',
    difficulty: 'beginner',
    muscles: ['Quadriceps', 'Hamstrings', 'Calves', 'Heart'],
    equipment: ['Stationary Bike'],
    startPosition: 'Sit on bike, feet in pedals, hands on handlebars, seat height at hip level.',
    endPosition: 'Cycling at steady pace, slight knee bend at bottom of pedal stroke.',
    steps: [
      'Adjust seat so leg is slightly bent at bottom of pedal',
      'Place feet in pedals, secure straps',
      'Start pedaling at low resistance',
      'Increase resistance to target effort level',
      'Maintain 70-90 RPM cadence'
    ],
    formCues: [
      'Seat should be at hip height when standing',
      'Knee should have slight bend at bottom of stroke',
      'Don\'t rock hips side to side',
      'Keep core engaged'
    ],
    safetyTips: [
      'Secure feet in pedals before starting',
      'Start with low resistance',
      'Keep handlebar height comfortable',
      'Stay hydrated'
    ],
    commonMistakes: [
      'Seat too low causing knee pain',
      'Setting resistance too high',
      'Hunching over handlebars',
      'Pedaling at too low or too high RPM'
    ],
    breathing: 'Breathe steadily, don\'t hold breath',
    startImage: '',
    endImage: ''
  },

  'Seated Row': {
    name: 'Seated Row',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Back', 'Biceps', 'Rear Delts'],
    equipment: ['Cable Row Machine'],
    startPosition: 'Sit at cable row machine, feet on platform, knees slightly bent, back straight, arms extended.',
    endPosition: 'Handle pulled to lower abdomen, elbows past back, shoulder blades squeezed together.',
    steps: [
      'Sit with feet on platform, knees slightly bent',
      'Grip handle with arms extended',
      'Pull handle to lower abdomen, squeezing shoulder blades',
      'Keep back straight throughout',
      'Return slowly to start with control'
    ],
    formCues: [
      'Pull with back, not arms',
      'Keep core engaged, back straight',
      'Squeeze shoulder blades at contraction',
      'Don\'t lean back at end of pull'
    ],
    safetyTips: [
      'Keep back straight - don\'t round',
      'Start with light weight to master form',
      'Control the negative portion',
      'Adjust seat so you can fully extend'
    ],
    commonMistakes: [
      'Using too much arm',
      'Rounding lower back',
      'Leaning back too far at end',
      'Not pulling through full range'
    ],
    breathing: 'Exhale as you pull, inhale as you return',
    startImage: '',
    endImage: ''
  },

  'Kettlebell Swing': {
    name: 'Kettlebell Swing',
    category: 'cardio',
    difficulty: 'intermediate',
    muscles: ['Glutes', 'Hamstrings', 'Core', 'Shoulders'],
    equipment: ['Kettlebell'],
    startPosition: 'Standing with feet shoulder-width, kettlebell on floor between legs, hinging at hips.',
    endPosition: 'Standing upright, kettlebell at shoulder height, arms extended, glutes and core engaged.',
    steps: [
      'Stand with feet shoulder-width, hinge at hips',
      'Grip kettlebell with both hands',
      'Swing kettlebell between legs with power from hips',
      'Thrust hips forward explosively to swing kettlebell to shoulder height',
      'Let kettlebell swing back down between legs'
    ],
    formCues: [
      'Power comes from hips, not arms',
      'Hinge at hips, don\'t squat',
      'Keep core tight',
      'Kettlebell is pulled by hip thrust, not arms'
    ],
    safetyTips: [
      'Start with lighter weight to master hip hinge',
      'Don\'t round lower back',
      'Keep arms loose - they\'re just ropes',
      'Start with Russian swings (chest height) before full swings'
    ],
    commonMistakes: [
      'Squatting instead of hinging',
      'Using arms instead of hips',
      'Rounding lower back',
      'Catching at top with locked elbows'
    ],
    breathing: 'Exhale as you thrust hips forward, inhale as it falls',
    startImage: '',
    endImage: ''
  },

  'Standing Calf Raise': {
    name: 'Standing Calf Raise',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Calves'],
    equipment: ['Calf Raise Machine or Step'],
    startPosition: 'Stand on calf raise machine or step, balls of feet on edge, heels off, hands gripping handles.',
    endPosition: 'Standing on toes at top, calves fully contracted, knees straight.',
    steps: [
      'Stand with balls of feet on edge of platform',
      'Lower heels below platform level for stretch',
      'Push through balls of feet to raise up',
      'Hold briefly at top with calves squeezed',
      'Lower slowly to starting position'
    ],
    formCues: [
      'Full range of motion - stretch at bottom',
      'Keep legs straight (not bent)',
      'Squeeze at the top',
      'Control the descent - don\'t drop'
    ],
    safetyTips: [
      'Hold onto support for balance',
      'Start with bodyweight',
      'Stop if you get cramps',
      'Don\'t bounce at bottom'
    ],
    commonMistakes: [
      'Not going through full range',
      'Bending knees',
      'Using momentum',
      'Dropping quickly instead of lowering'
    ],
    breathing: 'Exhale as you rise, inhale as you lower',
    startImage: '',
    endImage: ''
  }
}

// Get exercise instruction by name
export function getExerciseInstruction(exerciseName: string): ExerciseInstructionSet | null {
  // Try exact match first
  if (exerciseDatabase[exerciseName]) {
    return exerciseDatabase[exerciseName]
  }

  // Try case-insensitive match
  const lowerName = exerciseName.toLowerCase()
  for (const [name, instruction] of Object.entries(exerciseDatabase)) {
    if (name.toLowerCase() === lowerName) {
      return instruction
    }
  }

  // Try partial match
  for (const [name, instruction] of Object.entries(exerciseDatabase)) {
    if (name.toLowerCase().includes(lowerName) || lowerName.includes(name.toLowerCase())) {
      return instruction
    }
  }

  return null
}

// Get all exercise names
export function getAllExerciseNames(): string[] {
  return Object.keys(exerciseDatabase)
}
