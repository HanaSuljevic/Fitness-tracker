import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subject } from "rxjs";
import { Subscription } from "rxjs";

import { Exercise } from "./exercise.model";
import { UIService } from "../shared/ui.service";

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise | null>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    private runningExercise?: Exercise | null; 
    private fbSubs: Subscription[] = []; 

    constructor(private db: AngularFirestore, private uiService: UIService) {
    }

    fetchAvailableExercises() {
        this.uiService.loadingStateChanged.next(true);
        this.fbSubs.push(this.db
            .collection('availableExercises')
            .snapshotChanges()
            .subscribe((docArray: any[]) => {
                const exercises = docArray.map(doc => {
                return {
                id: doc.payload.doc.id, 
                name: doc.payload.doc.data().name,
                duration: doc.payload.doc.data().duration,
                calories: doc.payload.doc.data().calories ,
                
                };
            });
            this.uiService.loadingStateChanged.next(false);
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
        }, error => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar('Fetching Exercises failed, please try again later.', undefined, 3000);
            this.exerciseChanged.next(null);
        }));
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(
            ex => ex.id === selectedId
        );
        if (this.runningExercise) {
            this.exerciseChanged.next({ ...this.runningExercise });
        }
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise!, 
            date: new Date(),
            state: 'complated'
        });
        this.runningExercise = null; 
        this.exerciseChanged.next(null);
    }

    cancelExercise(process: number) {
        this.addDataToDatabase({
            ...this.runningExercise!,
            duration: this.runningExercise!.duration * (process / 100),
            calories: this.runningExercise!.duration * (process / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = undefined;
        this.exerciseChanged.next(null);
    }
    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchComplatedOrCancelledExercises() {
        // this.db.collection('finishedExercises')
        //     .valueChanges()
        //     .subscribe((exercises: Exercise[]) => {
        //         this.finishedExercisesChanged.next(exercises);
        //     });
        this.fbSubs.push(this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((docArray: any[]) => {
            const exercises = docArray.map(doc => {
            return {
            id: doc.payload.doc.id, 
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories 
            };
        });
        this.finishedExercisesChanged.next(exercises);
    }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}

//function subscribe(arg0: (exercises: Exercise[]) => void) {
  //  throw new Error("Function not implemented.");
//}




