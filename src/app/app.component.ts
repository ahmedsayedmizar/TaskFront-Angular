import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'loopback-front';
  dataGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phone: [, [Validators.required]],
  })
  phoneExist = false;
  isphoneExist = false;
  allData
  editId = -1
  nameEdit
  phoneEdit
  searchItem
  searchMode = false
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsers()
  }
  edit(data) {
    this.editId = data.id
    this.nameEdit = data.name;
    this.phoneEdit = data.phone
  }
  save() {
    let obj = {
      "name": this.dataGroup.get('name').value,
      "phone": this.dataGroup.get('phone').value
    }
    const name = this.dataGroup.get('name').value;
    const phone = this.dataGroup.get('phone').value;

    if (name.length < 3) {
      alert("name must bigger than 3 character")
    } else if (isNullOrUndefined(name) || isNullOrUndefined(phone)) {
      alert("name of phone must not empty")

    } else {

      const index = this.allData.findIndex(x => x.phone == this.dataGroup.get('phone').value)
      if (index == -1) {
        this.http.post('http://localhost:3000/api/model1s', obj
        ).subscribe(res => {
          this.allData.push(res)
          this.dataGroup.reset()
        })
      } else {
        alert("phone exist")
      }

    }
  }
  getUsers() {
    this.http.get('http://localhost:3000/api/model1s').subscribe(res => {
      this.allData = res
      this.searchMode = false

    })
  }

  delete(id) {
    const url = `${'http://localhost:3000/api/model1s'}/${id}`;
    this.http.delete(url).subscribe(res => {
      if (res["count"] > 0) {
        const index = this.allData.findIndex(x => x.id === id)
        this.allData.splice(index, 1);
      } else {
        alert("not deleted")
      }

    })
  }

  update(id, name, phone) {
    let obj = {
      "name": name,
      "phone": phone
    }
    const url = `${'http://localhost:3000/api/model1s'}/${id}/${'replace'}`;
    this.http.post(url, obj).subscribe(res => {
      const index = this.allData.findIndex(x => x.id === this.editId)
      this.allData[index] = res

      this.editId = -1
    })
  }

  // findOne?
  search(name: any): any {
    this.searchMode = true

    this.http.get('http://localhost:3000/api/model1s').subscribe(res => {
      this.allData = res
      let result = [];
      for (let index = 0; index < this.allData.length; index++) {
         if(this.allData[index].name ===name){
           result.push(this.allData[index])
         }
      }
      this.allData=[];
      this.allData=result;

    })
   

  }

  checkPhoneExist() {

  }
}
