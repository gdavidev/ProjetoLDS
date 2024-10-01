unit uGBA;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.ExtCtrls, Vcl.StdCtrls,
  System.ImageList, Vcl.ImgList, Vcl.VirtualImageList, Vcl.BaseImageCollection,
  Vcl.ImageCollection;

type
  TformGBA = class(TForm)
    pnlPrincipal: TPanel;
    btnVoltar: TButton;
    imgCollectionIcones: TImageCollection;
    vImgListIcones: TVirtualImageList;
    sbPrincipal: TScrollBox;
    ImageList: TImageList;
    procedure btnVoltarClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
    procedure CarregaRoms;
    procedure BotaoClick(Sender: TObject);
  public
    { Public declarations }
  end;

var
  formGBA: TformGBA;

implementation

uses
  uPrincipal, System.IOUtils, System.Win.Registry, uLibrary,
   System.Generics.Collections, ShellAPI, Vcl.Imaging.pngimage, Vcl.Buttons;

var
  DiretorioPadrao: String;

{$R *.dfm}

procedure TformGBA.CarregaRoms;
var
  Diretorio: String;
  Arquivos: TArray<string>;
  Arquivo: string;
  BotoesRoms: TList<TSpeedButton>;
  Botao: TSpeedButton;
  I: Integer;
  PNGImage: TPNGImage; // Para imagens PNG
  Bitmap: TBitmap; // Para bitmap
begin
  Diretorio := DiretorioPadrao + 'Nintendo\GBA\Roms';

  if not TDirectory.Exists(Diretorio) then
  begin
    pnlPrincipal.Caption := 'Nenhuma Rom de GBA';
    Exit;
  end;

  Arquivos := TDirectory.GetFiles(Diretorio, '*.gba', TSearchOption.soTopDirectoryOnly);

  BotoesRoms := TList<TSpeedButton>.Create; // Inicializa a lista de botões
  try
    I := 0;
    for Arquivo in Arquivos do
    begin
      // Cria o botão
      Botao := TSpeedButton.Create(Self);
      Botao.Parent := sbPrincipal; // Define o painel como pai do botão
      Botao.Align := alTop;
      Botao.Height := 145;
      Botao.Name := 'btn' + IntToStr(I); // Use o índice ou outra forma para nomear o botão

      // Define o Caption do botão sem a extensão .gba
      Botao.Caption := ChangeFileExt(ExtractFileName(Arquivo), '');

      Botao.OnClick := BotaoClick;

      // Criar novas instâncias para cada iteração
      PNGImage := TPNGImage.Create;
      Bitmap := TBitmap.Create;
      try
        // Verifica se a imagem existe
        if FileExists(Diretorio + '\' + ChangeFileExt(ExtractFileName(Arquivo), '.png')) then
        begin
          // Carregar a imagem de um arquivo
          PNGImage.LoadFromFile(Diretorio + '\' + ChangeFileExt(ExtractFileName(Arquivo), '.png'));

          // Converter o PNG para um Bitmap
          Bitmap.Assign(PNGImage);

          // Adicionar o Bitmap à ImageList
          ImageList.Add(Bitmap, nil); // O segundo parâmetro é a máscara, se necessário

          // Alternativamente, se você quiser adicionar uma máscara:
          // ImageList.AddMasked(Bitmap, clFuchsia); // Usando uma cor de máscara

          // Define a imagem do botão
          Botao.Images := ImageList;
          Botao.ImageIndex := ImageList.Count - 1; // Usar o índice da imagem recém-adicionada
        end;

      finally
        Bitmap.Free;     // Libera o Bitmap após adicionar
        PNGImage.Free;   // Libera a imagem PNG
      end;

      // Adiciona o botão à lista de botões
      BotoesRoms.Add(Botao);
      I := I + 1;
    end;
  finally
    BotoesRoms.Free; // Certifique-se de liberar a lista de botões se não precisar mais
  end;
end;


procedure TformGBA.BotaoClick(Sender: TObject);
var
  Botao: TSpeedButton;
  Comando: string;
begin
  Botao := Sender as TSpeedButton;
  Comando := 'start /b ' + DiretorioPadrao + 'Nintendo\GBA\mGBA.exe -f ' +
  '"' + DiretorioPadrao + 'Nintendo\GBA\Roms\' + Botao.Caption + '.gba"';
  // Executa o comando no CMD
  ShellExecute(0, 'open', 'cmd.exe', PChar('/C ' + Comando), nil, SW_SHOWNORMAL);
end;

procedure TformGBA.FormCreate(Sender: TObject);
begin
  DiretorioPadrao := PegaDiretorio;
  CarregaRoms;
end;

procedure TformGBA.btnVoltarClick(Sender: TObject);
begin
  TformPrincipal(Owner).TrocaForm('Nintendo');
end;

end.
