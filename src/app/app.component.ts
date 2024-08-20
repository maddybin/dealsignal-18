import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, SimpleChanges } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = '';
  profile: any;

  constructor(private cdr: ChangeDetectorRef) {
    chrome.storage.local.get(['siteData'], (result: any) => {
      localStorage.setItem('siteData', JSON.stringify(result))
    });

    this.profile = null;
  }

  ngOnInit(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.title == 'fromBackground') {
        console.log(message.info)
        sendResponse(true);
      }

      if (message.title == 'refreshPage') {
        chrome.tabs.sendMessage(message.windowId, { title: 'parsePage', tab: message.windowId, ceTabId: message.ceTabId })
        sendResponse(true);
      }

      if (message.title == 'parsedData') {
        console.log(message.payload)
        this.profile = message.payload;
        this.cdr.detectChanges();
      }
    })
  }
}
