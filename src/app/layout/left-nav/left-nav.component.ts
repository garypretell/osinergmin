import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { LEFT_NAV_MENUS } from '@shared/helpers';
import { ILeftNavMenu } from '@shared/models/common/interfaces';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {
  @Output() showMenu = new EventEmitter<any>(); 
  public faBars = faBars;
public name = 'John Doe';
public position = 'Software Engineer';
public avatar = 'assets/images/avatar.jpg';
public logo = 'assets/images/osinermin.png';
public menus: ILeftNavMenu[] = LEFT_NAV_MENUS;
  constructor() { }

  ngOnInit(): void {
  }

}
