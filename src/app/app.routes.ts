import { Routes } from '@angular/router';
import { AddHabit } from './components/add-habit/add-habit';
import { Insights } from './components/insights/insights';
import { Garden } from './components/garden/garden';
import { Habits } from './components/habits/habits';


export const routes: Routes = [
{path:"",redirectTo:'garden',pathMatch:'full'}
    { path: 'garden', component: Garden },
    { path: 'habits', component: Habits },
    { path: 'insights', component: Insights },
    { path: 'add-habit', component: AddHabit },
];
