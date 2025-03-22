// Sample workout data for the app
export const workoutsData = [
  {
    id: '1',
    title: 'Full Body Workout',
    description: 'A complete workout targeting all major muscle groups',
    level: 'Beginner',
    duration: '45 min',
    calories: '300-400',
    image: 'https://via.placeholder.com/300',
    exercises: [
      { name: 'Push-ups', reps: '10', sets: '3', duration: null },
      { name: 'Squats', reps: '15', sets: '3', duration: null },
      { name: 'Lunges', reps: '10', sets: '3', duration: null },
      { name: 'Plank', reps: null, sets: '3', duration: '30 sec' },
      { name: 'Mountain Climbers', reps: null, sets: '3', duration: '45 sec' },
    ]
  },
  {
    id: '2',
    title: 'HIIT Cardio',
    description: 'High-intensity interval training to burn fat and improve endurance',
    level: 'Intermediate',
    duration: '30 min',
    calories: '400-500',
    image: 'https://via.placeholder.com/300',
    exercises: [
      { name: 'Jumping Jacks', reps: null, sets: '3', duration: '45 sec' },
      { name: 'Burpees', reps: null, sets: '3', duration: '30 sec' },
      { name: 'High Knees', reps: null, sets: '3', duration: '45 sec' },
      { name: 'Jump Squats', reps: null, sets: '3', duration: '30 sec' },
      { name: 'Plank Jacks', reps: null, sets: '3', duration: '30 sec' },
    ]
  },
  {
    id: '3',
    title: 'Core Strength',
    description: 'Focus on building core strength and stability',
    level: 'Beginner',
    duration: '20 min',
    calories: '150-200',
    image: 'https://via.placeholder.com/300',
    exercises: [
      { name: 'Crunches', reps: '15', sets: '3', duration: null },
      { name: 'Russian Twists', reps: '20', sets: '3', duration: null },
      { name: 'Leg Raises', reps: '12', sets: '3', duration: null },
      { name: 'Plank', reps: null, sets: '3', duration: '45 sec' },
      { name: 'Side Plank', reps: null, sets: '3', duration: '30 sec' },
    ]
  },
  {
    id: '4',
    title: 'Upper Body Focus',
    description: 'Build strength in your arms, chest, and back',
    level: 'Intermediate',
    duration: '40 min',
    calories: '250-350',
    image: 'https://via.placeholder.com/300',
    exercises: [
      { name: 'Push-ups', reps: '12', sets: '4', duration: null },
      { name: 'Tricep Dips', reps: '15', sets: '3', duration: null },
      { name: 'Arm Circles', reps: '20', sets: '3', duration: null },
      { name: 'Superman', reps: '15', sets: '3', duration: null },
      { name: 'Pike Push-ups', reps: '10', sets: '3', duration: null },
    ]
  },
  {
    id: '5',
    title: 'Lower Body Blast',
    description: 'Target your legs and glutes for strength and tone',
    level: 'Advanced',
    duration: '35 min',
    calories: '300-400',
    image: 'https://via.placeholder.com/300',
    exercises: [
      { name: 'Squats', reps: '20', sets: '4', duration: null },
      { name: 'Lunges', reps: '15', sets: '3', duration: null },
      { name: 'Glute Bridges', reps: '20', sets: '3', duration: null },
      { name: 'Calf Raises', reps: '25', sets: '3', duration: null },
      { name: 'Wall Sit', reps: null, sets: '3', duration: '60 sec' },
    ]
  }
]; 