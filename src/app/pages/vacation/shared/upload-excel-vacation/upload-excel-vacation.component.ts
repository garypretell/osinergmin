import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { BandejaService } from '@shared/services/bandeja.service';
import { FileValidators } from 'ngx-file-drag-drop';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-excel-vacation',
  templateUrl: './upload-excel-vacation.component.html',
  styleUrls: ['./upload-excel-vacation.component.scss']
})
export class UploadExcelVacationComponent implements OnInit {
  fileControl = new FormControl(
    [],
    [FileValidators.required,
    FileValidators.maxFileCount(1),
    FileValidators.fileExtension(['csv', 'xlsx', 'xls'])
  ]
  );
  constructor(public dialogRef: MatDialogRef<UploadExcelVacationComponent>,private bandejaService: BandejaService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fileControl.valueChanges.subscribe((files: File[]) =>
      console.log(this.fileControl.value, this.fileControl.valid)
    );
  }

  onValueChange(file: File[]) {
    console.log("File changed!");
  }

  uploadFileToActivity() {
    console.log(this.fileControl.value[0])
    const dialogRef = this.dialog.open(LoaderComponent, {
      width: '400px', data: {}, disableClose: true
    });
    const formData = new FormData();
    formData.append("file", this.fileControl.value[0]);
    this.bandejaService.cargarArchivo(formData).subscribe({
      next: (record: any) => {
        dialogRef.close();
        Swal.fire('El archivo ha sido cargado correctamente!').then((result) => {
          if (result.isConfirmed) {
            this.dialogRef.close();
          }
        })
      },
      error: error => {
        dialogRef.close();
        this.fileControl.reset();
      }
    })
  }

}
