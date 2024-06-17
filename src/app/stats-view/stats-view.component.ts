import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserSimple } from '../user-simple.model';

@Component({
  selector: 'app-stats-view',
  templateUrl: './stats-view.component.html',
  styleUrls: ['./stats-view.component.scss'],
})
export class StatsViewComponent implements OnInit {
  @Input() stat: UserSimple = {id: "",name:'', surname: "", email: '', password: "", isActive: true};
  @Output() deleteStat= new EventEmitter<void>();
  @Output() editStat = new EventEmitter<void>();

  constructor() {}
  ngOnInit(): void {}

  onDelete() {
    this.deleteStat.emit();
  }

  onEdit() {
    this.editStat.emit();
  }
}
