import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerModule, InputNumberModule, PaginationModule, TooltipModule, ToastModule } from 'ng-devui';

import { DialogService, BackTopModule } from 'ng-devui';
import { SharedModule } from '../../@shared/shared.module';
import { DaLayoutModule } from '../../@shared/layouts/da-layout';

import { NgxDropzoneModule } from 'ngx-dropzone';

import { ManagementRoutingModule } from './management-routing.module';
import { SubjectManagementComponent } from './subject-management/subject-management.component';


@NgModule({
  imports: [
    SharedModule,
    BackTopModule,
    DaLayoutModule,
    PaginationModule,
    TooltipModule,
    SharedModule,
    DatepickerModule,
    InputNumberModule,
    ToastModule,
    FormsModule,
    NgxDropzoneModule,
    ManagementRoutingModule
  ],
  declarations: [
    SubjectManagementComponent
  ],
  providers: [DialogService],
})
export class ManagementModule {}
