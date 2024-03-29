import {
  Component,
  Inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NewDonerService } from '../../services/new-doner.service';
import { Doner } from '../../shared/types/doner';

@Component({
  selector: 'app-new-doner-form',
  templateUrl: './new-doner-form.component.html',
  styleUrls: ['./new-doner-form.component.scss'],
})
export class NewDonerFormComponent implements OnInit, OnChanges {
  newDonerForm!: FormGroup;

  constructor(
    private newDonerService: NewDonerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewDonerFormComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  initializeForm() {
    console.log('&&&&&');

    this.newDonerForm = new FormGroup({
      donerName: new FormControl('', [
        Validators.required,
        this.customValidator,
      ]),
      review: new FormControl(''),
    });
  }

  customValidator(control: FormControl) {
    const value = control.value;
    const regex = /(?:бонд|bond).*?(?:пидор|gey|pidor)/i;

    if (!value.match(regex)) {
      return null;
    } else {
      return { invalidValue: true };
    }
  }

  getErrorMessage() {
    if (this.newDonerForm.controls['donerName'].hasError('required')) {
      return 'You must enter a value';
    }
    return this.newDonerForm.controls['donerName'].hasError('invalidValue')
      ? 'No, Barm is gay'
      : '';
  }

  onSubmit() {
    if (this.newDonerForm.valid) {
      const newDoner: Doner = {
        name: this.newDonerForm.controls['donerName'].value,
        coordinates: {
          lat: this.data.e.latlng.lat,
          lon: this.data.e.latlng.lng,
        },
        rating: this.newDonerForm.controls['review'].value,
      };

      this.newDonerService.newDoner = newDoner;
      this.newDonerService
        .postNewDoner(newDoner)
        .subscribe((res) => console.log(res));
    }
  }
}
