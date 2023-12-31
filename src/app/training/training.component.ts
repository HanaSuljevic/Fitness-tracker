import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false; 
  exerciseSubsciption?: Subscription | undefined;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    // this.exerciseSubsciption = this.trainingService.runningExercise?.subscribe(
    //   exercise => {
    //     if(exercise) {
    //       this.ongoingTraining = true;
    //     }
    //     else {
    //       this.ongoingTraining = false;
    //     }
    //   }
    // )
    this.exerciseSubsciption = this.trainingService.exerciseChanged.subscribe(
      exercise => {
        if(exercise) this.ongoingTraining = true;
        else this.ongoingTraining = false;
      }
    );
  }

  ngOnDestroy(): void {
    if(this.exerciseSubsciption) {
      this.exerciseSubsciption.unsubscribe();
    }
  }

}
