import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-register-view',
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.scss'
})
export class RegisterViewComponent {

  registerForm!:FormGroup
  isSubmitted:boolean=false

  constructor(private formbuilder:FormBuilder) { }


  ngOnInit() {
    /**
     * Créer une instance de FormGroup
     */
  
    this.registerForm = this.formbuilder.group({

      username:['',[Validators.minLength(3),Validators.maxLength(26)]],
      email:['',Validators.email],
      password:['',[
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!\\-_]).{8,}$"),
        Validators.minLength(8),  
      ]]

      })

    
  }

  /**
   * Role verifier la validité et appeler 
   * la méthode createUser du UserService
   */
 
  onSubmitRegisterForm(){

    this.isSubmitted=true
    console.log(this.registerForm)
    console.log(this.registerForm.value)
  }

}
