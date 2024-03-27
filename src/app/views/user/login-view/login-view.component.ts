import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';
import { UserGateway } from '../../../core/ports/user.gateway';
import { UserCredentialsDTO } from '../../../core/dto/user-credentials.dto';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss'
})
export class LoginViewComponent {

  loginForm!: FormGroup
  isSubmitted: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private authGateway: AuthGateway,
    private userGateway: UserGateway,
    private alert: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  /**
   * onSubmitLoginForm
   * Role : 
   * - verifier la validité 
   * - appeler la méthode login du UserService
   * - afficher un message de succès
   * - router l'utilisateur vers la page d'accueil
  */
  onSubmitLoginForm() {
    console.log(this.loginForm.value);
    this.isSubmitted = true;
    const credentials: UserCredentialsDTO = this.loginForm.value;

    if (this.loginForm.valid) {
      this.authGateway.login(credentials).subscribe((response: any) => {
        this.userGateway.createUserModelAfterLogin(response.user)
        this.alert.show("Vous êtes bien connecté(e)", 'success');
        this.router.navigate(['']);
      })
    }
    else {
      this.alert.show("Corrigez vos erreurs", 'error');
    }
  }

  loginFred() {
    this.loginForm.setValue({
      email: 'fred2@gmail.com',
      password: 'Fred-2024#'
    });
    this.onSubmitLoginForm();
  }
  loginAnge() {
    this.loginForm.setValue({
      email: 'ange@gmail.com',
      password: 'Ange2024!'
    });
    this.onSubmitLoginForm();
  }

}
