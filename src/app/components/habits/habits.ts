import { Component, inject } from '@angular/core';
import { HabitService } from '../../services/habit';
import { Habit as HabitModel } from '../models/habit.model'
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-habits',
  styleUrl: './habits.css',
  templateUrl: './habits.html',
})
export class Habits {
  habitService = inject(HabitService)

  plantImage = {
    seed: 'plant/seed.png',
    sprout: 'plant/sprout.png',
    plant: 'plant/plant.png',
    growing: 'plant/growing.png',
    flowering: 'plant/flowering.png',
    tree: 'plant/tree.png'
  };
  today = new Date().toISOString().split("T")[0]

  editingHabitId: number | null = null
  editedName: string = ""
  showDeleteModal = false;
  selectedHabitId: number | null = null;
  selectedHabitName = '';


  startEdit(habit: HabitModel) {
    this.editingHabitId = habit.id
    this.editedName = habit.name
  }
  saveEdit(id: number) {
    if (!this.editedName.trim()) {
      return;
    }
    this.habitService.editHabit(id, this.editedName.trim())
    this.editingHabitId = null;
    this.editedName = "";
  }


  openDeleteModal(habit: HabitModel) {
    this.selectedHabitId = habit.id
    this.selectedHabitName = habit.name
    this.showDeleteModal = true
  }


  cancelDelete() {
    this.selectedHabitId = null
    this.showDeleteModal = false


  }
  confirmDelete() {

    if (this.selectedHabitId === null) return

    this.habitService.deleteHabit(this.selectedHabitId);
    this.cancelDelete();

  }


}
