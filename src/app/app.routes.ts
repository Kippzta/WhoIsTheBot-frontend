import { Routes } from '@angular/router';
import { StartPage } from './pages/start-page/start-page';
import { RoomPage } from './pages/room-page/room-page';

export const routes: Routes = [

    { path: '', component: StartPage },

    { path: 'room/:roomCode', component: RoomPage }

];
