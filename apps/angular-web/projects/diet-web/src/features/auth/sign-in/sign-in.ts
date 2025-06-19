import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CiuiInput, CiuiButton } from '@curseit/ciui';

@Component({
  selector: 'cid-sign-in',
  imports: [RouterLink, CiuiInput, CiuiButton],
  templateUrl: './sign-in.html',
  styleUrls: ['../auth.scss'],
})
export class SignIn {}
