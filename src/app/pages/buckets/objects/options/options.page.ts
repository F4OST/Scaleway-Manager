import {Component, OnInit} from '@angular/core';
import {LoadingController, NavParams, PopoverController} from '@ionic/angular';
import {ObjectService} from '../../../../services/object/object.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  public type: 'folder' | 'standard' | 'glacier' = null;
  public object: any = null;
  public region: 'fr-par' | 'nl-ams' = null;
  public bucket: string = null;

  constructor(private navParams: NavParams, private objectService: ObjectService, private loadingCtrl: LoadingController,
              private popoverController: PopoverController) {
    this.type = this.navParams.get('type');
    this.object = this.navParams.get('object');
    this.region = this.navParams.get('region');
    this.bucket = this.navParams.get('bucket');
  }

  ngOnInit() {
  }

  public async deleteObject() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      mode: 'ios'
    });

    await loading.present();
    await this.objectService.deleteObject(this.bucket, this.region, this.object.Key ? this.object.Key[0] : this.object.Prefix[0]);
    await this.popoverController.dismiss({ reload: true });
    await loading.dismiss();

    return;
  }

}
