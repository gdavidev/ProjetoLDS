program EmuHub;

uses
  Vcl.Forms,
  uPrincipal in 'Forms\uPrincipal.pas' {FormPrincipal},
  uEmpresas in 'Forms\uEmpresas.pas' {formEmpresas};

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TFormPrincipal, FormPrincipal);
  Application.Run;
end.
