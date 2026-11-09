import { Component, inject } from '@angular/core';
import { HabitService } from '../../services/habit';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts'
import { ChartData, ChartOptions } from 'chart.js';


@Component({
  imports: [DecimalPipe, BaseChartDirective],
  selector: 'app-insights',
  styleUrl: './insights.css',
  templateUrl: './insights.html',
})
export class Insights {
  habitService = inject(HabitService)

  weeklyChartData: ChartData<'bar'> = this.getWeeklyData();
  doughnutChartData: ChartData<'doughnut'> = this.getDoughnutData()


  weeklyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  }


  getWeeklyData(): ChartData<'bar'> {
    const labels: string[] = []
    const data: number[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - i)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const hours = String(date.getDate()).padStart(2, "0")
      const dateKey = `${year}-${month}-${hours}`
      const dayName = new Intl.DateTimeFormat('en-us', {
        weekday: "short",
      })
        .format(date)
      labels.push(dayName)

      const completed = this.habitService.habit.reduce((total, habit) => {

        return total + (
          habit.completedDates.includes(dateKey) ? 1 : 0
        );

      }, 0);

      data.push(completed);
    }

    return {
      labels: labels,

      datasets: [{
        label: 'Completed Habits',
        data: data,
        backgroundColor: '#78966d',
        borderRadius: 8,
        barThickness: 30,
      }],
    };
  }

  doughnutChartOptions: ChartOptions<'doughnut'> = {

    responsive: true,
    maintainAspectRatio: false,

    cutout: "70%",
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  getDoughnutData(): ChartData<'doughnut'> {
    const completed = this.getCompletedToday()
    const remaining = this.getTotalHabits() - completed;

    return {
      labels: ['Completed', 'Remaining'],
      datasets: [{
        data: [completed, remaining],
        backgroundColor: ['#78966d', '#e8e9df'],
        borderWidth: 0,
        hoverOffset: 8
      }]

    }
  }


  getDailyProgressPercentage(): number {
    const total = this.getTotalHabits()
    if (total === 0) {
      return 0
    }
    return Math.round((this.getCompletedToday() / total) * 100)
  }




  getTotalHabits(): number {
    const total = this.habitService.habit.length
    return total
  }

  getCompletedToday(): number {
    const completed = this.habitService.getDateKey();
    return this.habitService.habit.filter(h => {
      return h.completedDates.includes(completed)
    }).length

  }

  getOverallProgress(): number {
    const totalProgress = this.habitService.habit.reduce((total, item) => {
      return total + this.habitService.getProgress(item)
    }, 0)
    const totalHabits = (this.getTotalHabits())


    if (totalHabits === 0) {
      return 0
    }
    return totalProgress / totalHabits
  }


  getTotalGoals(): number {

    return this.habitService.habit.filter(h => {
      return h.frequency === "daily"
        ? !!h.goalDays
        : !!h.goalWeeks
    }).length
  }
}
