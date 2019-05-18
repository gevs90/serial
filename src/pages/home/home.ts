import { BLE } from '@ionic-native/ble';
import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  devices: any[] = [];
  statusMessage: string;

  constructor(public navCtrl: NavController, 
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone) {}

    ionViewDidEnter() {
      console.log('ionViewDidEnter');
      this.scan();
    }
  
    scan() {
      this.setStatus('Escaneando dispositivos BLE');
      this.devices = [];
  
      this.ble.scan([], 5).subscribe(
        device => this.onDeviceDiscovered(device), 
        error => this.scanError(error)
      );
  
      setTimeout(this.setStatus.bind(this), 5000, 'Escaneo completo');
    }
  
    onDeviceDiscovered(device) {
      console.log('Discovered ' + JSON.stringify(device, null, 2));
      this.ngZone.run(() => {
        this.devices.push(device);
      });
    }
  
    scanError(error) {
      this.setStatus('Error ' + error);
      let toast = this.toastCtrl.create({
        message: 'Ha ocurrido un error mientras se escaneaba',
        position: 'middle',
        duration: 5000
      });
      toast.present();
    }
  
    setStatus(message) {
      this.ngZone.run(() => {
        this.statusMessage = message;
      });
    }
  
    deviceSelected(device) {
      this.navCtrl.push(DetailPage, {
        device: device
      });
    }
}
