import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { HabitService } from '../../services/habit';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-add-habit',
  styleUrl: './add-habit.css',
  templateUrl: './add-habit.html',
})

export class AddHabit {
  private habitService = inject(HabitService);
  private router = inject(Router)

  habitForm = new FormGroup({
    name: new FormControl("", { nonNullable: true }),
    color: new FormControl('#668B68', { nonNullable: true }),
    frequency: new FormControl<'daily' | 'weekly'>('daily', { nonNullable: true }),
    goalDays: new FormControl(20),
    timesPerWeek: new FormControl(3),
    goalWeeks: new FormControl(8)

  })
  onSubmit() {
    const formValue = this.habitForm.getRawValue()
    if (!formValue.name?.trim()) {
      return;
    }
    if (formValue.frequency === "daily") {

      this.habitService.addHabit(
        formValue.name,
        formValue.color,
        "daily",
        formValue.goalDays ?? undefined
      )
    }
    else {
      this.habitService.addHabit(
        formValue.name,
        formValue.color,
        "weekly",
        undefined,
        formValue.goalWeeks ?? undefined,
        formValue.timesPerWeek ?? undefined
      )
    }
    this.habitForm.reset({
      name: '',
      color: '#668B68',
      frequency: 'daily',
      goalDays: 20,
      timesPerWeek: 3,
      goalWeeks: 8
    })

    this.router.navigate(['/garden']);
  }

}
