program EmuHubInstaller;

{$R 'resources.res' 'resources.rc'}

uses
  Vcl.Forms,
  uFrAvisos in 'Forms\uFrAvisos.pas' {frAvisos: TFrame},
  uFrCaminhos in 'Forms\uFrCaminhos.pas' {frCaminhos: TFrame},
  uFrLoad in 'Forms\uFrLoad.pas' {frLoad: TFrame},
  uPrincipal in 'Forms\uPrincipal.pas' {FormPrincipal};

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TFormPrincipal, FormPrincipal);
  Application.Run;
end.
