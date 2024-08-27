program EmuHub;

uses
  Vcl.Forms,
  uPrincipal in 'Forms\uPrincipal.pas' {FormPrincipal},
  uEmpresas in 'Forms\uEmpresas.pas' {Form1};

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TFormPrincipal, FormPrincipal);
  Application.CreateForm(TForm1, Form1);
  Application.Run;
end.
