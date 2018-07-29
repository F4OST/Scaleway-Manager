import {Component} from '@angular/core';
import {NavParams, PopoverController, ToastController} from 'ionic-angular';
import {ServerDto} from "../../../providers/servers/server.dto";
import {ServerActionsPage} from "../server-actions/server-actions";
import {ServersProvider} from "../../../providers/servers/servers";
import {AuthTokenDto} from "../../../providers/auth/auth-tokens.dto";
import {Storage} from "@ionic/storage";
import {Clipboard} from "@ionic-native/clipboard";

@Component({
  selector: 'page-show-server',
  templateUrl: 'show-server.html',
})
export class ShowServerPage {

  public server: ServerDto;
  public serverName: string;
  public serverCountry: string;
  public state: string;
  public serverLoading: boolean;
  private serverActions;
  public stateClass: string = 'state';

  constructor(public navParams: NavParams, public popoverCtrl: PopoverController,
              private serversProvider: ServersProvider, private storage: Storage,
              private toastCtrl: ToastController, private clipboard: Clipboard) {
    this.server = navParams.get('server');
    this.serverCountry = navParams.get('serverCountry');
    this.serverName = this.server.name;
  }

  ionViewDidLoad() {
    this.setState();
    this.getAllActions();
    this.refreshServer();
  }

  private setState() {
    switch (this.server.state) {
      case 'stopped':
        this.state = 'red';
        this.serverLoading = false;
        this.stateClass = 'state';
        break;
      case 'running':
        this.state = '#27c295';
        this.serverLoading = false;
        this.stateClass = 'state';
        break;
      case 'stopping':
        this.state = 'orange';
        this.serverLoading = true;
        this.stateClass = 'blinker';
        break;
      case 'starting':
        this.state = 'orange';
        this.serverLoading = true;
        this.stateClass = 'blinker';
        break;
      default:
        this.state = 'gray';
        this.serverLoading = true;
        this.stateClass = 'state';
    }
  }

  private refreshServer(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.storage.get('token').then((token: AuthTokenDto) => {
        this.serversProvider.getSpecificServer(this.serverCountry, token.token.id, this.server.id).then(result => {
          this.server = result.server;
          this.serverName = result.server.name;
          this.setState();
          resolve('ok');
        }).catch(error => {
          reject(error)
        });
      });
    });
  }

  capitalize(value: string) {
    return (value.charAt(0).toUpperCase() + value.slice(1));
  }

  private getAllActions() {
    this.serverLoading = true;
    this.storage.get('token').then((val: AuthTokenDto) => {
      this.serversProvider.getAllActionsServer(this.serverCountry, this.server.id, val.token.id).then(result => {
        this.serverActions = result.actions;
        this.serverLoading = false;
      });
    });
  }

  showActions() {
    let popover = this.popoverCtrl.create(ServerActionsPage, {
        serverCountry: this.serverCountry,
        server: this.server,
        actions: this.serverActions
      },
      {cssClass: 'custom-popover'});
    let ev = {
      target: {
        getBoundingClientRect: () => {
          return {
            left: '20px',
            top: '70px',
            width: '90%'
          };
        }
      }
    };
    popover.present({ev});
    popover.onDidDismiss(result => {
      if (result && result.action) {
        this.storage.get('token').then(token => {
          this.serversProvider.sendServerAction(this.serverCountry, this.server.id, token.token.id, result.action)
            .then(() => {
              this.refreshServer();
            }).catch(error => {
            console.log(error);
          })
        });
      }
    })
  }

  doRefresh(refresher) {
    this.refreshServer().then(() => {
      refresher.complete();
    }).catch(error => {
      console.log(error);
      refresher.complete();
    })
  }

  copyToClipBoard(text: string) {
    this.clipboard.copy(text);
    const toast = this.toastCtrl.create({
      message: 'Address has been copied into your clipboard!',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
