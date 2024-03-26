import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'ui-yt-player',
  templateUrl: './yt-player.component.html',
  styleUrl: './yt-player.component.scss'
})
export class YtPlayerComponent {

  @Input() videoKey!: string;

  constructor(private _sanitize: DomSanitizer) { }

  getFullVideoUrl(): SafeResourceUrl {
    return this._sanitize.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + this.videoKey);
  }

}
