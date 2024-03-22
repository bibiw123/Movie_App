import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss'
})
export class LoginViewComponent {

  loginForm!:FormGroup
  isSubmitted: boolean = false;

  constructor(
    private formbuilder:FormBuilder,
    private authGateway:AuthGateway,
    private alert: AlertService,
    private router: Router
  ) { }
  ngOnInit() {

    this.loginForm = this.formbuilder.group({

      email:['',Validators.email],
      password:''

      })

  }

  /**
   * Role verifier la validité et appeler
   * la méthode createUser du UserService
   */

  onSubmitLoginForm(){
    this.isSubmitted=true
    console.log(this.loginForm.value)
    if(this.loginForm.valid){
      this.authGateway.login(this.loginForm.value)
    }
  }

}
