import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/servicios/data.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  mail: string;
  pass: string;
  msjError: string;
  logeando=true;
  spiner = false;
  ocultarVerificar: boolean;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private usuarioService: UsuarioService,
              public router: Router,
              public alertController: AlertController,
              private toast:ToastService) { }

  ngOnInit() {
    this.form = this.fb.group({
      mail: ['', [Validators.required]],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  ionViewWillEnter()
  {
    this.spiner = false;
  }

  entrar(){
    this.spiner = true;
    const { mail, clave } = this.form.value;

    this.usuarioService.getUserByMail(mail).then(res =>{
      if(res.length > 0)
      { 
        console.log(res[0]);
        if(res[0].estado==0 && res[0].perfil=="Cliente"){
          this.toast.error('Su usuario aún no fue validado por un administrador');
          console.log("mail no validado por administrador");
          this.spiner = false;
        }
        else{
          if(res[0].estado==-1 && res[0].perfil=="Cliente"){
            this.toast.error('Su usuario fue rechazado por un administrador');
            console.log("mail no validado por administrador");
            this.spiner = false;
          }
          else{
            this.authService.login(mail, clave).then( res => {
              this.router.navigate(['/home']);
              //this.spiner = false;
            }).catch(err => this.presentAlert(err));
          }
        }
      }
    });
  }

  entrarAnonimo(){
    this.spiner = true;
    this.authService.login('roumieusofia@hotmail.com', '123456').then( res => {
      this.router.navigate(['/home']);
      //this.spiner = false;
    }).catch(err => this.presentAlert(err));
  }

  registrar()
  {
    this.router.navigate(['/registro-cliente']);
  }

  // Registrar() {
  //   const { mail, clave } = this.form.value;

  //   this.authService.register(mail, clave).then(res => {
  //     this.router.navigate(['/login'])
  //   }).catch(err => this.presentAlert(err));
  // }

  // crear(){
  //   const { mail, clave } = this.form.value;

  //   let usuario = {
  //     mail: mail,
  //     pass: clave
  //   }

  //   this.dataService.crear("usuarios", usuario).then(res => {
  //     console.log("llega bien perri")
  //   }).catch(err => console.log(err));;
  // }

  limpiar(){
    this.form.setValue({
      mail: '',
      clave: ''
    });
  }

  async presentAlert(errores) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: errores,
      buttons: ['OK']
    });

    await alert.present();
  }

  autoLog(usuario) {
    switch (usuario) {
      case 'Mozo' :
        this.form.setValue({
          mail: 'dueño@mail.com',
          clave: '123456'
        });
        break;
      case 'Bar' :
        this.form.setValue({
          mail: 'supervisor@mail.com',
          clave: '123456'
        });
        break;
      case 'Admin' :
        this.form.setValue({
          mail: 'administrador@mail.com',
          clave: '123456'
        });
        break;
      case 'Cocinero' :
        this.form.setValue({
          mail: 'empleado@mail.com',
          clave: '123456'
        });
        break;
      case 'Cliente' :
        this.form.setValue({
          // mail: "cliente@mail.com",
          // clave: "123456"
          mail: 'roumieusofia@hotmail.com',
          clave: '123456'
        });
        break;
    }
  }

}
