import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { DeviceService } from './core/device/device.service';
import { IDevice } from './core/device/devices.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mahiFrontend';
  devices: IDevice[] = [];
  env = environment;
  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.deviceService.getAllDevices().subscribe();
    setInterval(() => {
      this.deviceService.getAllDevices().subscribe();
    }, 2000);

    this.deviceService.devices$.subscribe((devices) => {
      this.devices = devices;
    });
  }

  getKeyforData(device: IDevice) {
    return Object.keys(device.data)[0];
  }
  triggerRelay(device: IDevice) {
    this.deviceService.TriggerDevice(!device.state).subscribe((x) => {
      console.log('Ok');
    });
  }
}
