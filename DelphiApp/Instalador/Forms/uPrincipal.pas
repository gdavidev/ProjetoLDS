unit uPrincipal;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.Imaging.jpeg,
  Vcl.ExtCtrls, EMS.ResourceAPI, EMS.FileResource, Registry;

type
  TFormPrincipal = class(TForm)
    panelImage: TPanel;
    imgRetroFrame: TImage;
    panelPrincipal: TPanel;
    procedure FormShow(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
    procedure ExtractResourceToFile(const ResName, FileName: string);
    procedure InstallApplication;
    procedure ConfiguraRegedit;
  public
    { Public declarations }
    procedure TrocaFrame(Direcao: Integer);
    procedure DefineDiretorio(Dir: String);
  end;

var
  FormPrincipal: TFormPrincipal;
  ResStream: TResourceStream;
  FileStream: TFileStream;
  FrameAtivo: TFrame;
  NumFrame: Integer;
  Diretorio: String;

implementation

uses
  uFrAvisos,
  uFrCaminhos,
  uFrLoad;

{$R *.dfm}
{$R resources.res}

procedure TFormPrincipal.ConfiguraRegedit;
var
  Reg: TRegistry;
begin
  Reg := TRegistry.Create(KEY_WRITE);
  try
    Reg.RootKey := HKEY_CLASSES_ROOT;

    // Cria a chave EmuHub
    if Reg.OpenKey('EmuHub', True) then
    begin
      try
        // Define o valor da cadeia padrão
        Reg.WriteString('', 'EmuHub');

        // Define o valor da cadeia URL Protocol
        Reg.WriteString('URL Protocol', '');

        // Cria a chave shell
        if Reg.OpenKey('shell', True) then
        begin
          // Cria a chave open
          if Reg.OpenKey('open', True) then
          begin
            // Cria a chave command
            if Reg.OpenKey('command', True) then
            begin
              // Define o valor da cadeia padrão
              Reg.WriteString('', Diretorio + '\EmuHub\EmuHub.exe');
              Reg.CloseKey;
            end;
            Reg.CloseKey;
          end;
          Reg.CloseKey;
        end;
        Reg.CloseKey;
      except
        on E: Exception do
          ShowMessage('Erro ao criar chave do registro: ' + E.Message);
      end;
    end
    else
      ShowMessage('Não foi possível abrir a chave EmuHub.');
  finally
    Reg.Free;
  end;
end;

procedure TFormPrincipal.DefineDiretorio(Dir: String);
begin
  Diretorio := Dir;
end;

procedure TFormPrincipal.ExtractResourceToFile(const ResName, FileName: string);
begin
  ResStream := TResourceStream.Create(HInstance, ResName, RT_RCDATA);
  try
    FileStream := TFileStream.Create(FileName, fmCreate);
    try
      FileStream.CopyFrom(ResStream, ResStream.Size);
    finally
      FileStream.Free;
    end;
  finally
    ResStream.Free;
  end;
end;

procedure TFormPrincipal.FormCreate(Sender: TObject);
begin
  Left := (Screen.Width - Width) div 2;
  Top := (Screen.Height - Height) div 2;
end;

procedure TFormPrincipal.FormShow(Sender: TObject);
begin
  FrameAtivo := TfrAvisos.Create(Self);
  FrameAtivo.Parent := panelPrincipal;
  FrameAtivo.Show;
  NumFrame := 1;
end;

procedure TFormPrincipal.InstallApplication;
var
  DestFolder, AppFile: string;
begin
  DestFolder := Diretorio + '\EmuHub\';

  // Criar a pasta de destino se ela não existir
  if not DirectoryExists(DestFolder) then
    ForceDirectories(DestFolder);

  // Extrair os arquivos embutidos
  AppFile := DestFolder + 'EmuHub.exe';

  ExtractResourceToFile('EMUHUB_EXE', AppFile);
end;

procedure TFormPrincipal.TrocaFrame(Direcao: Integer);
begin
  case Direcao of
    0:
    begin
      case NumFrame of
        1:
          Close;

        2:
        begin
          FrameAtivo := nil;
          FrameAtivo := TfrAvisos.Create(Self);
          FrameAtivo.Parent := panelPrincipal;
          FrameAtivo.Show;
          NumFrame := 1;
        end;
      end;
    end;

    1:
    begin
      case NumFrame of
        1:
        begin
          FrameAtivo := nil;
          FrameAtivo := TfrCaminhos.Create(Self);
          FrameAtivo.Parent := panelPrincipal;
          FrameAtivo.Show;
          NumFrame := 2;
        end;

        2:
        begin
          FrameAtivo := nil;
          FrameAtivo := TfrLoad.Create(Self);
          FrameAtivo.Parent := panelPrincipal;
          InstallApplication;
          ConfiguraRegedit;
          FrameAtivo.Show;
          NumFrame := 3;
        end;

        3:
          Close;
      end;
    end;
  end;
end;

end.

