program EmuHub;

uses
  Vcl.Forms,
  uPrincipal in 'Forms\uPrincipal.pas' {formPrincipal},
  uEmpresas in 'Forms\uEmpresas.pas' {formEmpresas},
  uNintendo in 'Forms\uNintendo.pas' {formNintendo},
  uGBA in 'Forms\uGBA.pas' {formGBA},
  uLibrary in 'uLibrary.pas',
  uDownload in 'TesteFuncionalidade\uDownload.pas' {Form1};

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TformPrincipal, formPrincipal);
  Application.Run;
end.
