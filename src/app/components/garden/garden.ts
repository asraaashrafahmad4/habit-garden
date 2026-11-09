import { Component, inject } from '@angular/core';
import { Habit as HabitModel } from '../models/habit.model';
import { HabitService } from '../../services/habit';

@Component({
  imports: [],
  selector: 'app-garden',
  styleUrl: './garden.css',
  templateUrl: './garden.html',
})
export class Garden {
  habitService = inject(HabitService);
  get habits(): HabitModel[] {
    return this.habitService.habit
  }
  plantImage = {
    seed: 'plant/seed.png',
    sprout: 'plant/sprout.png',
    plant: 'plant/plant.png',
    growing: 'plant/growing.png',
    flowering: 'plant/flowering.png',
    tree: 'plant/tree.png'
  };


  markAsDone(id: number) {
    this.habitService.markAsDone(id)
  }



  getCompletedToday() {
    const day = this.habitService.getDateKey()
    return this.habits.filter(h => {
      return h.completedDates.includes(day)
    })
      .length
  }




  getTotalDays(habit: HabitModel) {
    const time = new Date()
    time.setHours(0, 0, 0, 0)
    const create = new Date(habit.createdAt)
    create.setHours(0, 0, 0, 0)
    const difference = time.getTime() - create.getTime()

    const totalDays = Math.floor(
      difference / (1000 * 60 * 60 * 24)) + 1

    return totalDays
  }




  getProgress(habit: HabitModel) {
    return this.habitService.getProgress(habit)
  }





  getCurrentStreak(habit: HabitModel): number {
    const date = [...habit.completedDates].sort()

    if (date.length === 0) {
      return 0
    }
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastDate = new Date(date[date.length - 1])
    lastDate.setHours(0, 0, 0, 0)
    const diffrent = Math.floor(today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)


    if (diffrent > 1) {
      return 0
    }

    for (let i = date.length - 1; i >= 0; i--) {
      const cuurentDate = new Date(date[i])
      cuurentDate.setHours(0, 0, 0, 0)
      if (i === 0) {
        streak++
        break
      }
      const previousDate = new Date(date[i - 1])
      previousDate.setHours(0, 0, 0, 0)
      const dayDifference = Math.floor(
        (cuurentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (dayDifference === 1) {
        streak++
      } else {
        break
      }
    }
    return streak
  }





  getLongestStreak(habit: HabitModel): number {
    const date = [...habit.completedDates].sort()
    if (date.length === 0) {
      return 0
    }
    let currentStreak = 1
    let longestStreak = 1
    for (let i = 1; i < date.length; i++) {
      const cuutentDate = new Date(date[i])
      cuutentDate.setHours(0, 0, 0, 0)
      const previousDate = new Date(date[i - 1])
      previousDate.setHours(0, 0, 0, 0)
      const dayDifference = Math.floor(cuutentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)

      if (dayDifference === 1) {
        currentStreak++
      } else {
        currentStreak = 1
      }
      longestStreak = Math.max(longestStreak, currentStreak);

    }
    return longestStreak
  }





  getGoals(): number {
    return this.habits.reduce((total, current) => {
      return total + current.completedDates.length
    }, 0)

  }




  getTotalAvailableDays(): number {
    return this.habits.reduce((total, current) => {
      return total + this.getTotalDays(current)
    }, 0)
  }



  getOverallProgress(): number {

    const totalDays = this.getTotalAvailableDays()
    if (totalDays === 0) {
      return 0

    }
    return Math.min((this.getGoals()) / (totalDays) * 100, 100)


  }






}
