import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faBars, faBell, faComment } from '@fortawesome/free-solid-svg-icons';
import { VacationService } from '@pages/vacation/vacation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
@Output() showMenu = new EventEmitter<any>();
public faBars = faBars;
public faBell = faBell;
public faComment = faComment;
public avatar = 'assets/images/avatar.jpg';
public logo = 'assets/images/osinermin.png';
  constructor(
    public vacationService: VacationService
  ) { }

  ngOnInit(): void {
  }

}
