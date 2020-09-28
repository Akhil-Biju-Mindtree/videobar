export const backgroundColor = 'background-color';

export class FabMiniModel {
  onClass: FabMiniButton;
  offClass: FabMiniButton;
  directiveClass: FabMiniDirective;
  disabledClass: FabMiniButton;

  constructor(
    onClass: FabMiniButton,
    offClass: FabMiniButton,
    directiveClass: FabMiniDirective,
    disabledClass?: FabMiniButton,
  ) {
    this.onClass = onClass;
    this.offClass = offClass;
    this.disabledClass = disabledClass;
    this.directiveClass = directiveClass;
  }
}

interface FabMiniDirective {
  onMouseEnter: OnMouseEvents;
  onMouseLeave: OnMouseEvents;
  onMouseUp: { backgroundColor: string };
  onMouseDown: { backgroundColor: string };
}

interface FabMiniButton {
  backgroundColor: string;
  backgroundImage: string;
  backgroundPosition: string;
  color: string;
  width: string;
  height: string;
}

interface OnMouseEvents {
  backgroundColor: string;
  color: string;
  opacity: string;
}
