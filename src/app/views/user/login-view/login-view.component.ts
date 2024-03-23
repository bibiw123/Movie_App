import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';
import { Credentials } from '../../../core/models/user.model';
import { UserGateway } from '../../../core/ports/user.gateway';

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
      email: ['', [Validators.email]],
      password: ''
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
    const credentials: Credentials = this.loginForm.value;

    if (this.loginForm.valid) {
      this.authGateway.login(credentials).subscribe((response: any) => {
        this.userGateway.createUserModelAfterLogin(response.user)
        this.alert.show("Vous êtes bien connecté(e)");
        this.router.navigate(['']);
      })
    }
  }

}
