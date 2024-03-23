import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-view',
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.scss'
})
export class RegisterViewComponent {

  registerForm!: FormGroup
  isSubmitted: boolean = false

  constructor(
    private formbuilder: FormBuilder,
    private authGateway: AuthGateway,
    private alert: AlertService,
    private router: Router
  ) { }


  ngOnInit() {
    /**
     * Créer une instance de FormGroup
     */

    this.registerForm = this.formbuilder.group({

      username: ['', [
        Validators.minLength(3),
        Validators.maxLength(26),
        Validators.required,
        Validators.pattern(/^\p{L}[\p{L}\-_]{1,23}\p{L}$/u)
      ]
      ],
      email: ['', [
        Validators.email,
        Validators.required
      ]
      ],
      password: ['', [
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!\\-_]).{8,}$"),
        Validators.minLength(8),
        Validators.required
      ]
      ]

    })


  }

  /**
   * Role verifier la validité et appeler
   * la méthode createUser du UserService
   */

  onSubmitRegisterForm() {

    this.isSubmitted = true
    console.log(this.registerForm)
    console.log(this.registerForm.value)
    if (this.registerForm.valid) {
      this.authGateway.register(this.registerForm.value)
        .subscribe((reponse) => {
          console.log(reponse);
          this.alert.show("Vous êtes bien inscrit");
          this.router.navigate(["login"])
        })
    }
  }

}
