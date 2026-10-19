import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateRoomReqDTO } from '../models/CreateRoomReqDTO';
import { RoomEntryRespDTO } from '../models/RoomEntryRespDTO';
import { Observable } from 'rxjs';
import { env } from '../../environments/environment';
import { JoinRoomReqDTO } from '../models/JoinRoomReqDTO';

@Injectable({
  providedIn: 'root',
})
export class GameRoomService {

  private http = inject(HttpClient);

  private readonly createRoomUrl =  `${env.apiUrl}/rooms/create`;

  private readonly joinRoomUrl = `${env.apiUrl}/rooms/join`;


  createRoom(createRoomReqDTO: CreateRoomReqDTO): Observable<RoomEntryRespDTO> {

    return this.http.post<RoomEntryRespDTO>(this.createRoomUrl, createRoomReqDTO);

  }

  joinRoom(joinRoomReqDTO: JoinRoomReqDTO): Observable<RoomEntryRespDTO> {

    return this.http.post<RoomEntryRespDTO>(this.joinRoomUrl, joinRoomReqDTO);

  }



}
