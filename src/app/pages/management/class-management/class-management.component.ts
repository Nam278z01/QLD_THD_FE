import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { DataTableComponent } from 'ng-devui/data-table';

import { DialogService } from 'ng-devui/modal';
import { ToastService } from 'ng-devui/toast';

import { ApiService } from 'src/app/api.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss']
})
export class ClassManagementComponent {
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  @ViewChild('EditorTemplate', { static: true }) EditorTemplate: TemplateRef<any>;
  @ViewChild('ImportTemplate', { static: true }) ImportTemplate: TemplateRef<any>;
  basicDataSource = [];

  insert = true;
  doneSetup: Subscription;
  isSubmitting = false;
  editRowIndex = -1;
  deleteList: any[] = [];
  class: any;

  _search = {
    tengv: '',
    tenkh: '',
  };

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  searchForm: {
    borderType: '' | 'borderless' | 'bordered';
    size: 'sm' | 'md' | 'lg';
    layout: 'auto' | 'fixed';
  } = {
    borderType: 'bordered',
    size: 'md',
    layout: 'auto',
  };

  busy: Subscription;

  year: any = {
    selectedDate: new Date(),
  };

  date: any = {
    selectedDate: new Date(),
  };

  editForm: any = null;
  importForm: any = null;
  file: any[] = [];

  constructor(private api: ApiService, private dialogService: DialogService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getList();
  }

  search() {
    this.getList();
  }

  getList() {
    const data = {
      page: this.pager.pageIndex,
      pageSize: this.pager.pageSize,
      ...this._search,
    };

    this.busy = this.api.post('api/Lop/search', data).subscribe((res: any) => {
      let a = JSON.parse(JSON.stringify(res));
      this.basicDataSource = a.data;
      this.pager.total = a.totalItems;
    });
  }

  
  addRow() {
    this.insert = true;
    this.class = {};
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '65%',
      title: 'Thêm lớp học',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  editRow(index: number, id: any) {
    this.class = {};
    this.doneSetup = this.getSubjectById(id).subscribe((res: any) => {
      this.class.MaKhoi = res.data.makhoi;
      this.class.TenKhoi = res.data.tenkhoi;
     

    });
    this.insert = false;
    this.editRowIndex = index;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '65%',
      title: 'Cập nhập lớp học',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  getSubjectById(id: string) {
    return this.api.get('api/Lop/get-by-id/' + id);
  }

  onSubmitted({ valid, directive, data, errors }: any) {
    console.log('Valid:', valid, 'Directive:', directive, 'data', data, 'errors', errors);
    if (!valid) {
      this.toastService.open({
        value: [{ severity: 'warn', summary: 'Chú ý', content: `Chưa điền đủ thông tin được yêu cầu!` }],
      });
      return false;
    }
    if (this.isSubmitting) {
      return false;
    }

    this.isSubmitting = true;

    if (this.insert) {
      this.api.post('api/Lop/create', this.class).subscribe((res: any) => {
        this.class = {};
        this.toastService.open({
          value: [{ severity: 'success', summary: 'Thành công', content: `Thêm lớp học thành công!` }],
        });

        this.isSubmitting = false;
        this.getList();
      });
    } else {

      this.api.post('api/Lop/update', this.class).subscribe((res: any) => {
        this.toastService.open({
          value: [{ severity: 'success', summary: 'Thành công', content: `Cập nhập lớp học thành công!` }],
        });

        this.isSubmitting = false;
        this.getList();
      });
    }
    return true;
  }

  batchDelete(deleteList: any[]) {
    if (deleteList.length > 0) {
      const results = this.dialogService.open({
        id: 'delete-dialog',
        width: '600px',
        maxHeight: '600px',
        title: 'Xóa sản phẩm',
        showAnimate: true,
        content: `Bạn có chắc chắn muốn xóa ${deleteList.length} bản ghi?`,
        backdropCloseable: true,
        onClose: () => {},
        buttons: [
          {
            cssClass: 'primary',
            text: 'Ok',
            disabled: false,
            handler: ($event: Event) => {
              if (!this.isSubmitting) {
                this.isSubmitting = true;
                this.deleteRows(deleteList).subscribe((res) => {
                  results.modalInstance.hide();
                  this.reset();
                  this.toastService.open({
                    value: [{ severity: 'success', summary: 'Thành công', content: `Xóa lớp học thành công!` }],
                  });
                  this.isSubmitting = false;
                });
              }
            },
          },
          {
            id: 'btn-cancel',
            cssClass: 'common',
            text: 'Hủy',
            handler: ($event: Event) => {
              results.modalInstance.hide();
            },
          },
        ],
      });

      console.log(results);
    }
  }

  deleteRows(deleteList: any[]) {
    let ids: any[] = [];
    deleteList.forEach((item: any) => {
      ids.push(item.maKhoi)
    })

    return this.api.post('api/Lop/delete', ids)
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }

  onRowCheckChange(checked: any, rowIndex: any, nestedIndex: any, rowItem: any) {
    console.log(rowIndex, nestedIndex, rowItem.$checked);
    rowItem.$checked = checked;
    rowItem.$halfChecked = false;
    this.datatable.setRowCheckStatus({
      rowIndex: rowIndex,
      nestedIndex: nestedIndex,
      rowItem: rowItem,
      checked: checked,
    });

    this.deleteList = this.datatable.getCheckedRows();
    console.log(this.deleteList);
  }

  onCheckAllChange() {
    this.deleteList = this.datatable.getCheckedRows();
  }

  reset() {
    this.searchForm = {
      borderType: 'bordered',
      size: 'md',
      layout: 'auto',
    };
    this.pager.pageIndex = 1;
    this.getList();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getList();
  }
}
