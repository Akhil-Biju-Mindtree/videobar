import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RippleGlobalOptions, MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { TextboxComponent } from './components/textbox/textbox.component';
import { SliderComponent } from './components/slider/slider.component';
import { TextviewComponent } from './components/textview/textview.component';
import { ButtonComponent } from './components/button/button.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { ButtonHighlighterDirective } from './directives/button-highlighter.directive';
import { NotificationComponent } from './components/notification/notification.component';
import { HideInWebDirective } from './directives/hide-in-web.directive';
import { HideInUsbAppDirective } from './directives/hide-in-usb-app.directive';
import { CustomBreakpointsModule } from './modules/custom-breakpoints.module';
import { TextboxWithLabelComponent } from './components/textbox-with-label/textbox-with-label.component';
import { SilderWithTextboxComponent } from './components/silder-with-textbox/silder-with-textbox.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { RadioButtonsComponent } from './components/radio-buttons/radio-buttons.component';
import { CameraVideoStreamComponent } from './components/camera-video-stream/camera-video-stream.component';
import { FabSmartButtonComponent } from './components/fab-smart-button/fab-smart-button.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { AppSpinnerComponent } from './components/app-spinner/app-spinner.component';
import { NumericDegreeTextboxComponent } from './components/textbox-family/numeric-degree-textbox/numeric-degree-textbox.component';
import { LabelNumericTextboxComponent } from './components/textbox-family/label-numeric-textbox/label-numeric-textbox.component';
import { TextFieldTextboxComponent } from './components/textbox-family/text-field-textbox/text-field-textbox.component';
import { RadioButtonHorizontalComponent } from './components/radio-buttons-family/radio-button-horizontal/radio-button-horizontal.component';
import { RadioButtonVerticalComponent } from './components/radio-buttons-family/radio-button-vertical/radio-button-vertical.component';
import { MenuDropdownComponent } from './components/menu-dropdown/menu-dropdown.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { NetworkIpSettingsComponent } from './components/network-ip-settings/network-ip-settings.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { NetworkIpStatusComponent } from './components/network-ip-status/network-ip-status.component';
import { WirelessPasswordComponent } from './components/dialog/dialog-content/wireless-password/wireless-password.component';
import { ResetPasswordComponent } from './components/dialog/dialog-content/reset-password/reset-password.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LowLightCompensationComponent } from './components/low-light-compensation/low-light-compensation.component';
import { ProgressDialogComponent } from './components/progress-dialog/progress-dialog.component';
import { ProfileDescriptionComponent } from './components/dialog/dialog-content/profile-description/profile-description.component';
import { ChangeBgColorDirective } from './directives/change-bg-color.directive';
import { NoCameraStreamComponent } from './components/camera-video-stream/no-camera-stream/no-camera-stream.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { FirmwareProgressDialogComponent } from './components/firmware-progress-dialog/firmware-progress-dialog.component';
import { AutoLogoutComponent } from './components/dialog/dialog-content/auto-logout/auto-logout.component';
import { TimeCounterPipe } from './pipes/time-counter.pipe';
import { NgIdleModule } from '@ng-idle/core';
import { HamburgerMenuComponent } from './components/hamburger-menu/hamburger-menu.component';
import { WirelessEapPasswordComponent } from './components/dialog/dialog-content/wireless-eap-password/wireless-eap-password.component';
import { WirelessOtherNetworkComponent } from './components/dialog/dialog-content/wireless-other-network/wireless-other-network.component';
import { EapSettingsComponent } from './components/eap-settings/eap-settings.component';
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';
import { EllipsisActiveDirective } from './directives/ellipsis-active.directive';

const globalRippleConfig: RippleGlobalOptions = {
  disabled: true,
};

@NgModule({
  declarations: [
    TextboxComponent,
    SliderComponent,
    TextviewComponent,
    ButtonComponent,
    TooltipComponent,
    ButtonHighlighterDirective,
    NotificationComponent,
    HideInWebDirective,
    HideInUsbAppDirective,
    TextboxWithLabelComponent,
    SilderWithTextboxComponent,
    ConfirmationDialogComponent,
    RadioButtonsComponent,
    CameraVideoStreamComponent,
    FabSmartButtonComponent,
    NavigationComponent,
    AppSpinnerComponent,
    NumericDegreeTextboxComponent,
    LabelNumericTextboxComponent,
    TextFieldTextboxComponent,
    RadioButtonHorizontalComponent,
    RadioButtonVerticalComponent,
    MenuDropdownComponent,
    ProgressBarComponent,
    DialogComponent,
    NetworkIpSettingsComponent,
    ToggleButtonComponent,
    NetworkIpStatusComponent,
    WirelessPasswordComponent,
    ResetPasswordComponent,
    FileUploadComponent,
    LowLightCompensationComponent,
    ProgressDialogComponent,
    ProfileDescriptionComponent,
    ChangeBgColorDirective,
    NoCameraStreamComponent,
    ContextMenuComponent,
    AutoFocusDirective,
    FirmwareProgressDialogComponent,
    AutoLogoutComponent,
    TimeCounterPipe,
    HamburgerMenuComponent,
    WirelessEapPasswordComponent,
    WirelessOtherNetworkComponent,
    EapSettingsComponent,
    SelectDropdownComponent,
    EllipsisActiveDirective,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    CustomBreakpointsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxFileDropModule,
    NgIdleModule.forRoot(),
  ],
  entryComponents: [
    NotificationComponent,
    ConfirmationDialogComponent,
    DialogComponent,
    AppSpinnerComponent,
    WirelessPasswordComponent,
    ResetPasswordComponent,
    ProgressDialogComponent,
    ProfileDescriptionComponent,
    FirmwareProgressDialogComponent,
    AutoLogoutComponent,
    WirelessEapPasswordComponent,
    WirelessOtherNetworkComponent,
  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TooltipComponent,
    ButtonHighlighterDirective,
    HideInWebDirective,
    HideInUsbAppDirective,
    CustomBreakpointsModule,
    SliderComponent,
    TextboxComponent,
    TextboxWithLabelComponent,
    SilderWithTextboxComponent,
    RadioButtonsComponent,
    CameraVideoStreamComponent,
    FabSmartButtonComponent,
    NavigationComponent,
    AppSpinnerComponent,
    NumericDegreeTextboxComponent,
    LabelNumericTextboxComponent,
    TextFieldTextboxComponent,
    RadioButtonHorizontalComponent,
    RadioButtonVerticalComponent,
    MenuDropdownComponent,
    ProgressBarComponent,
    NetworkIpSettingsComponent,
    ToggleButtonComponent,
    NetworkIpStatusComponent,
    FileUploadComponent,
    LowLightCompensationComponent,
    ContextMenuComponent,
    AutoFocusDirective,
    TimeCounterPipe,
    HamburgerMenuComponent,
    SelectDropdownComponent,
  ],
  providers: [{ provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig }],
})
export class SharedModule {}
