import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IDevice } from './devices.types';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private devices = new BehaviorSubject<IDevice[]>([
    {
      deviceId: 'DEV01',
      data: {
        vibration: '1',
      },
      location: 'Sarkhej GIDC , Ahmedabad',
      state: false,
    },
  ]);
  private baseUrl = environment.baseUrl + '/devices';
  constructor(private http: HttpClient) {}

  get devices$() {
    return this.devices.asObservable();
  }

  getAllDevices() {
    return this.http.get<IDevice[]>(this.baseUrl).pipe(
      tap((devices) => {
        this.devices.next(devices);
      })
    );
  }

  TriggerDevice(value: boolean) {
    return this.http.put(this.baseUrl + '/trigger', { trigger: value });
  }
}
