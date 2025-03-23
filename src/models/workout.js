// Exercise model
export class Exercise {
  constructor(name, sets, reps = null, duration = null) {
    this.name = name;
    this.sets = sets;
    this.reps = reps;
    this.duration = duration;
  }

  // Helper method to determine if this is a time-based exercise
  isTimeBased() {
    return this.duration !== null;
  }
  
  // Get formatted description of the exercise
  getDescription() {
    if (this.isTimeBased()) {
      return `${this.sets} sets × ${this.duration} seconds`;
    } else {
      return `${this.sets} sets × ${this.reps} reps`;
    }
  }
}

// Workout model
export class Workout {
  constructor(id, title, description, level, duration, calories, exercises = []) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.level = level;
    this.duration = duration;
    this.calories = calories;
    this.exercises = exercises;
  }
  
  // Get the total number of exercises
  getExerciseCount() {
    return this.exercises.length;
  }
  
  // Get the total number of sets across all exercises
  getTotalSets() {
    return this.exercises.reduce((total, exercise) => total + exercise.sets, 0);
  }
  
  // Create a workout from a raw data object
  static fromData(data) {
    const exercises = data.exercises.map(ex => {
      return new Exercise(
        ex.name,
        ex.sets,
        ex.reps || null,
        ex.duration || null
      );
    });
    
    return new Workout(
      data.id,
      data.title,
      data.description,
      data.level,
      data.duration,
      data.calories,
      exercises
    );
  }
}

// Sample workout data
export const sampleWorkouts = [
  {
    id: '1',
    title: 'Morning Energy Boost',
    description: 'Start your day with this energizing full-body workout',
    level: 'beginner',
    duration: 20,
    calories: 150,
    exercises: [
      { name: 'Jumping Jacks', duration: 60, sets: 3 },
      { name: 'Push-ups', reps: 10, sets: 3 },
      { name: 'Squats', reps: 15, sets: 3 },
      { name: 'Plank', duration: 30, sets: 3 },
    ]
  },
  {
    id: '2',
    title: 'Core Crusher',
    description: 'Intense abdominal workout to strengthen your core',
    level: 'intermediate',
    duration: 30,
    calories: 250,
    exercises: [
      { name: 'Sit-ups', reps: 20, sets: 3 },
      { name: 'Russian Twists', reps: 16, sets: 3 },
      { name: 'Mountain Climbers', duration: 45, sets: 3 },
      { name: 'Leg Raises', reps: 12, sets: 3 },
    ]
  },
  {
    id: '3',
    title: 'Leg Day Challenge',
    description: 'Build strength and endurance in your lower body',
    level: 'advanced',
    duration: 40,
    calories: 320,
    exercises: [
      { name: 'Squats', reps: 20, sets: 4 },
      { name: 'Lunges', reps: 12, sets: 3 },
      { name: 'Calf Raises', reps: 25, sets: 3 },
      { name: 'Glute Bridges', reps: 15, sets: 3 },
    ]
  },
  {
    id: '4',
    title: 'Quick HIIT Session',
    description: 'Short but intense interval training to maximize calorie burn',
    level: 'intermediate',
    duration: 25,
    calories: 300,
    exercises: [
      { name: 'Burpees', reps: 10, sets: 3 },
      { name: 'High Knees', duration: 30, sets: 3 },
      { name: 'Jump Squats', reps: 15, sets: 3 },
      { name: 'Mountain Climbers', duration: 30, sets: 3 },
    ]
  },
  {
    id: '5',
    title: 'Upper Body Strength',
    description: 'Focus on developing your arms, chest and shoulders',
    level: 'beginner',
    duration: 35,
    calories: 280,
    exercises: [
      { name: 'Push-ups', reps: 12, sets: 3 },
      { name: 'Dumbbell Curls', reps: 10, sets: 3 },
      { name: 'Tricep Dips', reps: 12, sets: 3 },
      { name: 'Shoulder Press', reps: 10, sets: 3 },
    ]
  }
];

// Convert sample data to Workout objects
export const workouts = sampleWorkouts.map(workout => Workout.fromData(workout));

// Function to add a new workout
export const addWorkout = (newWorkout) => {
  // Generate a new ID (simple implementation)
  const newId = (Math.max(...workouts.map(w => parseInt(w.id))) + 1).toString();
  
  // Create a new workout object with the generated ID
  const workoutToAdd = {
    ...newWorkout,
    id: newId
  };
  
  // Add to the workouts array
  workouts.push(Workout.fromData(workoutToAdd));
  
  return newId;
};

// Function to update an existing workout
export const updateWorkout = (updatedWorkout) => {
  const index = workouts.findIndex(w => w.id === updatedWorkout.id);
  
  if (index !== -1) {
    // Replace the workout at the found index
    workouts[index] = Workout.fromData(updatedWorkout);
    return true;
  }
  
  return false;
};

// Function to remove a workout
export const removeWorkout = (id) => {
  const index = workouts.findIndex(w => w.id === id);
  
  if (index !== -1) {
    // Remove the workout at the found index
    workouts.splice(index, 1);
    return true;
  }
  
  return false;
};

// Function to get a workout by id
export const getWorkoutById = (id) => {
  return workouts.find(w => w.id === id) || null;
}; 