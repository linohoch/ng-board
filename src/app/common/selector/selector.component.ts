import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

export interface selectData {
  title: string,
  options: Array<{ key:string, value:string ,isSelected: boolean }>
}
// sample = {
//   title:'글 필터링',
//   options: [
//     { key:'all articles', value:'all', isSelected: true },
//     { key:'except deleted', value:'except', isSelected: false}
//   ]
// }

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class SelectorComponent implements AfterViewInit, OnInit{
  @Input() data: selectData | undefined
  mySelectEl: HTMLElement | undefined
  optionsEl: HTMLElement | undefined
  optionEl: HTMLElement | undefined
  labelEl: HTMLElement | undefined

  @Output() optionSelector : EventEmitter<string> = new EventEmitter<string>()
  keySelected : any

  constructor() {}

  ngOnInit() {
    this.keySelected = this.data?.options.filter(op => {
      return op.isSelected===true
    })[0].key
  }

  ngAfterViewInit() {
    this.mySelectEl = document.querySelector<HTMLElement>('.my-select')!
    this.optionsEl = document.querySelector('.select-options') as HTMLElement
    this.optionEl = document.querySelector('.select-option') as HTMLElement
    this.labelEl = document.querySelector('.label-selected') as HTMLElement
  }

  showOptions(){
    if(this.optionsEl && this.mySelectEl){
      let display = this.optionsEl.style.display
      this.optionsEl.style.display=(display==='none'||display==='')?'block':'none'
      let isSpread = this.mySelectEl.classList.contains('spread')
      if(isSpread) { this.mySelectEl.classList.remove('spread') }
      else { this.mySelectEl.classList.add('spread')}
    }
  }
  selectOption(option: any){
      this.keySelected = option.key
      this.data?.options.forEach((op)=> {
        op.isSelected = op.value === option.value;
      })
      this.optionSelector.emit(option)
    this.showOptions()
  }
}
