import { Component, OnInit, Inject } from '@angular/core';
import { AppSpinnerModel } from './app-spinner.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-spinner',
  templateUrl: './app-spinner.component.html',
  styleUrls: ['./app-spinner.component.scss'],
})
export class AppSpinnerComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AppSpinnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppSpinnerModel,
  ) {}

  ngOnInit() {}
}
