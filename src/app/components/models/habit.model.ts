export interface Habit {
    id: number,
    name: string,
    color: string | number,
    createdAt: Date,
    frequency: "daily" | "weekly",
    completedDates: string[],
    goalDays?: number,
    timesPerWeek?: number,
    goalWeeks?: number
    selectedDays?: string[]
}

