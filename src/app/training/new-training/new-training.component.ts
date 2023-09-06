import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  exercises!: any; 
  // exercises!: Observable<Exercise[]>; 

  constructor(
    private trainingService: TrainingService, 
    private db: AngularFirestore) { }

  ngOnInit(): void {
    //this.getExercises();
    this.db
    .collection<Exercise[]>('availableExercises')
    .snapshotChanges()
    .subscribe((docArray: any[]) => {
      this.exercises = docArray.map(doc => {
        return {
          id: doc.payload.doc.id, 
          name: doc.payload.doc.data().name,
          duration: doc.payload.doc.data().duration,
          calories: doc.payload.doc.data().calories 
        };
      })
      console.log('exercisesexercises', this.exercises)
    });
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  //getExercises() {
  //  this.exercises = this.trainingService.getAvailableExercises();
  //}

}
