import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises!: Exercise[]; 
  private exerciseSubscription!: Subscription;
  isLoading = true; 
  private loadingSubs!: Subscription;

  constructor(
    private trainingService: TrainingService, 
    private uiService: UIService
  ) { }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (this.exercises = exercises)
    );
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  //getExercises() {
  //  this.exercises = this.trainingService.getAvailableExercises();
  //}

  ngOnDestroy(): void {
    if(this.exerciseSubscription) {
    this.exerciseSubscription.unsubscribe(); 
    }
    if(this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

}
