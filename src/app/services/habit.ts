import { inject, Injectable } from '@angular/core';
import { Habit as HabitModel } from '../components/models/habit.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: "root"
})
export class HabitService {

    private readonly defaultHabits: HabitModel[] = [{
        id: 1,
        name: 'Reading',
        color: '#3D6B50',
        createdAt: new Date(),
        frequency: 'daily',
        completedDates: [],
        goalDays: 20
    },
    {
        id: 2,
        name: 'Exercise',
        color: '#D9B779',
        createdAt: new Date(),
        frequency: 'daily',
        completedDates: [],
        goalDays: 60
    },
    {
        id: 3,
        name: 'Learning Angular',
        color: '#A8C69F',
        createdAt: new Date(),
        frequency: 'daily',
        completedDates: [],
        goalDays: 20
    }

    ]



    markAsDone(id: number) {
        const habit = this.habit.find(h => h.id === id)
        if (!habit) {
            return
        }
        const today = this.getDateKey();
        if (!habit.completedDates.includes(today)) {
            habit.completedDates.push(today)

            this.saveHabits()
        }
    }

    habit: HabitModel[] = this.loadHabits()


    loadHabits(): HabitModel[] {
        const saveHabit = localStorage.getItem("habit")


        if (saveHabit !== null) {
            const habit: HabitModel[] = JSON.parse(saveHabit)
            return habit
        }
        return this.defaultHabits.map(h => ({
            ...h,
            completedDates: [...h.completedDates]
        }))
    }



    saveHabits(): void {
        localStorage.setItem("habit", JSON.stringify(this.habit))
    }


    deleteHabit(id: number): void {

        const delet = this.habit.filter(h => h.id !== id)

        this.habit = delet
        this.saveHabits()
    }


    editHabit(id: number, update: string): void {
        const edit = this.habit.map(h => h.id === id ? { ...h, name: update } : h)

        this.habit = edit
        this.saveHabits()
    }

    addHabit(name: string, color: string, frequency: "daily" | "weekly", goalDays?: number, goalWeeks?: number, timesPerWeek?: number, selectedDays?: string[]): void {

        const newHabit: HabitModel = {
            id: Date.now(),
            name: name,
            color: color,
            createdAt: new Date(),
            frequency: frequency,
            completedDates: [],
            ...(frequency === "daily" ? {
                goalDays: goalDays,
            } : {
                goalWeeks: goalWeeks,
                timesPerWeek: timesPerWeek,
                selectedDays: selectedDays ?? []
            })

        }
        this.habit.push(newHabit)
        this.saveHabits()

    }
    getProgress(habit: HabitModel): number {
        const complete = habit.completedDates.length;

        let target = 0;

        if (habit.frequency === 'daily') {
            target = habit.goalDays ?? 0;
        } else {
            target = (habit.goalWeeks ?? 0) * (habit.timesPerWeek ?? 0);
        }

        if (target === 0) return 0;

        const progress = (complete / target) * 100;

        return Math.min(progress, 100);
    } getPlantStage(habit: HabitModel):
        "flowering" | "seed" | "plant" | "growing" | "sprout" | "tree" {
        const progress = this.getProgress(habit)

        if (progress >= 100) {
            return "tree"
        } else if (progress >= 80) {
            return 'flowering';
        } else if (progress >= 60) {
            return 'growing';
        } else if (progress >= 40) {
            return 'plant';
        } else if (progress >= 20) {
            return 'sprout';
        } else {
            return 'seed';
        }
    }


    getDateKey(date: Date = new Date()): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
