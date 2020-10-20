import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserDTO } from './shared/model/UserDTO';
import { AccountService } from './shared/service/Account.service';
import { BlockService } from './shared/service/Block.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: UserDTO;
  title = 'FWK';
  visible: boolean;
  blockedDocument: boolean = false;
  subscription: Subscription;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private blockService: BlockService,
  ) {

    this.subscription = this.blockService.getBlock()
      .subscribe(objeto => this.blockedDocument = objeto)

    if (this.accountService.userValue) {
      this.router.navigate(['/home']);
    }
    this.accountService.user.subscribe(x => this.user = x);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {

  }

  // Es llamado por el header desde el boton toggle
  toogleMenu() {
    this.visible = !this.visible;
  }

  // son llamados por el sideBar
  closeMenu() {
    this.visible = false;
  }
  openMenu() {
    this.visible = true;
  }

}