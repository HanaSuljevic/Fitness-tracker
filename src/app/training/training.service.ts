import { Subject } from "rxjs";
import { Exercise } from "./exercise.model";

export class TrainingService {
    exerciseChanged = new Subject<any>();
    availableExercises: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
        { id: 'side-lounges', name: 'Side Lungens', duration: 120, calories: 18},
        { id: 'burpees', name: 'Burpees', duration: 60, calories: 8},
    ];
    private runningExercise?: Exercise; 
    private exercises: Exercise[] = [];

    getAvailableExercises() {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(
            ex => ex.id === selectedId
        );
        this.exerciseChanged.next({...this.runningExercise});
    }

    completeExercise() {
        this.exercises.push({...this.runningExercise!, date: new Date(), state: 'complated'});
        this.runningExercise = undefined;
        this.exerciseChanged.next(null);
    }

    cancelExercise() {

    }
    getRunningExercise() {
        return { ...this.runningExercise };
    }
}