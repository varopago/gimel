import {Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MdDialogRef} from '@angular/material';
import {CustomValidators, onValueChanged} from '../../../shared/utils';
import {CatalogService} from '../../../udc/catalog/services/catalog.service';
import {Type} from '../../models/catalog-type';

@Component({
  selector: 'app-catalog-type-view-attributes-dialog',
  templateUrl: './catalog-type-view-attributes-dialog.component.html',
  styleUrls: ['./catalog-type-view-attributes-dialog.component.scss'],
})

export class CatalogTypeViewAttributesDialogComponent implements OnInit {
  heading = '';
  editTypeForm: FormGroup;
  storageTypeId: number;
  storageTypeName: string;
  typeAttributes: Array<any>;
  editing = {};

  constructor(public dialogRef: MdDialogRef<CatalogTypeViewAttributesDialogComponent>, private fb: FormBuilder, private catalogService: CatalogService) {
  }

  ngOnInit() {
    this.editTypeForm = this.fb.group({
    });
    this.heading = 'Attributes for ' + this.storageTypeName;
    this.editTypeForm.valueChanges.subscribe(data => onValueChanged(this.editTypeForm, {}, []));
  }

  cancel() {
    this.dialogRef.close();
  }

  populateType(submitValue) {
    const data: Type = new Type();
    data.storageTypeId = this.storageTypeId;
    if (submitValue.modifiedStorageTypeName.length > 0) {
      data.storageTypeName = submitValue.modifiedStorageTypeName;
    }
    if (submitValue.modifiedStorageTypeDescription.length > 0) {
      data.storageTypeDescription = submitValue.modifiedStorageTypeDescription;
    }
    data.updatedUser = submitValue.updatedUser;
    data.attributeKeys = this.typeAttributes;
    return data;
  }

  onSubmit() {
    const submitValue = Object.assign({}, this.editTypeForm.value);
    const type: Type = this.populateType(submitValue);
    this.catalogService.getUserByName(type.updatedUser)
      .subscribe(data => {
        this.catalogService.updateType(type)
          .subscribe(result => {
            this.dialogRef.close({status: 'success'});
          }, error => {
            if (error.status === 500) {
              this.dialogRef.close({status: 'fail', error: ''});
            } else {
              this.dialogRef.close({status: 'fail', error: error});
            }
          });
      }, error => {
        this.dialogRef.close({status: 'user fail', error: 'Invalid Username'});
      });
  }
  updateValue(event, cell, row) {
    this.editing[row.$$index + '-' + cell] = false;
    this.typeAttributes[row.$$index][cell] = event.target.value;
  }
}
